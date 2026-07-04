import api from './api';

export interface ReportFilters {
  employeeId?: number | string;
  status?: string;
  priority?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface CompletedTaskRow {
  'Task ID': number;
  'Title': string;
  'Employee Name': string;
  'Department': string;
  'Priority': string;
  'Completed Date': string;
}

export interface PendingTaskRow {
  'Task ID': number;
  'Title': string;
  'Employee Name': string;
  'Priority': string;
  'Status': string;
  'Due Date': string | null;
}

export interface EmployeeWiseRow {
  'Employee Name': string;
  'Department': string;
  'Total Tasks': number;
  'Completed Tasks': number;
  'Pending Tasks': number;
  'Overdue Tasks': number;
}

const generateQueryString = (filters: ReportFilters): string => {
  const params = new URLSearchParams();
  params.append('limit', '5000');
  
  if (filters.employeeId) params.append('employeeId', filters.employeeId.toString());
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.startDate) params.append('startDate', filters.startDate);
  if (filters.endDate) params.append('endDate', filters.endDate);
  if (filters.search) params.append('search', filters.search);
  
  return params.toString();
};

class ReportService {
  async getCompletedTasks(filters: ReportFilters = {}): Promise<CompletedTaskRow[]> {
    const response = await api.get(`/v1/reports/completed?${generateQueryString(filters)}`);
    return response.data.data;
  }

  async getPendingTasks(filters: ReportFilters = {}): Promise<PendingTaskRow[]> {
    const response = await api.get(`/v1/reports/pending?${generateQueryString(filters)}`);
    return response.data.data;
  }

  async getEmployeeWise(filters: ReportFilters = {}): Promise<EmployeeWiseRow[]> {
    const response = await api.get(`/v1/reports/employee-wise?${generateQueryString(filters)}`);
    return response.data.data;
  }

  async exportReport(type: 'completed' | 'pending' | 'employee-wise', format: 'csv' | 'excel', filters: ReportFilters = {}): Promise<Blob> {
    const response = await api.get(`/v1/reports/${type}/export/${format}?${generateQueryString(filters)}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

export const reportService = new ReportService();
