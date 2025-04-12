// Updated src/backend/routes/userRoutes.js

import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import process from "process";
import { 
    authenticateToken, 
    authorizeSuperAdmin, 
    authorizeAdmin 
} from "../middleware/auth.js";

const router = express.Router();

// Test route to verify connection
router.get("/test", (req, res) => {
    res.json({ message: "API is working!" });
});

// Get all users (super_admin only)
router.get("/users", authenticateToken, authorizeSuperAdmin, async (req, res) => {
    try {
        console.log("Request to get users received. User:", req.user);
        
        const [users] = await db.query(
            `SELECT id, email, account_type, created_at 
             FROM users ORDER BY created_at DESC`
        );
        
        console.log("Users found:", users);
        
        // Format response
        const formattedUsers = users.map(user => ({
            id: user.id,
            name: user.email.split('@')[0],
            email: user.email,
            account_type: user.account_type,
            date_added: user.created_at
        }));
        
        res.json({ users: formattedUsers, count: users.length });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create new user (super_admin only)
router.post("/users", authenticateToken, authorizeSuperAdmin, async (req, res) => {
    try {
        const { email, password, account_type } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
        }
        
        // Validate account_type
        const validRoles = ['super_admin', 'admin', 'organizer'];
        if (!validRoles.includes(account_type)) {
            return res.status(400).json({ error: "Invalid account type" });
        }
        
        // Check if email already exists
        const [existingUser] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json({ error: "User with this email already exists" });
        }
        
        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        
        console.log("Attempting to create user:", { email, account_type });
        
        try {
            await db.execute(
                "INSERT INTO users (email, password, account_type, created_at) VALUES (?, ?, ?, NOW())",
                [email, hashedPassword, account_type]
            );
            console.log("User created successfully");
        } catch (insertError) {
            console.error("Database insertion error:", insertError);
            throw insertError; // Re-throw to be caught by the outer try-catch
        }
        
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Change user role (new endpoint for super_admin)
router.post("/users/:id/change-role", authenticateToken, authorizeSuperAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        
        // Validate role
        const validRoles = ['super_admin', 'admin', 'organizer'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ error: "Invalid role specified" });
        }
        
        // Get current user's info
        const [userData] = await db.query("SELECT id, account_type FROM users WHERE id = ?", [id]);
        
        if (userData.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        // Prevent changing your own role to ensure at least one super_admin exists
        if (id === req.user.id.toString()) {
            return res.status(400).json({ error: "You cannot change your own role" });
        }
        
        // Apply the role change
        await db.execute(
            "UPDATE users SET account_type = ? WHERE id = ?",
            [role, id]
        );
        
        res.json({ message: `User role changed to ${role} successfully` });
    } catch (error) {
        console.error("Error changing user role:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Promote user to super_admin
router.post("/users/:id/promote", authenticateToken, authorizeSuperAdmin, async (req, res) => {
    const userId = req.params.id;
    
    try {
        // Verify user exists
        const [userExists] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
        
        if (userExists.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await db.execute(
            "UPDATE users SET account_type = 'super_admin' WHERE id = ?",
            [userId]
        );
        
        res.json({ message: "User promoted to Super Admin successfully" });
    } catch (error) {
        console.error("Error promoting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Demote user from super_admin to regular admin
router.post("/users/:id/demote", authenticateToken, authorizeSuperAdmin, async (req, res) => {
    const userId = req.params.id;
    
    try {
        // Prevent self-demotion (security feature)
        if (userId == req.user.id) {
            return res.status(400).json({ error: "You cannot demote yourself" });
        }
        
        // Verify user exists
        const [userExists] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
        
        if (userExists.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await db.execute(
            "UPDATE users SET account_type = 'admin' WHERE id = ?",
            [userId]
        );
        
        res.json({ message: "User demoted to Admin successfully" });
    } catch (error) {
        console.error("Error demoting user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Debug endpoint to verify tokens
router.get("/users-test", authenticateToken, (req, res) => {
    res.json({ 
        message: "User routes are connected!", 
        user: req.user,
        role: req.userRole || 'unknown'
    });
});

// Remove user (super_admin only)
router.delete("/users/:id", authenticateToken, authorizeSuperAdmin, async (req, res) => {
    const userId = req.params.id;
    
    try {
        // Prevent self-deletion
        if (userId == req.user.id) {
            return res.status(400).json({ error: "You cannot remove yourself" });
        }
        
        // Verify user exists
        const [userExists] = await db.query("SELECT id FROM users WHERE id = ?", [userId]);
        
        if (userExists.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        await db.execute("DELETE FROM users WHERE id = ?", [userId]);
        res.json({ message: "User removed successfully" });
    } catch (error) {
        console.error("Error removing user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Update user profile (email and/or password)
router.put("/users/update-profile", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { email, currentPassword, newPassword } = req.body;
        
        // Fetch current user data to validate
        const [userRows] = await db.query(
            "SELECT id, email, password FROM users WHERE id = ?", 
            [userId]
        );
        
        if (userRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        
        const currentUser = userRows[0];
        
        // Prepare update fields
        const updateFields = [];
        const updateValues = [];
        
        // Update email if provided and different
        if (email && email !== currentUser.email) {
            // Check if email already exists for another user
            const [existingEmail] = await db.query(
                "SELECT id FROM users WHERE email = ? AND id != ?",
                [email, userId]
            );
            
            if (existingEmail.length > 0) {
                return res.status(400).json({ error: "Email already in use by another account" });
            }
            
            updateFields.push("email = ?");
            updateValues.push(email);
        }
        
        // Update password if both currentPassword and newPassword provided
        if (currentPassword && newPassword) {
            // Verify current password
            const isPasswordValid = await bcrypt.compare(currentPassword, currentUser.password);
            
            if (!isPasswordValid) {
                return res.status(401).json({ error: "Current password is incorrect" });
            }
            
            // Hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            updateFields.push("password = ?");
            updateValues.push(hashedPassword);
        }
        
        // If nothing to update, return success
        if (updateFields.length === 0) {
            return res.json({ message: "No changes to update" });
        }
        
        // Build and execute update query
        const updateQuery = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;
        updateValues.push(userId);
        
        await db.execute(updateQuery, updateValues);
        
        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;