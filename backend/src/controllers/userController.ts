import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import userService from '../services/userService';
import { sendSuccessResponse } from '../utils/responseHelper';
import { getPaginationOptions, getPaginationData } from '../utils/paginationHelper';

class UserController {
  getAllEmployees = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder } = getPaginationOptions(req.query);
    const search = (req.query.search as string) || '';

    const { data, totalRecords } = await userService.getAllEmployees(
      page,
      limit,
      search,
      sortBy as string,
      sortOrder as string
    );

    const pagination = getPaginationData(totalRecords, page, limit);

    return sendSuccessResponse(res, 200, 'Employees retrieved successfully', {
      employees: data,
      pagination
    });
  });

  getEmployeeById = asyncHandler(async (req: Request, res: Response) => {
    const employeeId = parseInt(req.params.id as string, 10);
    const employee = await userService.getEmployeeById(employeeId);
    return sendSuccessResponse(res, 200, 'Employee retrieved successfully', { employee });
  });

  createEmployee = asyncHandler(async (req: Request, res: Response) => {
    const newEmployee = await userService.createEmployee(req.body);
    return sendSuccessResponse(res, 201, 'Employee created successfully', { employee: newEmployee });
  });

  updateEmployee = asyncHandler(async (req: Request, res: Response) => {
    const employeeId = parseInt(req.params.id as string, 10);
    const updatedEmployee = await userService.updateEmployee(employeeId, req.body);
    return sendSuccessResponse(res, 200, 'Employee updated successfully', { employee: updatedEmployee });
  });

  deleteEmployee = asyncHandler(async (req: Request, res: Response) => {
    const employeeId = parseInt(req.params.id as string, 10);
    await userService.deleteEmployee(employeeId);
    return sendSuccessResponse(res, 200, 'Employee deleted successfully', {});
  });
}

export default new UserController();
