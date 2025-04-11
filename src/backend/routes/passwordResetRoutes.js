import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";

const router = express.Router();

// Get environment variables using import.meta.env
const EMAIL_HOST = process.env.EMAIL_HOST || "smtp.ethereal.email";
const EMAIL_PORT = process.env.EMAIL_PORT || 587;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM || '"Admin" <admin@example.com>';
const FRONTEND_URL = process.env.EMAIL_FROM || 'https://cics-conference-website.onrender.com';
const EMAIL_SECURE = process.env.EMAIL_SECURE === "true";


// Configure email transporter (using a testing service here - use your own SMTP in production)
const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_SECURE,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    },
});

// Create reset token and store in database
router.post("/request-password-reset", async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if email exists in users table
        const [users] = await db.query(
            "SELECT id, email FROM users WHERE email = ?",
            [email]
        );
        
        // Always return a success response to prevent email enumeration attacks
        if (users.length === 0) {
            return res.json({ 
                message: "If your email is registered, you will receive a password reset link" 
            });
        }
        
        const user = users[0];
        
        // Generate a random reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        // Token expires in 1 hour
        const resetTokenExpiry = new Date(Date.now() + 3600000);
        
        // Check if password_resets table exists, if not, create it
        try {
            await db.query(`
                CREATE TABLE IF NOT EXISTS password_resets (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    user_id INT NOT NULL,
                    token VARCHAR(255) NOT NULL,
                    expires_at DATETIME NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                )
            `);
        } catch (err) {
            console.error("Error creating password_resets table:", err);
        }
        
        // Delete any existing tokens for this user
        await db.execute(
            "DELETE FROM password_resets WHERE user_id = ?",
            [user.id]
        );
        
        // Store the new reset token
        await db.execute(
            "INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)",
            [user.id, resetToken, resetTokenExpiry]
        );
        
        // Create reset URL
        const resetUrl = `${FRONTEND_URL}/reset-password/${resetToken}`;
        
        // Send email with reset link
        const mailOptions = {
            from: EMAIL_FROM,
            to: user.email,
            subject: "Password Reset Request",
            html: `
                <p>You requested a password reset.</p>
                <p>Click this link to reset your password:</p>
                <a href="${resetUrl}" target="_blank">Reset Your Password</a>
                <p>If you didn't request this, please ignore this email.</p>
                <p>This link will expire in 1 hour.</p>
            `,
        };
        
        await transporter.sendMail(mailOptions);
        
        res.json({ 
            message: "If your email is registered, you will receive a password reset link" 
        });
        
    } catch (error) {
        console.error("Password reset request error:", error);
        res.status(500).json({ error: "Failed to process password reset request" });
    }
});

// Verify reset token
router.get("/verify-reset-token/:token", async (req, res) => {
    try {
        const { token } = req.params;
        
        const [tokens] = await db.query(
            "SELECT id, user_id, expires_at FROM password_resets WHERE token = ?",
            [token]
        );
        
        if (tokens.length === 0) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }
        
        const resetToken = tokens[0];
        
        // Check if token has expired
        if (new Date(resetToken.expires_at) < new Date()) {
            return res.status(400).json({ error: "Reset token has expired" });
        }
        
        res.json({ valid: true });
        
    } catch (error) {
        console.error("Token verification error:", error);
        res.status(500).json({ error: "Failed to verify reset token" });
    }
});

// Process password reset
router.post("/reset-password", async (req, res) => {
    try {
        const { token, password } = req.body;
        
        if (!token || !password) {
            return res.status(400).json({ error: "Token and password are required" });
        }
        
        // Find token in database
        const [tokens] = await db.query(
            "SELECT id, user_id, expires_at FROM password_resets WHERE token = ?",
            [token]
        );
        
        if (tokens.length === 0) {
            return res.status(400).json({ error: "Invalid or expired reset token" });
        }
        
        const resetToken = tokens[0];
        
        // Check if token has expired
        if (new Date(resetToken.expires_at) < new Date()) {
            return res.status(400).json({ error: "Reset token has expired" });
        }
        
        // Check password length
        if (password.length < 8) {
            return res.status(400).json({ error: "Password must be at least 8 characters long" });
        }
        
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Update user's password
        await db.execute(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashedPassword, resetToken.user_id]
        );
        
        // Delete the reset token
        await db.execute(
            "DELETE FROM password_resets WHERE id = ?",
            [resetToken.id]
        );
        
        res.json({ message: "Password has been reset successfully" });
        
    } catch (error) {
        console.error("Password reset error:", error);
        res.status(500).json({ error: "Failed to reset password" });
    }
});

export default router;