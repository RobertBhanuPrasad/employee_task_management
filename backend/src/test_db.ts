import mysql from 'mysql2/promise';
async function test() {
  try {
    const pool = mysql.createPool({
      host: 'localhost',
      port: 3306,
      user: 'root',
      database: 'employee_task_management',
    });
    const conn = await pool.getConnection();
    console.log("Connected!");
    conn.release();
    process.exit(0);
  } catch (err) {
    console.error("Failed:", err);
    process.exit(1);
  }
}
test();
