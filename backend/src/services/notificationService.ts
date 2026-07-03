import notificationRepository from '../repositories/notificationRepository';
import { JwtPayload } from '../utils/jwt';
import ApiError from '../utils/ApiError';

export class NotificationService {
  async getNotifications(user: JwtPayload, page: number, limit: number) {
    const offset = (page - 1) * limit;
    const { data, total } = await notificationRepository.getNotifications(user.id, limit, offset);

    return {
      notifications: data,
      pagination: {
        totalRecords: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    };
  }

  async getUnreadCount(user: JwtPayload) {
    const count = await notificationRepository.getUnreadCount(user.id);
    return { unreadCount: count };
  }

  async markRead(id: number, user: JwtPayload) {
    const notification = await notificationRepository.getNotificationById(id);
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }
    if (notification.user_id !== user.id) {
      throw new ApiError(403, 'Forbidden Access');
    }

    const success = await notificationRepository.markRead(id, user.id);
    if (!success) {
      throw new ApiError(500, 'Failed to mark notification as read');
    }
    return true;
  }

  async markAllRead(user: JwtPayload) {
    const count = await notificationRepository.markAllRead(user.id);
    return { updatedCount: count };
  }

  async deleteNotification(id: number, user: JwtPayload) {
    const notification = await notificationRepository.getNotificationById(id);
    if (!notification) {
      throw new ApiError(404, 'Notification not found');
    }
    if (notification.user_id !== user.id) {
      throw new ApiError(403, 'Forbidden Access');
    }

    const success = await notificationRepository.deleteNotification(id, user.id);
    if (!success) {
      throw new ApiError(500, 'Failed to delete notification');
    }
    return true;
  }

  async createDueTomorrowNotifications() {
    return await notificationRepository.createDueTomorrowNotifications();
  }

  async createTaskAssignedNotification(userId: number, taskId: number) {
    return await notificationRepository.createNotification(
      userId,
      taskId,
      'Task Assigned',
      'You have been assigned a new task.',
      'TASK_ASSIGNED'
    );
  }

  async createTaskCompletedNotification(userId: number, taskId: number) {
    return await notificationRepository.createNotification(
      userId,
      taskId,
      'Task Completed',
      'Task has been completed successfully.',
      'TASK_COMPLETED'
    );
  }
}

export default new NotificationService();
