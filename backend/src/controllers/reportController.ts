import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import reportService from '../services/reportService';
import { sendSuccessResponse } from '../utils/responseHelper';
import { ReportFilters, ReportSorting } from '../repositories/reportRepository';
import { getPaginationOptions } from '../utils/paginationHelper';

class ReportController {

  private extractFiltersAndSorting(req: Request): { filters: ReportFilters; sorting: ReportSorting } {
    const { employeeId, priority, status, startDate, endDate, search, sortBy, sortOrder } = req.query;
    const { page, limit } = getPaginationOptions(req.query);
    const offset = (page - 1) * limit;

    return {
      filters: {
        employeeId: employeeId ? Number(employeeId) : undefined,
        priority: priority as string,
        status: status as string,
        startDate: startDate as string,
        endDate: endDate as string,
        search: search as string,
        limit,
        offset
      },
      sorting: {
        sortBy: sortBy as string,
        sortOrder: (sortOrder as string)?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC'
      }
    };
  }

  getCompletedTasks = asyncHandler(async (req: Request, res: Response) => {
    const { filters, sorting } = this.extractFiltersAndSorting(req);
    const data = await reportService.getCompletedTasks(filters, sorting, req.user!);
    return sendSuccessResponse(res, 200, 'Report generated successfully', data);
  });

  exportCompletedCSV = asyncHandler(async (req: Request, res: Response) => {
    const { filters, sorting } = this.extractFiltersAndSorting(req);
    // Ignore pagination for export
    delete filters.limit;
    delete filters.offset;
    
    const data = await reportService.getCompletedTasks(filters, sorting, req.user!);
    const csv = reportService.generateCSV(data);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="completed_tasks.csv"');
    res.status(200).send(csv);
  });

  exportCompletedExcel = asyncHandler(async (req: Request, res: Response) => {
    const { filters, sorting } = this.extractFiltersAndSorting(req);
    delete filters.limit;
    delete filters.offset;
    
    const data = await reportService.getCompletedTasks(filters, sorting, req.user!);
    await reportService.generateExcel(res, data, 'Completed Tasks', 'completed_tasks');
  });

  getPendingTasks = asyncHandler(async (req: Request, res: Response) => {
    const { filters, sorting } = this.extractFiltersAndSorting(req);
    const data = await reportService.getPendingTasks(filters, sorting, req.user!);
    return sendSuccessResponse(res, 200, 'Report generated successfully', data);
  });

  exportPendingCSV = asyncHandler(async (req: Request, res: Response) => {
    const { filters, sorting } = this.extractFiltersAndSorting(req);
    delete filters.limit;
    delete filters.offset;
    
    const data = await reportService.getPendingTasks(filters, sorting, req.user!);
    const csv = reportService.generateCSV(data);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="pending_tasks.csv"');
    res.status(200).send(csv);
  });

  exportPendingExcel = asyncHandler(async (req: Request, res: Response) => {
    const { filters, sorting } = this.extractFiltersAndSorting(req);
    delete filters.limit;
    delete filters.offset;
    
    const data = await reportService.getPendingTasks(filters, sorting, req.user!);
    await reportService.generateExcel(res, data, 'Pending Tasks', 'pending_tasks');
  });

  getEmployeeWiseReport = asyncHandler(async (req: Request, res: Response) => {
    const { filters, sorting } = this.extractFiltersAndSorting(req);
    const data = await reportService.getEmployeeWiseReport(filters, sorting, req.user!);
    return sendSuccessResponse(res, 200, 'Report generated successfully', data);
  });

  exportEmployeeCSV = asyncHandler(async (req: Request, res: Response) => {
    const { filters, sorting } = this.extractFiltersAndSorting(req);
    delete filters.limit;
    delete filters.offset;
    
    const data = await reportService.getEmployeeWiseReport(filters, sorting, req.user!);
    const csv = reportService.generateCSV(data);
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="employee_report.csv"');
    res.status(200).send(csv);
  });

  exportEmployeeExcel = asyncHandler(async (req: Request, res: Response) => {
    const { filters, sorting } = this.extractFiltersAndSorting(req);
    delete filters.limit;
    delete filters.offset;
    
    const data = await reportService.getEmployeeWiseReport(filters, sorting, req.user!);
    await reportService.generateExcel(res, data, 'Employee Report', 'employee_report');
  });
}

export default new ReportController();
