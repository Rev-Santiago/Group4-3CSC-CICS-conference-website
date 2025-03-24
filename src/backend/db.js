import dotenv from "dotenv"; // Load env variables
dotenv.config();

import mysql from "mysql2";
import process from "process";

// DEBUG: Log environment variables
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "********" : "NOT SET");
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_PORT:", process.env.DB_PORT);

// Ensure all required env vars exist
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME || !process.env.DB_PORT) {
    console.error("❌ Missing required environment variables!");
    process.exit(1);
}

// Create MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT), // Ensure it's a number
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check Connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err);
        process.exit(1); // Exit if database fails to connect
    }
    console.log("✅ MySQL Database Connected");
    connection.release(); // Release connection
});

// Exporting promise-based pool for async/await support
const db = pool.promise();
export default db;
