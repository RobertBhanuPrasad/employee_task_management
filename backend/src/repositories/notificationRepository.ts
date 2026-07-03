import pool from '../database/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class NotificationRepository {
  async createNotification(userId: number, taskId: number | null, title: string, message: string, type: string): Promise<number> {
    const query = `
      INSERT INTO notifications (user_id, task_id, title, message, type)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query<ResultSetHeader>(query, [userId, taskId, title, message, type]);
    return result.insertId;
  }

  async getNotifications(userId: number, limit: number, offset: number): Promise<{ data: any[], total: number }> {
    const countQuery = `SELECT COUNT(*) as total FROM notifications WHERE user_id = ?`;
    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, [userId]);
    const total = countResult[0].total;

    const query = `
      SELECT id, user_id, task_id, title, message, type, is_read, created_at
      FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query<RowDataPacket[]>(query, [userId, limit, offset]);

    return { data: rows, total };
  }

  async getUnreadCount(userId: number): Promise<number> {
    const query = `SELECT COUNT(*) as unreadCount FROM notifications WHERE user_id = ? AND is_read = 0`;
    const [result] = await pool.query<RowDataPacket[]>(query, [userId]);
    return result[0].unreadCount;
  }

  async markRead(id: number, userId: number): Promise<boolean> {
    const query = `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`;
    const [result] = await pool.query<ResultSetHeader>(query, [id, userId]);
    return result.affectedRows > 0;
  }

  async markAllRead(userId: number): Promise<number> {
    const query = `UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0`;
    const [result] = await pool.query<ResultSetHeader>(query, [userId]);
    return result.affectedRows;
  }

  async deleteNotification(id: number, userId: number): Promise<boolean> {
    const query = `DELETE FROM notifications WHERE id = ? AND user_id = ?`;
    const [result] = await pool.query<ResultSetHeader>(query, [id, userId]);
    return result.affectedRows > 0;
  }

  async createDueTomorrowNotifications(): Promise<number> {
    const query = `
      INSERT INTO notifications (user_id, task_id, title, message, type)
      SELECT assigned_employee_id, id, 'Task Due Tomorrow', 'Your task is due tomorrow.', 'TASK_DUE'
      FROM tasks
      WHERE due_date = DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY)
        AND status != 'COMPLETED'
        AND NOT EXISTS (
          SELECT 1 FROM notifications n
          WHERE n.task_id = tasks.id AND n.type = 'TASK_DUE'
        )
    `;
    const [result] = await pool.query<ResultSetHeader>(query);
    return result.affectedRows;
  }

  async getNotificationById(id: number): Promise<any> {
    const query = `SELECT * FROM notifications WHERE id = ?`;
    const [result] = await pool.query<RowDataPacket[]>(query, [id]);
    return result[0] || null;
  }
}

export default new NotificationRepository();
