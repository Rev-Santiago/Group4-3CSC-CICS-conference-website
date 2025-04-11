import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import db from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path"; // For serving static files
import { fileURLToPath } from 'url'; // ES module compatible import
import { dirname } from 'path'; // For path handling
import icsRoute from "./routes/icsRoute.js";
import screenshotRouter from "./routes/screenShot.js";
import eventsRouter from "./routes/events.js";
import process from "process";
import eventRoutes from "./routes/eventRoutes.js";
import searchRouter from "./routes/search.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.set('trust proxy', 1); 

const PORT = process.env.PORT || 500;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Get the current directory name for serving static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.json());
// ✅ Security Middleware
// ✅ Helmet with CSP to allow reCAPTCHA

// ✅ CORS Configuration
// Updated CORS Configuration
app.use(cors({
    origin: [
        "https://cics-conference-website.onrender.com", 
        "http://localhost:3000",  // React development server
        "http://localhost:5173"   // Vite development server
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
}));

app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "https://www.google.com",
            "https://www.gstatic.com",
            "'unsafe-inline'"
          ],
          connectSrc: [
            "'self'",
            "http://localhost:5000", // ✅ allow local fetch
            "https://www.google.com"
          ],
          frameSrc: ["'self'", "https://www.google.com"]
        }
      }
    })
  );

app.use(express.static(path.join(process.cwd(), 'public')));
app.use("/screenshots", express.static(path.join(process.cwd(), "screenshots")));

app.use("/api", icsRoute);
app.use("/api", screenshotRouter);
app.use("/screenshots", express.static("screenshots"));
app.use("/uploads", express.static("uploads"));
app.use("/api", eventsRouter);
app.use("/api", eventRoutes);
app.use("/api", searchRouter);
app.use("/api", userRoutes);

// ✅ Rate Limiting for Login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
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

// 📅 Fetch Event History (with pagination and past events only)
app.get("/api/events-history", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        // Fetch past event dates with pagination (event_date < today's date)
        const [rows] = await db.query(
            `SELECT DISTINCT event_date 
             FROM events 
             WHERE event_date < CURDATE()  -- Only past events
             ORDER BY event_date DESC 
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        if (rows.length === 0) {
            return res.json({ data: [], totalPages: 0, currentPage: page });
        }

        const eventDates = rows.map(row => row.event_date);

        // Fetch schedules for the event dates
        const [scheduleRows] = await db.query(
            `SELECT event_date, time_slot, program 
             FROM events 
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

        // Count total records for pagination (for past events only)
        const [totalResult] = await db.execute(
            "SELECT COUNT(DISTINCT event_date) AS total FROM events WHERE event_date < CURDATE()"
        );
        const totalRecords = totalResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({ data: groupedEvents, totalPages, currentPage: page });

    } catch (error) {
        console.error("Error fetching event history:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 🔐 User Login with Debug Logs
app.post("/api/login", loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`); // Debugging Log

    try {
        // Check if user exists and fetch account type
        const [users] = await db.query("SELECT id, email, password, account_type FROM users WHERE email = ?", [email]);
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
        // Include account_type in the response
        res.json({ message: "Login successful", token, account_type: user.account_type });

    } catch (error) {
        console.error(`Login Error for ${email}:`, error.message); // Log the actual error
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//new for captcha
app.post("/api/verify-captcha", async (req, res) => {
    const { token } = req.body;
    const secret = process.env.RECAPTCHA_SECRET_KEY;

    try {
        const response = await fetch(
            `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
            {
                method: "POST",
            }
        );
        const data = await response.json();
        res.json({ success: data.success });
    } catch (error) {
        console.error("Captcha verification failed:", error);
        res.status(500).json({ success: false });
    }
});

// 🚀 Protected User Dashboard Route
app.get("/api/admin-dashboard", authenticateToken, (req, res) => {
    res.json({ message: "Welcome to the Admin Dashboard", user: req.user.email });
});

// 📅 Fetch Event Schedule Dynamically
app.get("/api/schedule", async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT event_date, time_slot, program, venue, online_room_link
            FROM events
            WHERE event_date >= CURDATE()
            ORDER BY event_date, time_slot
        `);

        const groupedData = rows.reduce((acc, event) => {
            try {
                const { event_date, time_slot, program, venue, online_room_link, category } = event;
                const dateKey = event_date.toISOString().split("T")[0];

                if (!acc[dateKey]) {
                    acc[dateKey] = { date: dateKey, events: [] };
                }

                acc[dateKey].events.push({
                    time: time_slot,
                    program: program || "Untitled",
                    venue: venue || "TBA",
                    online_room_link: online_room_link || "",
                    category: category || ""
                });
            } catch (innerErr) {
                console.error("Error processing event:", event, innerErr);
            }
            return acc;
        }, {});

        res.json({ data: Object.values(groupedData) });
    } catch (error) {
        console.error("🔥 Schedule route error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


// 📅 Admin Event Preview API
app.get("/api/admin_event_preview", async (req, res) => {
    try {
        // Query to fetch events from the database
        const query = `
            SELECT title, event_date AS date, time_slot AS time, venue, speakers, theme, category
            FROM events
            ORDER BY event_date DESC;  -- Adjust the query to match your data structure
        `;
        const [rows] = await db.query(query);

        // Transform the result into the required format
        const eventList = rows.map(event => ({
            title: event.title,
            date: event.date,
            time: event.time,
            venue: event.venue,
            speakers: event.speakers,
            theme: event.theme,
            category: event.category,
        }));

        // Respond with the formatted events
        res.json(eventList);

    } catch (error) {
        console.error("Error fetching event preview:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Add this code to your server.js file, before the final app.listen line:

// 🧪 Debug routes
app.get("/api/debug/token", authenticateToken, (req, res) => {
    try {
        res.json({
            message: "Token debug information",
            user: req.user,
            userId: req.user.id,
            tokenPresent: !!req.headers.authorization,
            headers: {
                authorization: req.headers.authorization ? "Present (not shown for security)" : "Missing",
                contentType: req.headers["content-type"],
            },
            serverTime: new Date().toISOString()
        });
    } catch (err) {
        res.status(500).json({
            error: "Error in debug endpoint",
            message: err.message,
            stack: process.env.NODE_ENV === "production" ? null : err.stack
        });
    }
});

app.get("/api/debug/env", (req, res) => {
    res.json({
        environment: process.env.NODE_ENV || "not set",
        jwtSecret: process.env.JWT_SECRET ? "Set (not shown)" : "Not set",
        serverVersion: "1.0.0",
        time: new Date().toISOString()
    });
});

app.use("/screenshots", express.static(path.join(process.cwd(), "screenshots")));

// Serve static files from the React app (build folder)
if (process.env.NODE_ENV === "production") {
    // Serve static files from the correct 'dist' folder
    app.use(express.static(path.join(__dirname, "../../dist")));  // Adjusted path to the dist folder

    // For any other route, serve the index.html for React Router
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../../dist", "index.html"));
    });
}

// 🚀 Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
