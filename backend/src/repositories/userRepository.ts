import pool from '../database/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class UserRepository {
  async findAll(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    sortOrder: string
  ): Promise<{ data: RowDataPacket[]; totalRecords: number }> {
    const offset = (page - 1) * limit;

    let searchCondition = '';
    const queryParams: any[] = [];
    let countParams: any[] = [];

    if (search) {
      searchCondition = `WHERE full_name LIKE ? OR email LIKE ? OR department LIKE ? OR designation LIKE ?`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    const allowedSortColumns = ['full_name', 'email', 'department', 'designation', 'role', 'created_at'];
    const finalSortBy = allowedSortColumns.includes(sortBy) ? sortBy : 'created_at';
    const finalSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';

    const countQuery = `SELECT COUNT(*) as total FROM users ${searchCondition}`;
    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countParams);
    const totalRecords = countResult[0].total;

    const dataQuery = `
      SELECT id, full_name, email, role, department, designation, created_at, updated_at 
      FROM users 
      ${searchCondition} 
      ORDER BY ${finalSortBy} ${finalSortOrder} 
      LIMIT ? OFFSET ?
    `;
    queryParams.push(limit, offset);

    const [data] = await pool.query<RowDataPacket[]>(dataQuery, queryParams);

    return { data, totalRecords };
  }

  async findById(id: number): Promise<RowDataPacket | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, full_name, email, role, department, designation, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findByEmail(email: string): Promise<RowDataPacket | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async create(employeeData: any): Promise<number> {
    const { full_name, email, password, role, department, designation } = employeeData;
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (full_name, email, password, role, department, designation, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [full_name, email, password, role, department || null, designation || null]
    );
    return result.insertId;
  }

  async update(id: number, employeeData: any): Promise<boolean> {
    const fieldsToUpdate = [];
    const values = [];

    if (employeeData.full_name !== undefined) {
      fieldsToUpdate.push('full_name = ?');
      values.push(employeeData.full_name);
    }
    if (employeeData.department !== undefined) {
      fieldsToUpdate.push('department = ?');
      values.push(employeeData.department);
    }
    if (employeeData.designation !== undefined) {
      fieldsToUpdate.push('designation = ?');
      values.push(employeeData.designation);
    }
    if (employeeData.role !== undefined) {
      fieldsToUpdate.push('role = ?');
      values.push(employeeData.role);
    }

    if (fieldsToUpdate.length === 0) return true;

    fieldsToUpdate.push('updated_at = NOW()');
    values.push(id);

    const updateQuery = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    const [result] = await pool.query<ResultSetHeader>(updateQuery, values);

    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

export default new UserRepository();
