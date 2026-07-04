import api from './api';

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  start_date: string;
  due_date: string;
  assigned_employee_id: number;
  created_by?: number;
  created_at?: string;
  assigned_employee_name?: string; // May be joined by backend
}

export interface TaskFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  priority?: string;
  employeeId?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedTasks {
  tasks: Task[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  start_date: string;
  due_date: string;
  assigned_employee_id: number;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  start_date?: string;
  due_date?: string;
  assigned_employee_id?: number;
}

class TaskService {
  async getTasks(filters: TaskFilters = {}): Promise<PaginatedTasks> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.employeeId) params.append('employeeId', filters.employeeId.toString());
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

    const response = await api.get(`/v1/tasks?${params.toString()}`);
    return response.data.data;
  }

  async getTaskById(id: number): Promise<Task> {
    const response = await api.get(`/v1/tasks/${id}`);
    return response.data.data.task;
  }

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const response = await api.post('/v1/tasks', payload);
    return response.data.data.task;
  }

  async updateTask(id: number, payload: UpdateTaskPayload): Promise<Task> {
    const response = await api.put(`/v1/tasks/${id}`, payload);
    return response.data.data.task;
  }

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/v1/tasks/${id}`);
  }
}

export const taskService = new TaskService();
