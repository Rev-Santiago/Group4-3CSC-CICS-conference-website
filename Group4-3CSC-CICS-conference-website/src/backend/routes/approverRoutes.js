// routes/approvers.js
import express from "express";
import db from "../db.js"; // assuming db.js exports your MySQL pool/connection

const router = express.Router();

// Get list of approvers for a given event
router.get("/:eventId", async (req, res) => {
  const { eventId } = req.params;

  try {
    const [rows] = await db.query(
      "SELECT users.id, users.name, users.email FROM event_approvals JOIN users ON event_approvals.admin_id = users.id WHERE event_approvals.event_id = ?",
      [eventId]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error fetching approvers:", error);
    res.status(500).json({ error: "Server error fetching approvers" });
  }
});

// Post approval for an event
router.post("/", async (req, res) => {
  const { eventId, adminId } = req.body;

  if (!eventId || !adminId) {
    return res.status(400).json({ error: "Missing eventId or adminId" });
  }

  try {
    // Prevent duplicate event_approvals
    const [existing] = await db.query(
      "SELECT * FROM event_approvals WHERE event_id = ? AND admin_id = ?",
      [eventId, adminId]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "Already approved" });
    }

    await db.query(
      "INSERT INTO event_approvals (event_id, admin_id) VALUES (?, ?)",
      [eventId, adminId]
    );

    res.status(201).json({ message: "Approval recorded" });
  } catch (error) {
    console.error("Error submitting approval:", error);
    res.status(500).json({ error: "Server error submitting approval" });
  }
});

export default router;
