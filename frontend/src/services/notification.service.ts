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
  async getNotifications(page = 1, limit = 5): Promise<PaginatedNotifications> {
    const response = await api.get(`/v1/notifications?page=${page}&limit=${limit}`);
    return response.data.data;
  }
}

export const notificationService = new NotificationService();
