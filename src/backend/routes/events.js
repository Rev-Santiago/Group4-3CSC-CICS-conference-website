import express from "express";
import multer from "multer";
import db from "../db.js"; // Adjust path if needed
import path from "path";
import fs from "fs";

const router = express.Router();

// Set up Multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/speakers";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// Route: POST /api/events
router.post(
  "/events",
  upload.fields([
    { name: "keynoteImage", maxCount: 1 },
    { name: "invitedImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        title,
        date,
        startTime,
        endTime,
        venue,
        keynoteSpeaker,
        invitedSpeaker,
        theme,
        category,
        zoomLink,
      } = req.body;

      // Format start and end time to 12-hour AM/PM format
      const formatTime = (time) => {
        const date = new Date(`1970-01-01T${time}`);
        return date.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      };

      const formattedStartTime = formatTime(startTime);
      const formattedEndTime = formatTime(endTime);

      const eventTime = `${formattedStartTime} - ${formattedEndTime}`;

      const keynoteImage = req.files.keynoteImage?.[0]?.filename || null;
      const invitedImage = req.files.invitedImage?.[0]?.filename || null;

      const combinedSpeakers = [keynoteSpeaker, invitedSpeaker]
        .filter(Boolean)
        .join(", ");

      const photoUrl = keynoteImage || invitedImage || null;

      const query = `
        INSERT INTO events (
          event_date, time_slot, program, venue, online_room_link,
          speaker, theme, category, photo_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        date,
        eventTime,
        title,
        venue,
        zoomLink || "",
        combinedSpeakers,
        theme,
        category,
        photoUrl,
      ];

      await db.execute(query, values);
      res.status(200).json({ message: "Event created successfully." });
    } catch (err) {
      console.error("Error inserting event:", err);
      res.status(500).json({ error: "Failed to create event." });
    }
  }
);

// Route: GET /api/events
router.get("/events/public", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT event_date, time_slot, program, venue, online_room_link  
       FROM events 
       WHERE event_date >= CURDATE()
       ORDER BY event_date, time_slot`
    );

    const groupedData = rows.reduce((acc, event) => {
      const dateKey = event.event_date.toISOString().split("T")[0];
      if (!acc[dateKey]) {
        acc[dateKey] = { date: dateKey, events: [] };
      }
      acc[dateKey].events.push({
        time: event.time_slot,
        program: event.program,
        venue: event.venue,
        online_room_link: event.online_room_link,
      });
      return acc;
    }, {});

    res.json(Object.values(groupedData));
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;