import mysql from 'mysql2/promise';
import { config } from '../config/env';

// Create the connection pool
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Function to test the connection on startup
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database Connected Successfully');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

export default pool;
