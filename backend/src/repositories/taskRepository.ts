import pool from '../database/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class TaskRepository {
  async employeeExists(employeeId: number): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM users WHERE id = ?',
      [employeeId]
    );
    return rows.length > 0;
  }

  async taskExists(taskId: number): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM tasks WHERE id = ?',
      [taskId]
    );
    return rows.length > 0;
  }

  async createTask(taskData: any): Promise<number> {
    const { title, description, priority, status, start_date, due_date, assigned_employee_id } = taskData;
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO tasks (title, description, priority, status, start_date, due_date, assigned_employee_id, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, description || null, priority, status, start_date, due_date, assigned_employee_id]
    );
    return result.insertId;
  }

  async getAllTasks(
    page: number,
    limit: number,
    search: string,
    status: string,
    priority: string,
    employeeId: number | null,
    sortBy: string,
    sortOrder: string
  ): Promise<{ data: RowDataPacket[]; totalRecords: number }> {
    const offset = (page - 1) * limit;

    const conditions: string[] = [];
    const queryParams: any[] = [];
    const countParams: any[] = [];

    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm);
    }
    
    if (status) {
      conditions.push('status = ?');
      queryParams.push(status);
      countParams.push(status);
    }

    if (priority) {
      conditions.push('priority = ?');
      queryParams.push(priority);
      countParams.push(priority);
    }

    if (employeeId !== null) {
      conditions.push('assigned_employee_id = ?');
      queryParams.push(employeeId);
      countParams.push(employeeId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    const allowedSortColumns = ['title', 'priority', 'status', 'start_date', 'due_date', 'created_at'];
    const finalSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const finalSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';

    const countQuery = `SELECT COUNT(*) as total FROM tasks ${whereClause}`;
    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countParams);
    const totalRecords = countResult[0].total;

    const dataQuery = `
      SELECT id, title, description, priority, status, start_date, due_date, assigned_employee_id, created_at, updated_at 
      FROM tasks 
      ${whereClause} 
      ORDER BY ${finalSortBy} ${finalSortOrder} 
      LIMIT ? OFFSET ?
    `;
    queryParams.push(limit, offset);

    const [data] = await pool.query<RowDataPacket[]>(dataQuery, queryParams);

    return { data, totalRecords };
  }

  async getTaskById(taskId: number): Promise<RowDataPacket | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, title, description, priority, status, start_date, due_date, assigned_employee_id, created_at, updated_at FROM tasks WHERE id = ?',
      [taskId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async updateTask(taskId: number, taskData: any): Promise<boolean> {
    const fieldsToUpdate = [];
    const values = [];

    if (taskData.title !== undefined) {
      fieldsToUpdate.push('title = ?');
      values.push(taskData.title);
    }
    if (taskData.description !== undefined) {
      fieldsToUpdate.push('description = ?');
      values.push(taskData.description);
    }
    if (taskData.priority !== undefined) {
      fieldsToUpdate.push('priority = ?');
      values.push(taskData.priority);
    }
    if (taskData.status !== undefined) {
      fieldsToUpdate.push('status = ?');
      values.push(taskData.status);
    }
    if (taskData.start_date !== undefined) {
      fieldsToUpdate.push('start_date = ?');
      values.push(taskData.start_date);
    }
    if (taskData.due_date !== undefined) {
      fieldsToUpdate.push('due_date = ?');
      values.push(taskData.due_date);
    }
    if (taskData.assigned_employee_id !== undefined) {
      fieldsToUpdate.push('assigned_employee_id = ?');
      values.push(taskData.assigned_employee_id);
    }

    if (fieldsToUpdate.length === 0) return true;

    fieldsToUpdate.push('updated_at = NOW()');
    values.push(taskId);

    const updateQuery = `UPDATE tasks SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    const [result] = await pool.query<ResultSetHeader>(updateQuery, values);

    return result.affectedRows > 0;
  }

  async deleteTask(taskId: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM tasks WHERE id = ?',
      [taskId]
    );
    return result.affectedRows > 0;
  }
}

export default new TaskRepository();
