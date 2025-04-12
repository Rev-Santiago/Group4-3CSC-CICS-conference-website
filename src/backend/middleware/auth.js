// auth.js - Updated middleware with role-based authorization

import jwt from "jsonwebtoken";
import db from "../db.js";

// Middleware to authenticate JWT token
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({ error: "Access denied. Authentication required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    return res.status(403).json({ error: "Invalid or expired token." });
  }
};

// Middleware to authorize super_admin only
export const authorizeAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ error: "Access denied. Authentication required." });
    }

    const [rows] = await db.query(
      "SELECT account_type FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: "User not found." });
    }

    const { account_type } = rows[0];
    if (account_type !== 'admin' && account_type !== 'super_admin') {
      return res.status(403).json({ error: "Access denied. Admin privileges required." });
    }

    req.userRole = account_type;
    next();
  } catch (err) {
    console.error("Authorization error:", err);
    res.status(500).json({ error: "Internal server error during authorization check." });
  }
};

// Middleware to authorize super_admin only
export const authorizeSuperAdmin = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ error: "Access denied. Authentication required." });
    }

    const [rows] = await db.query(
      "SELECT account_type FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: "User not found." });
    }

    const { account_type } = rows[0];
    if (account_type !== 'super_admin') {
      return res.status(403).json({ error: "Access denied. Super admin privileges required." });
    }

    req.userRole = account_type;
    next();
  } catch (err) {
    console.error("Authorization error:", err);
    res.status(500).json({ error: "Internal server error during authorization check." });
  }
};

// Middleware to authorize any content editor (admin, super_admin, or organizer)
export const authorizeContentEditor = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(403).json({ error: "Access denied. Authentication required." });
    }

    const [rows] = await db.query(
      "SELECT account_type FROM users WHERE id = ?",
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(403).json({ error: "User not found." });
    }

    const { account_type } = rows[0];
    // All roles can access content editor functions
    req.userRole = account_type;
    next();
  } catch (err) {
    console.error("Authorization error:", err);
    res.status(500).json({ error: "Internal server error during authorization check." });
  }
};

// Helper function to check if user has publish rights
export const canPublishContent = (role) => {
  return role === 'admin' || role === 'super_admin';
};

// Helper function to check if user has edit rights to published content
export const canEditPublishedContent = (role) => {
  return role === 'admin' || role === 'super_admin';
};

// Helper function to check if user has delete rights
export const canDeleteContent = (role) => {
  return role === 'super_admin';
};