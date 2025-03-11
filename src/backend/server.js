import dotenv from "dotenv";
dotenv.config(); // Load environment variables at the very top

import express from "express";
import cors from "cors";
import db from "./db.js"; // Import database connection
import process from "process";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());

// Test API Route
app.get("/api", (req, res) => {
    res.json({ message: "✅ API is working!" });
});

// Fetch conference publications with pagination
app.get("/api/publications", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        console.log(`📢 Fetching publications: page=${page}, limit=${limit}, offset=${offset}`);

        // Count total records
        const [totalResult] = await db.execute("SELECT COUNT(*) AS total FROM conference_publications");
        const totalRecords = totalResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        console.log(`📊 Total Records: ${totalRecords}, Total Pages: ${totalPages}`);

        // Fetch paginated results
        const [rows] = await db.query(
            `SELECT publication_date, publication_description FROM conference_publications
             ORDER BY publication_date DESC
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );

        res.json({
            data: rows,
            totalPages,
            currentPage: page
        });

    } catch (error) {
        console.error("❌ Database error:", error);  // Log full error details
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.get("/api/publications/latest", async (req, res) => {
    try {
        // Fetch the latest 4 publications
        const [rows] = await db.query(
            `SELECT publication_date, publication_description 
             FROM conference_publications
             ORDER BY publication_date DESC 
             LIMIT 4`
        );

        res.json({ data: rows });
    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

app.get("/api/events-history", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        // 1️⃣ Get unique event dates for pagination
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

        // 2️⃣ Fetch all schedule details for the selected dates
        const [scheduleRows] = await db.query(
            `SELECT event_date, time_slot, program 
             FROM events_history 
             WHERE event_date IN (?) 
             ORDER BY event_date DESC, time_slot ASC`,
            [eventDates]
        );

        // 3️⃣ Group by event_date
        const groupedEvents = eventDates.map(date => ({
            date: date.toISOString().split("T")[0],  // Format as YYYY-MM-DD
            schedule: scheduleRows
                .filter(event => event.event_date.toISOString().split("T")[0] === date.toISOString().split("T")[0])
                .map(event => ({
                    time: event.time_slot,
                    program: event.program.split(" | ") // Assuming multiple programs are separated by " | "
                }))
        }));

        // 4️⃣ Get total pages (count distinct dates)
        const [totalResult] = await db.execute("SELECT COUNT(DISTINCT event_date) AS total FROM events_history");
        const totalRecords = totalResult[0].total;
        const totalPages = Math.ceil(totalRecords / limit);

        res.json({
            data: groupedEvents,
            totalPages,
            currentPage: page
        });

    } catch (error) {
        console.error("❌ Database error:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});



// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
