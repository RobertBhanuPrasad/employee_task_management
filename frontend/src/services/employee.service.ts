import api from './api';

export interface Employee {
  id: number;
  full_name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE';
  department?: string;
  designation?: string;
  created_at?: string;
}

export interface EmployeeFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedEmployees {
  employees: Employee[];
  pagination: {
    totalRecords: number;
    currentPage: number;
    totalPages: number;
    limit: number;
  };
}

export interface CreateEmployeePayload {
  full_name: string;
  email: string;
  password?: string;
  confirm_password?: string;
  role: 'ADMIN' | 'EMPLOYEE';
  department?: string;
  designation?: string;
}

export interface UpdateEmployeePayload {
  full_name?: string;
  role?: 'ADMIN' | 'EMPLOYEE';
  department?: string;
  designation?: string;
}

class EmployeeService {
  async getEmployees(filters: EmployeeFilters = {}): Promise<PaginatedEmployees> {
    const params = new URLSearchParams();
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.order) params.append('order', filters.order);

    const response = await api.get(`/v1/employees?${params.toString()}`);
    return response.data.data;
  }

  async getEmployeeById(id: number): Promise<Employee> {
    const response = await api.get(`/v1/employees/${id}`);
    return response.data.data;
  }

  async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    const response = await api.post('/v1/employees', payload);
    return response.data.data;
  }

  async updateEmployee(id: number, payload: UpdateEmployeePayload): Promise<Employee> {
    const response = await api.put(`/v1/employees/${id}`, payload);
    return response.data.data;
  }

  async deleteEmployee(id: number): Promise<void> {
    await api.delete(`/v1/employees/${id}`);
  }
}

export const employeeService = new EmployeeService();
