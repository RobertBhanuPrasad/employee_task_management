import dashboardRepository from '../repositories/dashboardRepository';
import { JwtPayload } from '../utils/jwt';
import ApiError from '../utils/ApiError';

export class DashboardService {
  async getAdminDashboard(user: JwtPayload) {
    if (user.role !== 'ADMIN') {
      throw new ApiError(403, 'Unauthorized access: Admin only');
    }
    return dashboardRepository.getAdminDashboard();
  }

  async getEmployeeDashboard(user: JwtPayload) {
    if (user.role !== 'EMPLOYEE') {
      throw new ApiError(403, 'Unauthorized access: Employee only');
    }
    return dashboardRepository.getEmployeeDashboard(user.id);
  }
}

export default new DashboardService();
