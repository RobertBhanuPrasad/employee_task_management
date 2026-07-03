import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import notificationService from '../services/notificationService';
import { sendSuccessResponse } from '../utils/responseHelper';
import { getPaginationOptions } from '../utils/paginationHelper';

class NotificationController {
  getNotifications = asyncHandler(async (req: Request, res: Response) => {
    const { page, limit } = getPaginationOptions(req.query);
    const data = await notificationService.getNotifications(req.user!, page, limit);
    return sendSuccessResponse(res, 200, 'Notifications fetched successfully', data);
  });

  getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
    const data = await notificationService.getUnreadCount(req.user!);
    return sendSuccessResponse(res, 200, 'Unread count fetched successfully', data);
  });

  markRead = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    await notificationService.markRead(id, req.user!);
    return sendSuccessResponse(res, 200, 'Notification marked as read', {});
  });

  markAllRead = asyncHandler(async (req: Request, res: Response) => {
    const data = await notificationService.markAllRead(req.user!);
    return sendSuccessResponse(res, 200, 'All notifications marked as read', data);
  });

  deleteNotification = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string, 10);
    await notificationService.deleteNotification(id, req.user!);
    return sendSuccessResponse(res, 200, 'Notification deleted successfully', {});
  });

  createDueTomorrowNotifications = asyncHandler(async (req: Request, res: Response) => {
    const data = await notificationService.createDueTomorrowNotifications();
    return sendSuccessResponse(res, 201, 'Due tomorrow notifications generated successfully', { created: data });
  });

  // Test endpoints for generating notifications
  triggerTaskAssigned = asyncHandler(async (req: Request, res: Response) => {
    const { userId, taskId } = req.body;
    const data = await notificationService.createTaskAssignedNotification(userId, taskId);
    return sendSuccessResponse(res, 201, 'Task Assigned notification triggered', { id: data });
  });

  triggerTaskCompleted = asyncHandler(async (req: Request, res: Response) => {
    const { userId, taskId } = req.body;
    const data = await notificationService.createTaskCompletedNotification(userId, taskId);
    return sendSuccessResponse(res, 201, 'Task Completed notification triggered', { id: data });
  });
}

export default new NotificationController();
