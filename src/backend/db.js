import dotenv from "dotenv"; // Load env variables
dotenv.config();

import mysql from "mysql2";
import process from "process";
import { parse } from "url"; // To parse DATABASE_URL

// Check if DATABASE_URL is set (Railway provides this)
const dbUrl = process.env.DATABASE_URL;

if (!dbUrl) {
    console.error("❌ DATABASE_URL is not defined in environment variables.");
    process.exit(1);
}

// Parse DATABASE_URL
const { hostname, port, auth, pathname } = new URL(dbUrl);
const [user, password] = auth.split(":");
const database = pathname.substring(1); // Remove leading "/"

// Create MySQL Connection Pool
const pool = mysql.createPool({
    host: hostname,
    user,
    password,
    database,
    port: Number(port),
    waitForConnections: true,
    connectionLimit: 10, // Limits the number of connections to 10
    queueLimit: 0
});

// Check Connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database Connection Failed:", err);
        process.exit(1); // Exit if connection fails
    }
    console.log("✅ MySQL Database Connected");
    connection.release();
});

// Exporting promise-based pool for async/await support
const db = pool.promise();
export default db;
