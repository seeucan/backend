import dotenv from "dotenv";
dotenv.config();
import mysql from "mysql2/promise";
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true, // 대기 중인 연결을 기다리도록 설정
    connectionLimit: 100, // 최대 연결 수
    queueLimit: 0 // 대기열 제한 (무제한)
  });
  
export default pool;