import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import db from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import process from "process";

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ✅ Security Middleware
app.use(helmet()); // Security headers
app.use(express.json());

// ✅ CORS Configuration
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// ✅ Rate Limiting for Login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: { error: "Too many login attempts. Please try again later." },
});

// 🛡️ Middleware to Authenticate JWT Tokens
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(403).json({ error: "Access denied." });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token." });
        req.user = user;
        next();
    });
};


// 🚀 Check API Status
app.get("/api", (req, res) => {
    res.json({ message: "✅ API is working!" });
});

// 📢 Fetch Conference Publications with Pagination
app.get("/api/publications", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const [totalResult] = await db.execute("SELECT COUNT(*) AS total FROM conference_publications");
        const totalRecords = totalResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        const [rows] = await db.query(
            `SELECT publication_date, publication_description FROM conference_publications
             ORDER BY publication_date DESC
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        res.json({ data: rows, totalPages, currentPage: page });

    } catch (error) {
        console.error("Error fetching publications:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📢 Fetch Latest Publications
app.get("/api/publications/latest", async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT publication_date, publication_description 
             FROM conference_publications
             ORDER BY publication_date DESC 
             LIMIT 4`
        );
        res.json({ data: rows });
    } catch (error) {
        console.error("Error fetching latest publications:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 📅 Fetch Event History
app.get("/api/events-history", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const [dateRows] = await db.query(
            `SELECT DISTINCT event_date FROM events_history 
             ORDER BY event_date DESC 
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        const eventDates = dateRows.map(row => row.event_date);

        if (eventDates.length === 0) {
            return res.json({ data: [], totalPages: 0, currentPage: page });
        }

        const [scheduleRows] = await db.query(
            `SELECT event_date, time_slot, program 
             FROM events_history 
             WHERE event_date IN (?) 
             ORDER BY event_date DESC, time_slot ASC`,
            [eventDates]
        );

        const groupedEvents = eventDates.map(date => ({
            date: date.toISOString().split("T")[0],
            schedule: scheduleRows
                .filter(event => event.event_date.toISOString().split("T")[0] === date.toISOString().split("T")[0])
                .map(event => ({
                    time: event.time_slot,
                    program: event.program.split(" | ")
                }))
        }));

        const [totalResult] = await db.execute("SELECT COUNT(DISTINCT event_date) AS total FROM events_history");
        const totalRecords = totalResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({ data: groupedEvents, totalPages, currentPage: page });

    } catch (error) {
        console.error("Error fetching event history:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🔐 Register a New User
app.post("/api/register", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password || password.length < 8) {
        return res.status(400).json({ error: "Invalid email or password." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);
        res.json({ message: "User registered successfully." });
    } catch (error) {
        console.error("Error during user registration:", error.message);
        res.status(500).json({ error: "Registration failed." });
    }
});

// 🔑 User Login
app.post("/api/login", loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`); // Debugging Log

    try {
        // Check if user exists
        const [users] = await db.query("SELECT id, email, password FROM users WHERE email = ?", [email]);
        
        if (!users || users.length === 0) {
            console.log(`Login failed: User not found - ${email}`);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const user = users[0];
        console.log(`User found: ${user.email}`); // Debugging Log

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log(`Login failed: Incorrect password - ${email}`);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        console.log(`Login successful: ${email}`);
        res.json({ message: "Login successful", token });

    } catch (error) {
        console.error(`Login Error for ${email}:`, error.message); // Log the actual error
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🚀 Protected User Dashboard Route
app.get("/api/admin-dashboard", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to the Admin Dashboard", user: req.user.email });
});

// 🚀 Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
