import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

// Cek koneksi
db.connect((err) => {
  if (err) {
    console.error("MySQL Connection Failed:", err);
  } else {
    console.log("MySQL Connected...");
  }
});

export default db;
