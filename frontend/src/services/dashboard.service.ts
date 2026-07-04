import api from './api';

export interface AdminDashboardData {
  stats: {
    totalEmployees: number;
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    highPriorityTasks: number;
    mediumPriorityTasks: number;
    lowPriorityTasks: number;
    overdueTasks: number;
    todaysTasks: number;
    tasksDueThisWeek: number;
    tasksDueThisMonth: number;
  };
  recentTasks: any[];
  latestEmployees: any[];
}

export interface EmployeeDashboardData {
  stats: {
    myTasks: number;
    completedTasks: number;
    pendingTasks: number;
    inProgressTasks: number;
    overdueTasks: number;
    tasksDueToday: number;
    tasksDueThisWeek: number;
    highPriorityTasks: number;
  };
  latestAssignedTasks: any[];
  upcomingDeadlines: any[];
}

class DashboardService {
  async getAdminDashboard(): Promise<AdminDashboardData> {
    const response = await api.get('/v1/dashboard/admin');
    return response.data.data;
  }

  async getEmployeeDashboard(): Promise<EmployeeDashboardData> {
    const response = await api.get('/v1/dashboard/employee');
    return response.data.data;
  }
}

export const dashboardService = new DashboardService();
