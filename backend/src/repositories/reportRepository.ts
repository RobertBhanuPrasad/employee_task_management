import pool from '../database/connection';
import { RowDataPacket } from 'mysql2';

export interface ReportFilters {
  employeeId?: number;
  priority?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ReportSorting {
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export class ReportRepository {
  
  private buildWhereClause(baseQuery: string, params: any[], filters: ReportFilters) {
    let query = baseQuery;
    if (filters.employeeId) {
      query += ` AND t.assigned_employee_id = ?`;
      params.push(filters.employeeId);
    }
    if (filters.priority) {
      query += ` AND t.priority = ?`;
      params.push(filters.priority);
    }
    if (filters.status) {
      query += ` AND t.status = ?`;
      params.push(filters.status);
    }
    if (filters.startDate && filters.endDate) {
      query += ` AND t.due_date BETWEEN ? AND ?`;
      params.push(filters.startDate, filters.endDate);
    }
    if (filters.search) {
      query += ` AND (t.title LIKE ? OR u.full_name LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }
    return query;
  }

  private buildOrderAndLimit(query: string, params: any[], sorting: ReportSorting, filters: ReportFilters, defaultSortColumn: string = 't.created_at') {
    const validSortColumns = ['t.id', 't.title', 'u.full_name', 't.due_date', 't.priority', 't.status', 't.updated_at', 't.created_at', 'u.department', 'Total Tasks'];
    let sortBy = defaultSortColumn;
    if (sorting.sortBy && validSortColumns.includes(sorting.sortBy)) {
      sortBy = sorting.sortBy;
    }
    const sortOrder = sorting.sortOrder === 'ASC' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY ${sortBy} ${sortOrder}`;

    if (filters.limit) {
      query += ` LIMIT ? OFFSET ?`;
      params.push(Number(filters.limit), Number(filters.offset || 0));
    }
    
    return query;
  }

  async getCompletedTasks(filters: ReportFilters, sorting: ReportSorting): Promise<any[]> {
    let query = `
      SELECT 
        t.id AS \`Task ID\`, 
        t.title AS \`Title\`, 
        u.full_name AS \`Employee Name\`,
        u.department AS \`Department\`,
        t.priority AS \`Priority\`,
        t.updated_at AS \`Completed Date\`
      FROM tasks t
      JOIN users u ON t.assigned_employee_id = u.id
      WHERE t.status = 'COMPLETED'
    `;
    const params: any[] = [];
    query = this.buildWhereClause(query, params, filters);
    query = this.buildOrderAndLimit(query, params, sorting, filters, 't.updated_at');

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows;
  }

  async getPendingTasks(filters: ReportFilters, sorting: ReportSorting): Promise<any[]> {
    let query = `
      SELECT 
        t.id AS \`Task ID\`, 
        t.title AS \`Title\`, 
        u.full_name AS \`Employee Name\`,
        t.priority AS \`Priority\`,
        t.due_date AS \`Due Date\`,
        t.status AS \`Status\`
      FROM tasks t
      JOIN users u ON t.assigned_employee_id = u.id
      WHERE t.status != 'COMPLETED'
    `;
    const params: any[] = [];
    query = this.buildWhereClause(query, params, filters);
    query = this.buildOrderAndLimit(query, params, sorting, filters, 't.due_date');

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows;
  }

  async getEmployeeWiseReport(filters: ReportFilters, sorting: ReportSorting): Promise<any[]> {
    let query = `
      SELECT 
        u.id AS \`Employee ID\`,
        u.full_name AS \`Employee Name\`,
        u.department AS \`Department\`,
        COUNT(t.id) AS \`Total Tasks\`,
        SUM(CASE WHEN t.status = 'COMPLETED' THEN 1 ELSE 0 END) AS \`Completed Tasks\`,
        SUM(CASE WHEN t.status != 'COMPLETED' THEN 1 ELSE 0 END) AS \`Pending Tasks\`,
        SUM(CASE WHEN t.status != 'COMPLETED' AND t.due_date < CURRENT_DATE THEN 1 ELSE 0 END) AS \`Overdue Tasks\`
      FROM users u
      LEFT JOIN tasks t ON u.id = t.assigned_employee_id
    `;
    const params: any[] = [];
    
    // For employee-wise, 'where' clause mostly applies to users or we filter the tasks beforehand
    // But filters like employeeId, we just filter the user
    query += ` WHERE u.role = 'EMPLOYEE'`;
    if (filters.employeeId) {
      query += ` AND u.id = ?`;
      params.push(filters.employeeId);
    }
    if (filters.search) {
      query += ` AND (u.full_name LIKE ? OR u.department LIKE ?)`;
      params.push(`%${filters.search}%`, `%${filters.search}%`);
    }

    query += ` GROUP BY u.id`;

    // Sort by Total Tasks default for employee report
    query = this.buildOrderAndLimit(query, params, sorting, filters, '\`Total Tasks\`');

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    
    // Clean up internal Employee ID before returning if not strictly required, but it's fine.
    return rows.map(r => {
      const { 'Employee ID': _, ...rest } = r;
      return rest;
    });
  }
}

export default new ReportRepository();
