// src/backend/routes/eventRoutes.js
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

const upload = multer({ storage });

// Middleware to authenticate JWT Tokens
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).json({ error: "Access denied." });

  jwt.verify(token, process.env.JWT_SECRET || "your_super_secret_key_here", (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token." });
    req.user = user;
    next();
  });
};

// Route: Save event draft
router.post("/drafts", authenticateToken, upload.fields([
  { name: "keynoteImage", maxCount: 1 },
  { name: "invitedImage", maxCount: 1 },
]), async (req, res) => {
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
      if (!time) return "";
      const date = new Date(`1970-01-01T${time}`);
      return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);
    const eventTime = startTime && endTime ? `${formattedStartTime} - ${formattedEndTime}` : "";

    const keynoteImage = req.files?.keynoteImage?.[0]?.filename || null;
    const invitedImage = req.files?.invitedImage?.[0]?.filename || null;

    // Get the userId from the authenticated token
    const userId = req.user.id;

    const query = `
      INSERT INTO event_drafts (
        event_date, time_slot, program, venue, online_room_link,
        speaker, theme, category, photo_url, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      date || null,
      eventTime,
      title || "",
      venue || "",
      zoomLink || "",
      `${keynoteSpeaker || ""}${invitedSpeaker ? `, ${invitedSpeaker}` : ""}`,
      theme || "",
      category || "",
      keynoteImage || invitedImage || null,
      userId
    ];

    await db.execute(query, values);
    res.status(200).json({ message: "Draft saved successfully." });
  } catch (err) {
    console.error("Error saving draft:", err);
    res.status(500).json({ error: "Failed to save draft." });
  }
});

// Route: Publish event (super_admin only)
router.post("/events", authenticateToken, upload.fields([
  { name: "keynoteImage", maxCount: 1 },
  { name: "invitedImage", maxCount: 1 },
]), async (req, res) => {
  try {
    // First check if user is super_admin
    const userId = req.user.id;
    const [userRows] = await db.query(
      "SELECT account_type FROM users WHERE id = ?",
      [userId]
    );
    
    if (!userRows.length || userRows[0].account_type !== 'super_admin') {
      return res.status(403).json({ error: "Only super_admin can publish events" });
    }

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
      if (!time) return "";
      const date = new Date(`1970-01-01T${time}`);
      return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const formattedStartTime = formatTime(startTime);
    const formattedEndTime = formatTime(endTime);
    const eventTime = startTime && endTime ? `${formattedStartTime} - ${formattedEndTime}` : "";

    const keynoteImage = req.files?.keynoteImage?.[0]?.filename || null;
    const invitedImage = req.files?.invitedImage?.[0]?.filename || null;

    const query = `
      INSERT INTO events (
        event_date, time_slot, program, venue, online_room_link,
        speaker, theme, category, photo_url, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      date,
      eventTime,
      title,
      venue,
      zoomLink || "",
      `${keynoteSpeaker}${invitedSpeaker ? `, ${invitedSpeaker}` : ""}`,
      theme,
      category,
      keynoteImage || invitedImage || null,
      userId
    ];

    await db.execute(query, values);
    res.status(200).json({ message: "Event published successfully." });
  } catch (err) {
    console.error("Error publishing event:", err);
    res.status(500).json({ error: "Failed to publish event." });
  }
});

// Route: Get drafts for current user
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

export default router;