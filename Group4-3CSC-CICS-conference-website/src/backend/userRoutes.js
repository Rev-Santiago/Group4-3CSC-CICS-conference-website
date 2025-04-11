// routes/userRoutes.js
import express from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";

const router = express.Router();

router.get("/test", (req, res) => {
    res.json({ message: "API is working!" });
});

router.get("/users", async (req, res) => {
    try {
        console.log("Request to get users received. User:", req.user);
        
        // Use the same format as other queries in server.js (no database prefix)
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
router.post("/users", async (req, res) => {
    try {
        const { email, password, account_type } = req.body;
        
        // Verify current user is super_admin
        const [currentUser] = await db.query(
            "SELECT account_type FROM users WHERE id = ?", 
            [req.user.id]
        );
        
        if (currentUser.length === 0 || currentUser[0].account_type !== 'super_admin') {
            return res.status(403).json({ error: "Only Super Admins can add new users" });
        }
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters" });
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
        
        await db.execute(
            "INSERT INTO users (email, password, account_type, created_at) VALUES (?, ?, ?, NOW())",
            [email, hashedPassword, account_type || 'admin'] // Default to 'admin' if not specified
        );
        
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Promote user to super_admin
router.post("/users/:id/promote", async (req, res) => {
    const userId = req.params.id;
    
    try {
        // Verify current user is super_admin before allowing promotion
        const [currentUser] = await db.query(
            "SELECT account_type FROM users WHERE id = ?", 
            [req.user.id]
        );
        
        if (currentUser.length === 0 || currentUser[0].account_type !== 'super_admin') {
            return res.status(403).json({ error: "Only Super Admins can promote users" });
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
router.post("/users/:id/demote", async (req, res) => {
    const userId = req.params.id;
    
    try {
        // Verify current user is super_admin before allowing demotion
        const [currentUser] = await db.query(
            "SELECT account_type FROM users WHERE id = ?", 
            [req.user.id]
        );
        
        if (currentUser.length === 0 || currentUser[0].account_type !== 'super_admin') {
            return res.status(403).json({ error: "Only Super Admins can demote users" });
        }
        
        // Prevent self-demotion (optional security feature)
        if (userId == req.user.id) {
            return res.status(400).json({ error: "You cannot demote yourself" });
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

// Add at top of userRoutes.js routes
router.get("/users-test", (req, res) => {
    res.json({ message: "User routes are connected!", user: req.user });
});

// Remove user
router.delete("/users/:id", async (req, res) => {
    const userId = req.params.id;
    
    try {
        // Verify current user is super_admin before allowing deletion
        const [currentUser] = await db.query(
            "SELECT account_type FROM users WHERE id = ?", 
            [req.user.id]
        );
        
        if (currentUser.length === 0 || currentUser[0].account_type !== 'super_admin') {
            return res.status(403).json({ error: "Only Super Admins can remove users" });
        }
        
        await db.execute("DELETE FROM users WHERE id = ?", [userId]);
        res.json({ message: "User removed successfully" });
    } catch (error) {
        console.error("Error removing user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;