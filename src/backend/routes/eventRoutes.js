import express from "express";
import multer from "multer";
import db from "../db.js";
import path from "path";
import fs from "fs";
import { 
    authenticateToken, 
    authorizeContentEditor,
    canPublishContent,
    canEditPublishedContent,
    canDeleteContent
} from "../middleware/auth.js";

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

// Helper function to check for duplicate events
const checkDuplicateEvent = async (title, date, timeSlot, id = null) => {
  try {
    let query = `
      SELECT id FROM events 
      WHERE program = ? AND event_date = ? AND time_slot = ?
    `;
    
    const params = [title, date, timeSlot];
    
    // Exclude current event if updating
    if (id) {
      query += " AND id != ?";
      params.push(id);
    }
    
    const [existingEvents] = await db.query(query, params);
    return existingEvents.length > 0;
  } catch (error) {
    console.error("Error checking for duplicate events:", error);
    throw error;
  }
};

// Helper function to check for duplicate event drafts
const checkDuplicateEventDraft = async (title, date, timeSlot, id = null) => {
  try {
    let query = `
      SELECT id FROM event_drafts 
      WHERE program = ? AND event_date = ? AND time_slot = ?
    `;
    
    const params = [title, date, timeSlot];
    
    // Exclude current draft if updating
    if (id) {
      query += " AND id != ?";
      params.push(id);
    }
    
    const [existingDrafts] = await db.query(query, params);
    return existingDrafts.length > 0;
  } catch (error) {
    console.error("Error checking for duplicate drafts:", error);
    throw error;
  }
};

// ==============================
// DRAFT ROUTES
// ==============================

router.post("/drafts", authenticateToken, authorizeContentEditor, upload.fields([
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
    console.log("Creating draft for user ID:", userId);

    const speaker = [keynoteSpeaker, invitedSpeaker].filter(Boolean).join(", ");
    
    // Use current date as fallback if date is invalid
    const eventDate = isValidDate(date) ? date : new Date().toISOString().split('T')[0];

    // Check for duplicate events before saving
    const isDuplicateEvent = await checkDuplicateEvent(title, eventDate, eventTime);
    const isDuplicateDraft = await checkDuplicateEventDraft(title, eventDate, eventTime);

    if (isDuplicateEvent) {
      return res.status(409).json({ error: "An event with the same title, date, and time already exists." });
    }

    if (isDuplicateDraft) {
      return res.status(409).json({ error: "A draft with the same title, date, and time already exists." });
    }

    const query = `
      INSERT INTO event_drafts (
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

    // Execute the query
    await db.execute(query, values);
    res.status(200).json({ message: "Draft saved successfully." });
  } catch (err) {
    console.error("Error saving draft:", err);
    
    // Handle duplicate entry constraint violations
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "A draft with the same title, date, and time already exists." });
    }
    
    res.status(500).json({ error: "Failed to save draft." });
  }
});

router.put("/drafts/:id", authenticateToken, authorizeContentEditor, upload.fields([
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

    // Check if this draft exists and belongs to the current user
    const [draftRows] = await db.query(
      "SELECT id FROM event_drafts WHERE id = ? AND created_by = ?",
      [id, req.user.id]
    );

    if (draftRows.length === 0) {
      return res.status(404).json({ error: "Draft not found or you don't have permission to edit it." });
    }

    // Check for duplicate events before updating
    const isDuplicateEvent = await checkDuplicateEvent(title, eventDate, eventTime);
    const isDuplicateDraft = await checkDuplicateEventDraft(title, eventDate, eventTime, id);

    if (isDuplicateEvent) {
      return res.status(409).json({ error: "An event with the same title, date, and time already exists." });
    }

    if (isDuplicateDraft) {
      return res.status(409).json({ error: "Another draft with the same title, date, and time already exists." });
    }

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
    
    // Handle duplicate entry constraint violations
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Another draft with the same title, date, and time already exists." });
    }
    
    res.status(500).json({ error: "Failed to update draft." });
  }
});

router.get("/drafts", authenticateToken, authorizeContentEditor, async (req, res) => {
  try {
    const userId = req.user.id;
    const [rows] = await db.query(
      `SELECT * FROM event_drafts WHERE created_by = ? ORDER BY created_at DESC`,
      [userId]
    );
    res.status(200).json({ 
      drafts: rows,
      userRole: req.userRole
    });
  } catch (err) {
    console.error("Error fetching drafts:", err);
    res.status(500).json({ error: "Failed to fetch drafts." });
  }
});

router.delete("/drafts/:id", authenticateToken, authorizeContentEditor, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if the draft exists and belongs to the user
    const [draftRows] = await db.query(
      "SELECT id FROM event_drafts WHERE id = ? AND created_by = ?",
      [id, req.user.id]
    );

    if (draftRows.length === 0) {
      return res.status(404).json({ error: "Draft not found or you don't have permission to delete it." });
    }
    
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

router.post("/events", authenticateToken, authorizeContentEditor, upload.fields([
  { name: "keynoteImage", maxCount: 1 },
  { name: "invitedImage", maxCount: 1 }
]), async (req, res) => {
  try {
    // Check if user has permission to publish
    if (!canPublishContent(req.userRole)) {
      return res.status(403).json({ error: "You don't have permission to publish events." });
    }
    
    const userId = req.user.id;
    const { title, date, startTime, endTime, venue, keynoteSpeaker, invitedSpeaker, theme, category, zoomLink } = req.body;
    const eventTime = startTime && endTime ? `${formatTime(startTime)} - ${formatTime(endTime)}` : "";

    // Handle file uploads
    const keynoteImage = req.files?.keynoteImage?.[0]?.filename || null;
    const invitedImage = req.files?.invitedImage?.[0]?.filename || null;

    // Use current date as fallback if date is invalid
    const eventDate = isValidDate(date) ? date : new Date().toISOString().split('T')[0];
    
    // Check for duplicate events before saving
    const isDuplicateEvent = await checkDuplicateEvent(title, eventDate, eventTime);

    if (isDuplicateEvent) {
      return res.status(409).json({ error: "An event with the same title, date, and time already exists." });
    }

    const speaker = [keynoteSpeaker, invitedSpeaker].filter(Boolean).join(", ");

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

    // Execute the query
    await db.execute(query, values);
    res.status(200).json({ message: "Event published successfully." });
  } catch (err) {
    console.error("Error publishing event:", err);
    
    // Handle duplicate entry constraint violations
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "An event with the same title, date, and time already exists." });
    }
    
    res.status(500).json({ error: "Failed to publish event." });
  }
});

router.put("/events/:id", authenticateToken, authorizeContentEditor, upload.fields([
  { name: "keynoteImage", maxCount: 1 },
  { name: "invitedImage", maxCount: 1 },
]), async (req, res) => {
  try {
    // Check if user has edit rights for published content
    if (!canEditPublishedContent(req.userRole)) {
      return res.status(403).json({ error: "You don't have permission to edit published events." });
    }

    const { id } = req.params;
    const { title, date, startTime, endTime, venue, keynoteSpeaker, invitedSpeaker, theme, category, zoomLink } = req.body;
    const eventTime = startTime && endTime ? `${formatTime(startTime)} - ${formatTime(endTime)}` : "";

    const keynoteImage = req.files?.keynoteImage?.[0]?.filename || null;
    const invitedImage = req.files?.invitedImage?.[0]?.filename || null;

    const speaker = [keynoteSpeaker, invitedSpeaker].filter(Boolean).join(", ");
    
    // Use current date as fallback if date is invalid
    const eventDate = isValidDate(date) ? date : new Date().toISOString().split('T')[0];

    // Check if event exists
    const [eventRows] = await db.query(
      "SELECT id FROM events WHERE id = ?",
      [id]
    );

    if (eventRows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }

    // Check for duplicate events before updating
    const isDuplicateEvent = await checkDuplicateEvent(title, eventDate, eventTime, id);

    if (isDuplicateEvent) {
      return res.status(409).json({ error: "Another event with the same title, date, and time already exists." });
    }

    const query = `
      UPDATE events
      SET event_date = ?, time_slot = ?, program = ?, venue = ?, online_room_link = ?, 
          speaker = ?, theme = ?, category = ?, photo_url = ?
      WHERE id = ?
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
      id
    ];

    await db.execute(query, values);
    res.status(200).json({ message: "Event updated successfully." });
  } catch (err) {
    console.error("Error updating event:", err);
    
    // Handle duplicate entry constraint violations
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "Another event with the same title, date, and time already exists." });
    }
    
    res.status(500).json({ error: "Failed to update event." });
  }
});

router.get("/events", authenticateToken, authorizeContentEditor, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM events ORDER BY event_date DESC`
    );
    res.status(200).json({ 
      events: rows,
      userRole: req.userRole
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

router.delete("/events/:id", authenticateToken, authorizeContentEditor, async (req, res) => {
  try {
    // Check if user has delete rights
    if (!canDeleteContent(req.userRole)) {
      return res.status(403).json({ error: "You don't have permission to delete events." });
    }

    const { id } = req.params;
    
    // Check if the event exists
    const [eventRows] = await db.query(
      "SELECT id FROM events WHERE id = ?",
      [id]
    );

    if (eventRows.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }
    
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
    userRole: req.userRole,
    timestamp: new Date().toISOString()
  });
});

export default router;