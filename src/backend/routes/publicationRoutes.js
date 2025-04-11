// routes/publicationRoutes.js
import express from "express";
import db from "../db.js";

const router = express.Router();

// Test route to verify connection
router.get("/publications-test", (req, res) => {
    res.json({ message: "Publications API is working!" });
});

// Get all publications with pagination
router.get("/publications-admin", async (req, res) => {
    try {
        console.log("Request to get publications received. User:", req.user);
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        // Get total count
        const [countResult] = await db.query(
            `SELECT COUNT(*) AS total FROM conference_db.conference_publications`
        );
        const totalPublications = countResult[0].total;
        
        // Fetch publications with pagination - selecting publication_link as well
        const [publications] = await db.query(
            `SELECT id, publication_date, publication_description, publication_link 
             FROM conference_db.conference_publications 
             ORDER BY publication_date DESC
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        
        // Format the response to include the expected fields
        const formattedPublications = publications.map(pub => ({
            id: pub.id,
            publication_date: pub.publication_date,
            publication_description: pub.publication_description,
            publication_link: pub.publication_link // now coming from the DB
        }));
        
        res.json({ 
            publications: formattedPublications, 
            count: totalPublications,
            currentPage: page,
            totalPages: Math.ceil(totalPublications / limit)
        });
    } catch (error) {
        console.error("Error fetching publications:", error);
        console.error("Error details:", error.message);
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message
        });
    }
});

// Get all publication drafts - specific route before parameter routes
router.get("/publications/drafts", async (req, res) => {
    try {
        console.log("Request to get publication drafts received. User:", req.user);
        
        // Verify user has appropriate permissions
        const [currentUser] = await db.query(
            "SELECT account_type FROM conference_db.users WHERE id = ?", 
            [req.user.id]
        );
        
        if (currentUser.length === 0 || 
            (currentUser[0].account_type !== 'admin' && 
             currentUser[0].account_type !== 'super_admin')) {
            return res.status(403).json({ error: "Only Admins can view drafts" });
        }
        
        // Check if draft table exists
        const [tables] = await db.query(
            `SELECT TABLE_NAME 
             FROM information_schema.TABLES 
             WHERE TABLE_SCHEMA = 'conference_db' 
             AND TABLE_NAME = 'publication_drafts'`
        );
        
        // If draft table doesn't exist, return empty array
        if (tables.length === 0) {
            return res.json({ drafts: [], count: 0 });
        }
        
        // Fetch drafts
        const [drafts] = await db.query(
            `SELECT id, publication_date, publication_description, publication_link, created_at, updated_at
             FROM conference_db.publication_drafts 
             ORDER BY updated_at DESC`
        );
        
        res.json({ drafts, count: drafts.length });
    } catch (error) {
        console.error("Error fetching publication drafts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Save as draft functionality - specific route before parameter routes
router.post("/publications/drafts", async (req, res) => {
    try {
        const { title, date, link, id } = req.body;
        
        // Verify user has appropriate permissions
        const [currentUser] = await db.query(
            "SELECT account_type FROM conference_db.users WHERE id = ?", 
            [req.user.id]
        );
        
        if (currentUser.length === 0 || 
            (currentUser[0].account_type !== 'admin' && 
             currentUser[0].account_type !== 'super_admin')) {
            return res.status(403).json({ error: "Only Admins can save drafts" });
        }
        
        // Check if draft table exists
        const [tables] = await db.query(
            `SELECT TABLE_NAME 
             FROM information_schema.TABLES 
             WHERE TABLE_SCHEMA = 'conference_db' 
             AND TABLE_NAME = 'publication_drafts'`
        );
        
        // If draft table doesn't exist, create it
        if (tables.length === 0) {
            await db.execute(`
                CREATE TABLE conference_db.publication_drafts (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    publication_date DATE NOT NULL,
                    publication_description TEXT NOT NULL,
                    publication_link VARCHAR(255),
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            `);
        }
        
        // Check if we're updating an existing draft
        if (id) {
            const [existingDraft] = await db.query(
                `SELECT id FROM conference_db.publication_drafts WHERE id = ?`,
                [id]
            );
            
            if (existingDraft.length > 0) {
                // Update existing draft
                await db.execute(
                    `UPDATE conference_db.publication_drafts 
                     SET publication_date = ?, publication_description = ?, publication_link = ?, updated_at = NOW()
                     WHERE id = ?`,
                    [date, title, link || null, id]
                );
                
                return res.json({ message: "Draft updated successfully", id });
            }
        }
        
        // Insert new draft
        const [result] = await db.execute(
            `INSERT INTO conference_db.publication_drafts 
             (publication_date, publication_description, publication_link, created_at) 
             VALUES (?, ?, ?, NOW())`,
            [date, title, link || null]
        );
        
        res.status(201).json({ 
            message: "Draft saved successfully", 
            id: result.insertId 
        });
    } catch (error) {
        console.error("Error saving publication draft:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get latest publications - specific route before parameter routes
router.get("/publications/latest", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        
        const [publications] = await db.query(
            `SELECT id, publication_date, publication_description, publication_link
             FROM conference_db.conference_publications 
             ORDER BY publication_date DESC
             LIMIT ?`,
            [limit]
        );
        
        res.json({ publications });
    } catch (error) {
        console.error("Error fetching latest publications:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Create a new publication
router.post("/publications", async (req, res) => {
    try {
        const { title, date, link } = req.body;
        
        // Verify user has appropriate permissions
        const [currentUser] = await db.query(
            "SELECT account_type FROM conference_db.users WHERE id = ?", 
            [req.user.id]
        );
        
        if (currentUser.length === 0 || 
            (currentUser[0].account_type !== 'admin' && 
             currentUser[0].account_type !== 'super_admin')) {
            return res.status(403).json({ error: "Only Admins can add publications" });
        }
        
        // Validate input
        if (!title || !date) {
            return res.status(400).json({ error: "Title and date are required" });
        }
        
        // Insert new publication using the link field also
        const [result] = await db.execute(
            `INSERT INTO conference_db.conference_publications 
             (publication_date, publication_description, publication_link) 
             VALUES (?, ?, ?)`,
            [date, title, link || null]
        );
        
        res.status(201).json({ 
            message: "Publication created successfully", 
            id: result.insertId 
        });
    } catch (error) {
        console.error("Error creating publication:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Get a specific publication by ID - parameter route after specific routes
router.get("/publications/:id", async (req, res) => {
    try {
        const publicationId = req.params.id;
        
        const [publications] = await db.query(
            `SELECT id, publication_date, publication_description, publication_link, created_at 
             FROM conference_db.conference_publications 
             WHERE id = ?`,
            [publicationId]
        );
        
        if (publications.length === 0) {
            return res.status(404).json({ error: "Publication not found" });
        }
        
        res.json({ publication: publications[0] });
    } catch (error) {
        console.error("Error fetching publication:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Replace the old PUT route with the updated one that includes publication_link:
router.put("/publications/:id", async (req, res) => {
    try {
        const publicationId = req.params.id;
        const { title, date, link } = req.body;
        
        // Verify user has appropriate permissions
        const [currentUser] = await db.query(
            "SELECT account_type FROM conference_db.users WHERE id = ?", 
            [req.user.id]
        );
        
        if (currentUser.length === 0 || 
            (currentUser[0].account_type !== 'admin' && 
             currentUser[0].account_type !== 'super_admin')) {
            return res.status(403).json({ error: "Only Admins can update publications" });
        }
        
        // Check if publication exists
        const [existingPublication] = await db.query(
            `SELECT id FROM conference_db.conference_publications WHERE id = ?`,
            [publicationId]
        );
        
        if (existingPublication.length === 0) {
            return res.status(404).json({ error: "Publication not found" });
        }
        
        // Validate input
        if (!title || !date) {
            return res.status(400).json({ error: "Title and date are required" });
        }
        
        // Update publication including publication_link column
        await db.execute(
            `UPDATE conference_db.conference_publications 
             SET publication_date = ?, publication_description = ?, publication_link = ?
             WHERE id = ?`,
            [date, title, link || null, publicationId]
        );
        
        res.json({ message: "Publication updated successfully" });
    } catch (error) {
        console.error("Error updating publication:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Delete a publication - parameter route after specific routes
router.delete("/publications/:id", async (req, res) => {
    try {
        const publicationId = req.params.id;
        
        // Verify user has appropriate permissions
        const [currentUser] = await db.query(
            "SELECT account_type FROM conference_db.users WHERE id = ?", 
            [req.user.id]
        );
        
        if (currentUser.length === 0 || 
            (currentUser[0].account_type !== 'admin' && 
             currentUser[0].account_type !== 'super_admin')) {
            return res.status(403).json({ error: "Only Admins can delete publications" });
        }
        
        // Check if publication exists
        const [existingPublication] = await db.query(
            `SELECT id FROM conference_db.conference_publications WHERE id = ?`,
            [publicationId]
        );
        
        if (existingPublication.length === 0) {
            return res.status(404).json({ error: "Publication not found" });
        }
        
        // Delete publication
        await db.execute(
            `DELETE FROM conference_db.conference_publications WHERE id = ?`,
            [publicationId]
        );
        
        res.json({ message: "Publication deleted successfully" });
    } catch (error) {
        console.error("Error deleting publication:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

router.get("/debug-db", async (req, res) => {
    try {
        // Test basic database connection
        console.log("Testing database connection...");
        const [result] = await db.query("SELECT 1 as test");
        console.log("Database connection working:", result);
        
        // Check for conference_publications table
        console.log("Checking for tables...");
        const [tables] = await db.query(
            `SHOW TABLES FROM conference_db LIKE 'conference_publications'`
        );
        console.log("Tables check result:", tables);
        
        if (tables.length === 0) {
            return res.json({
                status: "table_missing",
                message: "The conference_publications table doesn't exist",
                connectionOk: true
            });
        }
        
        // Check table structure
        const [columns] = await db.query(
            `SHOW COLUMNS FROM conference_db.conference_publications`
        );
        
        res.json({
            status: "ok",
            message: "Database connection successful",
            tableExists: true,
            columns: columns.map(col => col.Field)
        });
    } catch (error) {
        console.error("Database diagnostic error:", error);
        res.status(500).json({
            status: "error",
            message: error.message,
            code: error.code,
            stack: error.stack
        });
    }
});

export default router;
