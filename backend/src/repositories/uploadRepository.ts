import pool from '../database/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface FileUploadData {
  task_id: number;
  file_name: string;
  original_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
}

export class UploadRepository {
  async uploadFile(data: FileUploadData): Promise<number> {
    const query = `
      INSERT INTO uploads (task_id, file_name, original_name, file_path, file_type, file_size)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query<ResultSetHeader>(query, [
      data.task_id,
      data.file_name,
      data.original_name,
      data.file_path,
      data.file_type,
      data.file_size
    ]);
    return result.insertId;
  }

  async getTaskFiles(taskId: number): Promise<any[]> {
    const query = `
      SELECT id, task_id, file_name, original_name, file_path, file_type, file_size, uploaded_at
      FROM uploads
      WHERE task_id = ?
      ORDER BY uploaded_at DESC
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [taskId]);
    return rows as any[];
  }

  async getFileById(id: number): Promise<any | null> {
    const query = `
      SELECT id, task_id, file_name, original_name, file_path, file_type, file_size, uploaded_at
      FROM uploads
      WHERE id = ?
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [id]);
    return rows.length > 0 ? rows[0] : null;
  }

  async deleteFile(id: number): Promise<boolean> {
    const query = `DELETE FROM uploads WHERE id = ?`;
    const [result] = await pool.query<ResultSetHeader>(query, [id]);
    return result.affectedRows > 0;
  }
}

export default new UploadRepository();
