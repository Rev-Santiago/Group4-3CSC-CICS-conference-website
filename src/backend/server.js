import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import db from "./db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import icsRoute from "./routes/icsRoute.js";
import screenshotRouter from "./routes/screenShot.js";
import eventsRouter from "./routes/events.js";

const app = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 500;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Middleware
app.use(express.json());

app.use(
  cors({
    origin: "https://cics-conference-website.onrender.com",
    credentials: true,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "https://www.google.com", "https://www.gstatic.com", "'unsafe-inline'"],
        connectSrc: ["'self'", "http://localhost:5000", "https://www.google.com"],
        frameSrc: ["'self'", "https://www.google.com"],
      },
    },
  })
);

// ✅ Routers
app.use("/api", icsRoute);
app.use("/api", screenshotRouter);
app.use("/api", eventsRouter);
app.use("/uploads", express.static("uploads"));

// ✅ Login Rate Limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many login attempts. Please try again later." },
});

// 🛡️ JWT Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(403).json({ error: "Access denied." });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token." });
    req.user = user;
    next();
  });
};

// ✅ Routes
app.get("/api", (req, res) => {
  res.json({ message: "✅ API is working!" });
});

app.post("/api/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.query("SELECT id, email, password, account_type FROM users WHERE email = ?", [email]);
    if (!users || users.length === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ message: "Login successful", token, account_type: user.account_type });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/api/verify-captcha", async (req, res) => {
  const { token } = req.body;
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`, {
      method: "POST",
    });
    const data = await response.json();
    res.json({ success: data.success });
  } catch (error) {
    console.error("Captcha verification failed:", error);
    res.status(500).json({ success: false });
  }
});

app.get("/api/admin-dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Welcome to the Admin Dashboard", user: req.user.email });
});

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../dist", "index.html"));
  });
}

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
