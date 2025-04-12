import express from "express";
import multer from "multer";
import db from "../db.js";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import process from "process";

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

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max size 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Invalid file type'), false);
    }
    cb(null, true);
  },
});

// Middleware to authenticate JWT Tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Auth header:", authHeader); // Debug log
  console.log("Token:", token ? "Present (not shown for security)" : "Missing"); // Debug log

  if (!token) return res.status(403).json({ error: "Access denied." });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.log("JWT verification error:", err); // Debug log
      return res.status(403).json({ error: "Invalid token." });
    }
    console.log("Decoded user from token:", user); // Debug log
    req.user = user;
    next();
  });
};

// Helper function to validate date format
const isValidDate = (dateString) => {
  if (!dateString) return false;
  if (dateString.trim() === "") return false;
  
  // Check if it's a valid date
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

// Utility: Format time to AM/PM
const formatTime = (time) => {
  if (!time) return "";
  const date = new Date(`1970-01-01T${time}`);
  return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

// ==============================
// DRAFT ROUTES
// ==============================

router.post("/drafts", authenticateToken, upload.fields([
  { name: "keynoteImage", maxCount: 1 },
  { name: "invitedImage", maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, date, startTime, endTime, venue, keynoteSpeaker, invitedSpeaker, theme, category, zoomLink } = req.body;
    const eventTime = startTime && endTime ? `${formatTime(startTime)} - ${formatTime(endTime)}` : "";

    // Handle file uploads
    const keynoteImage = req.files?.keynoteImage?.[0]?.filename || null;
    const invitedImage = req.files?.invitedImage?.[0]?.filename || null;

    const userId = req.user.id;
    console.log("Creating draft for user ID:", userId); // Debug log

    const query = `
      INSERT INTO event_drafts (
        event_date, time_slot, program, venue, online_room_link,
        speaker, theme, category, photo_url, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const speaker = [keynoteSpeaker, invitedSpeaker].filter(Boolean).join(", ");
    
    // Use current date as fallback if date is invalid
    const eventDate = isValidDate(date) ? date : new Date().toISOString().split('T')[0];
    
    const values = [
      eventDate,
      eventTime,
      title || "",
      venue || "",
      zoomLink || "",
      speaker,
      theme || "",
      category || "",
      keynoteImage || invitedImage || null,
      userId
    ];
    
    console.log("Draft values:", values); // Debug log

    // Execute the query
    await db.execute(query, values);
    res.status(200).json({ message: "Draft saved successfully." });
  } catch (err) {
    console.error("Error saving draft:", err);
    res.status(500).json({ error: "Failed to save draft." });
  }
});

router.put("/drafts/:id", authenticateToken, upload.fields([
  { name: "keynoteImage", maxCount: 1 },
  { name: "invitedImage", maxCount: 1 },
]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, startTime, endTime, venue, keynoteSpeaker, invitedSpeaker, theme, category, zoomLink } = req.body;
    const eventTime = startTime && endTime ? `${formatTime(startTime)} - ${formatTime(endTime)}` : "";

    const keynoteImage = req.files?.keynoteImage?.[0]?.filename || null;
    const invitedImage = req.files?.invitedImage?.[0]?.filename || null;

    const speaker = [keynoteSpeaker, invitedSpeaker].filter(Boolean).join(", ");
    
    // Use current date as fallback if date is invalid
    const eventDate = isValidDate(date) ? date : new Date().toISOString().split('T')[0];

    const query = `
      UPDATE event_drafts
      SET event_date = ?, time_slot = ?, program = ?, venue = ?, online_room_link = ?, 
          speaker = ?, theme = ?, category = ?, photo_url = ?
      WHERE id = ? AND created_by = ?
    `;

    const values = [
      eventDate, 
      eventTime, 
      title || "", 
      venue || "", 
      zoomLink || "",
      speaker,
      theme || "", 
      category || "", 
      keynoteImage || invitedImage || null, 
      id, 
      req.user.id
    ];

    // Execute the query
    await db.execute(query, values);
    res.status(200).json({ message: "Draft updated successfully." });
  } catch (err) {
    console.error("Error updating draft:", err);
    res.status(500).json({ error: "Failed to update draft." });
  }
});

router.get("/drafts", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `SELECT * FROM event_drafts WHERE created_by = ? ORDER BY created_at DESC`,
      [userId]
    );
    res.status(200).json({ drafts: rows });
  } catch (err) {
    console.error("Error fetching drafts:", err);
    res.status(500).json({ error: "Failed to fetch drafts." });
  }
});

router.delete("/drafts/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(`DELETE FROM event_drafts WHERE id = ? AND created_by = ?`, [id, req.user.id]);
    res.status(200).json({ message: "Draft deleted successfully." });
  } catch (err) {
    console.error("Error deleting draft:", err);
    res.status(500).json({ error: "Failed to delete draft." });
  }
});

// ==============================
// EVENTS ROUTES
// ==============================

// Fix for the events POST endpoint in eventRoutes.js
router.post("/", authenticateToken, upload.fields([
  { name: "keynoteImage", maxCount: 1 },
  { name: "invitedImage", maxCount: 1 }
]), async (req, res) => {
  try {
    const userId = req.user?.id;

    // 🔒 double check
    if (!userId) {
      return res.status(403).json({ error: "User ID missing. Please login." });
    }

    // Extract data from request body
    const { title, date, startTime, endTime, venue, keynoteSpeaker, invitedSpeaker, theme, category, zoomLink } = req.body;
    const eventTime = startTime && endTime ? `${formatTime(startTime)} - ${formatTime(endTime)}` : "";

    // Handle file uploads
    const keynoteImage = req.files?.keynoteImage?.[0]?.filename || null;
    const invitedImage = req.files?.invitedImage?.[0]?.filename || null;

    // Combine speakers if both are provided
    const speaker = [keynoteSpeaker, invitedSpeaker].filter(Boolean).join(", ");
    
    // Use current date as fallback if date is invalid
    const eventDate = isValidDate(date) ? date : new Date().toISOString().split('T')[0];

    const query = `
      INSERT INTO events (
        event_date, time_slot, program, venue, online_room_link,
        speaker, theme, category, photo_url, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      eventDate,
      eventTime,
      title || "",
      venue || "",
      zoomLink || "",
      speaker,
      theme || "",
      category || "",
      keynoteImage || invitedImage || null,
      userId
    ];

    await db.execute(query, values);
    res.status(200).json({ message: "Event published successfully." });

  } catch (err) {
    console.error("🔥 Event publish error:", err);
    res.status(500).json({ error: "Failed to publish event." });
  }
});

router.get("/events", authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM events ORDER BY created_at DESC`
    );
    res.status(200).json({ events: rows });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

router.delete("/events/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const [userRows] = await db.query("SELECT account_type FROM users WHERE id = ?", [userId]);

    if (!userRows.length || userRows[0].account_type !== 'super_admin') {
      return res.status(403).json({ error: "Only super_admin can delete events" });
    }

    const { id } = req.params;
    await db.execute(`DELETE FROM events WHERE id = ?`, [id]);
    res.status(200).json({ message: "Event deleted successfully." });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({ error: "Failed to delete event." });
  }
});

// Debug endpoint to verify tokens
router.get("/verify-token", authenticateToken, (req, res) => {
  res.json({ 
    message: "Token is valid", 
    user: req.user,
    userId: req.user.id,
    timestamp: new Date().toISOString()
  });
});

export default router;