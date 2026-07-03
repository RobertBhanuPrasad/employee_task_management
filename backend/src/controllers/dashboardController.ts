import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import dashboardService from '../services/dashboardService';
import { sendSuccessResponse } from '../utils/responseHelper';

class DashboardController {
  getAdminDashboard = asyncHandler(async (req: Request, res: Response) => {
    const data = await dashboardService.getAdminDashboard(req.user!);
    return sendSuccessResponse(res, 200, 'Dashboard fetched successfully', data);
  });

  getEmployeeDashboard = asyncHandler(async (req: Request, res: Response) => {
    const data = await dashboardService.getEmployeeDashboard(req.user!);
    return sendSuccessResponse(res, 200, 'Dashboard fetched successfully', data);
  });
}

export default new DashboardController();
