import pool from '../database/connection';
import { RowDataPacket } from 'mysql2';

export class DashboardRepository {
  async getAdminDashboard(): Promise<any> {
    const userQuery = `SELECT COUNT(*) as TotalEmployees FROM users`;
    const taskQuery = `
      SELECT 
        COUNT(*) as TotalTasks,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as CompletedTasks,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as PendingTasks,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as InProgressTasks,
        SUM(CASE WHEN priority = 'HIGH' THEN 1 ELSE 0 END) as HighPriorityTasks,
        SUM(CASE WHEN priority = 'MEDIUM' THEN 1 ELSE 0 END) as MediumPriorityTasks,
        SUM(CASE WHEN priority = 'LOW' THEN 1 ELSE 0 END) as LowPriorityTasks,
        SUM(CASE WHEN status != 'COMPLETED' AND due_date < CURRENT_DATE THEN 1 ELSE 0 END) as OverdueTasks,
        SUM(CASE WHEN DATE(due_date) = CURRENT_DATE THEN 1 ELSE 0 END) as TodaysTasks,
        SUM(CASE WHEN YEARWEEK(due_date, 1) = YEARWEEK(CURRENT_DATE, 1) THEN 1 ELSE 0 END) as TasksDueThisWeek,
        SUM(CASE WHEN YEAR(due_date) = YEAR(CURRENT_DATE) AND MONTH(due_date) = MONTH(CURRENT_DATE) THEN 1 ELSE 0 END) as TasksDueThisMonth
      FROM tasks
    `;
    
    const [userResult] = await pool.query<RowDataPacket[]>(userQuery);
    const [taskResult] = await pool.query<RowDataPacket[]>(taskQuery);
    
    const userStats = userResult[0];
    const stats = taskResult[0] || {};

    const [recentTasks] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, priority, status, due_date, assigned_employee_id, created_at 
       FROM tasks ORDER BY created_at DESC LIMIT 10`
    );

    const [latestEmployees] = await pool.query<RowDataPacket[]>(
      `SELECT id, full_name, email, role, department, designation, created_at 
       FROM users ORDER BY created_at DESC LIMIT 10`
    );

    return {
      stats: {
        totalEmployees: Number(userStats.TotalEmployees || 0),
        totalTasks: Number(stats.TotalTasks || 0),
        completedTasks: Number(stats.CompletedTasks || 0),
        pendingTasks: Number(stats.PendingTasks || 0),
        inProgressTasks: Number(stats.InProgressTasks || 0),
        highPriorityTasks: Number(stats.HighPriorityTasks || 0),
        mediumPriorityTasks: Number(stats.MediumPriorityTasks || 0),
        lowPriorityTasks: Number(stats.LowPriorityTasks || 0),
        overdueTasks: Number(stats.OverdueTasks || 0),
        todaysTasks: Number(stats.TodaysTasks || 0),
        tasksDueThisWeek: Number(stats.TasksDueThisWeek || 0),
        tasksDueThisMonth: Number(stats.TasksDueThisMonth || 0),
      },
      recentTasks,
      latestEmployees
    };
  }

  async getEmployeeDashboard(employeeId: number): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as MyTasks,
        SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as CompletedTasks,
        SUM(CASE WHEN status = 'PENDING' THEN 1 ELSE 0 END) as PendingTasks,
        SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as InProgressTasks,
        SUM(CASE WHEN status != 'COMPLETED' AND due_date < CURRENT_DATE THEN 1 ELSE 0 END) as OverdueTasks,
        SUM(CASE WHEN DATE(due_date) = CURRENT_DATE THEN 1 ELSE 0 END) as TasksDueToday,
        SUM(CASE WHEN YEARWEEK(due_date, 1) = YEARWEEK(CURRENT_DATE, 1) THEN 1 ELSE 0 END) as TasksDueThisWeek,
        SUM(CASE WHEN priority = 'HIGH' THEN 1 ELSE 0 END) as HighPriorityTasks
      FROM tasks 
      WHERE assigned_employee_id = ?
    `;

    const [statsResult] = await pool.query<RowDataPacket[]>(query, [employeeId]);
    const stats = statsResult[0];

    const [latestAssignedTasks] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, priority, status, due_date, created_at 
       FROM tasks 
       WHERE assigned_employee_id = ? 
       ORDER BY created_at DESC LIMIT 10`,
       [employeeId]
    );

    const [upcomingDeadlines] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, priority, status, due_date 
       FROM tasks 
       WHERE assigned_employee_id = ? AND status != 'COMPLETED' AND due_date >= CURRENT_DATE 
       ORDER BY due_date ASC LIMIT 10`,
       [employeeId]
    );

    return {
      stats: {
        myTasks: Number(stats.MyTasks || 0),
        completedTasks: Number(stats.CompletedTasks || 0),
        pendingTasks: Number(stats.PendingTasks || 0),
        inProgressTasks: Number(stats.InProgressTasks || 0),
        overdueTasks: Number(stats.OverdueTasks || 0),
        tasksDueToday: Number(stats.TasksDueToday || 0),
        tasksDueThisWeek: Number(stats.TasksDueThisWeek || 0),
        highPriorityTasks: Number(stats.HighPriorityTasks || 0),
      },
      latestAssignedTasks,
      upcomingDeadlines
    };
  }
}

export default new DashboardRepository();
