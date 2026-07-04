import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import taskService from '../services/taskService';
import { sendSuccessResponse } from '../utils/responseHelper';
import { getPaginationOptions, getPaginationData } from '../utils/paginationHelper';

class TaskController {
  createTask = asyncHandler(async (req: Request, res: Response) => {
    const newTask = await taskService.createTask(req.body, req.user!);
    return sendSuccessResponse(res, 201, 'Task created successfully', { task: newTask });
  });

  getAllTasks = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationOptions(req.query);
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || '';
    const priority = (req.query.priority as string) || '';
    const queryEmployeeId = req.query.employeeId ? parseInt(req.query.employeeId as string, 10) : null;

    const { data, totalRecords } = await taskService.getAllTasks(
      page,
      limit,
      search,
      status,
      priority,
      queryEmployeeId,
      sortBy,
      sortOrder,
      req.user!
    );

    const pagination = getPaginationData(totalRecords, page, limit);

    return sendSuccessResponse(res, 200, 'Tasks retrieved successfully', {
      tasks: data,
      pagination
    });
  });

  getTaskById = asyncHandler(async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id as string, 10);
    const task = await taskService.getTaskById(taskId, req.user!);
    return sendSuccessResponse(res, 200, 'Task retrieved successfully', { task });
  });

  updateTask = asyncHandler(async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id as string, 10);
    const updatedTask = await taskService.updateTask(taskId, req.body, req.user!);
    return sendSuccessResponse(res, 200, 'Task updated successfully', { task: updatedTask });
  });

  deleteTask = asyncHandler(async (req: Request, res: Response) => {
    const taskId = parseInt(req.params.id as string, 10);
    await taskService.deleteTask(taskId, req.user!);
    return sendSuccessResponse(res, 200, 'Task deleted successfully', {});
  });
}

export default new TaskController();
