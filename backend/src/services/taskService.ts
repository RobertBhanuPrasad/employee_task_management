import taskRepository from '../repositories/taskRepository';
import ApiError from '../utils/ApiError';
import { JwtPayload } from '../utils/jwt';
import { CreateTaskDto, UpdateTaskDto } from '../dtos/task.dto';
import notificationService from './notificationService';

export class TaskService {
  private validateDates(startDateStr: string, dueDateStr: string) {
    const startDate = new Date(startDateStr);
    const dueDate = new Date(dueDateStr);

    // Remove time components for strict date comparison if needed, 
    // but direct comparison handles ISO well enough.
    if (dueDate < startDate) {
      throw new ApiError(400, 'Due Date must never be earlier than Start Date.');
    }
  }

  async createTask(taskData: CreateTaskDto, user: JwtPayload) {
    if (user.role !== 'ADMIN') {
      throw new ApiError(403, 'Only admins can create tasks.');
    }

    this.validateDates(taskData.start_date, taskData.due_date);

    const employeeExists = await taskRepository.employeeExists(taskData.assigned_employee_id);
    if (!employeeExists) {
      throw new ApiError(404, 'Assigned Employee must exist.');
    }

    const payload = {
      ...taskData,
      created_by: user.id
    };

    const newTaskId = await taskRepository.createTask(payload);
    
    // Fire Task Assigned Notification
    await notificationService.createTaskAssignedNotification(taskData.assigned_employee_id, newTaskId);

    return await taskRepository.getTaskById(newTaskId);
  }

  async getAllTasks(
    page: number,
    limit: number,
    search: string,
    status: string,
    priority: string,
    queryEmployeeId: number | null,
    sortBy: string,
    sortOrder: string,
    user: JwtPayload
  ) {
    let effectiveEmployeeId = queryEmployeeId;

    // Employees should only retrieve their own tasks. Admins retrieve all tasks.
    if (user.role === 'EMPLOYEE') {
      effectiveEmployeeId = user.id;
    }

    return taskRepository.getAllTasks(
      page,
      limit,
      search,
      status,
      priority,
      effectiveEmployeeId,
      sortBy,
      sortOrder
    );
  }

  async getTaskById(taskId: number, user: JwtPayload) {
    const task = await taskRepository.getTaskById(taskId);
    if (!task) {
      throw new ApiError(404, 'Task not found');
    }

    if (user.role === 'EMPLOYEE' && task.assigned_employee_id !== user.id) {
      throw new ApiError(403, 'Employees can never access another employee\'s task.');
    }

    return task;
  }

  async updateTask(taskId: number, taskData: UpdateTaskDto, user: JwtPayload) {
    if (user.role !== 'ADMIN') {
      throw new ApiError(403, 'Only admins can update tasks.');
    }

    const existingTask = await taskRepository.getTaskById(taskId);
    if (!existingTask) {
      throw new ApiError(404, 'Task not found');
    }

    // Completed Tasks cannot be edited.
    if (existingTask.status === 'COMPLETED') {
      throw new ApiError(400, 'Completed Tasks cannot be edited.');
    }

    // Determine start/due dates for validation
    const startDate = taskData.start_date || existingTask.start_date;
    const dueDate = taskData.due_date || existingTask.due_date;
    
    // Validate dates if either is being updated
    if (taskData.start_date || taskData.due_date) {
      this.validateDates(startDate, dueDate);
    }

    if (taskData.assigned_employee_id && taskData.assigned_employee_id !== existingTask.assigned_employee_id) {
      const employeeExists = await taskRepository.employeeExists(taskData.assigned_employee_id);
      if (!employeeExists) {
        throw new ApiError(404, 'Assigned Employee must exist.');
      }
    }

    await taskRepository.updateTask(taskId, taskData);
    
    // Fire Task Completed Notification if status changed to COMPLETED
    if (taskData.status === 'COMPLETED' && existingTask.status !== 'COMPLETED') {
      await notificationService.createTaskCompletedNotification(existingTask.assigned_employee_id, taskId);
    }

    // Fire Task Assigned Notification if assigned employee changed
    if (taskData.assigned_employee_id && taskData.assigned_employee_id !== existingTask.assigned_employee_id) {
      await notificationService.createTaskAssignedNotification(taskData.assigned_employee_id, taskId);
    }

    return await taskRepository.getTaskById(taskId);
  }

  async deleteTask(taskId: number, user: JwtPayload) {
    if (user.role !== 'ADMIN') {
      throw new ApiError(403, 'Only admins can delete tasks.');
    }

    const taskExists = await taskRepository.taskExists(taskId);
    if (!taskExists) {
      throw new ApiError(404, 'Task not found');
    }

    await taskRepository.deleteTask(taskId);
    return true;
  }
}

export default new TaskService();
