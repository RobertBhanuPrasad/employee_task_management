import api from './api';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_task_id: number | null;
  created_at: string;
}

export interface PaginatedNotifications {
  notifications: Notification[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    limit: number;
    totalPages: number;
  };
}

class NotificationService {
  async getNotifications(page = 1, limit = 10): Promise<PaginatedNotifications> {
    const response = await api.get(`/v1/notifications?page=${page}&limit=${limit}`);
    return response.data.data;
  }

  async getUnreadCount(): Promise<number> {
    const response = await api.get('/v1/notifications/unread-count');
    return response.data.data.unreadCount;
  }

  async markRead(id: number): Promise<void> {
    await api.patch(`/v1/notifications/${id}/read`);
  }

  async markAllRead(): Promise<void> {
    await api.patch('/v1/notifications/read-all');
  }
}

export const notificationService = new NotificationService();
