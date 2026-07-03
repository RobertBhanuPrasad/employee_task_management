import pool from '../database/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class AuthRepository {
  async findByEmail(email: string): Promise<RowDataPacket | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async findById(id: number): Promise<RowDataPacket | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  async createUser(userData: any): Promise<number> {
    const { full_name, email, password, role, department, designation } = userData;
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO users (full_name, email, password, role, department, designation, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [full_name, email, password, role, department || null, designation || null]
    );
    return result.insertId;
  }
}

export default new AuthRepository();
