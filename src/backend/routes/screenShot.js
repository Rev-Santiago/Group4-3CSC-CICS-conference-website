// 📦 Imports
import express from "express";
import puppeteer from "puppeteer";

// 🌐 Setup
const router = express.Router();
const BASE_URL = "https://cics-conference-website.onrender.com";

const pages = {
  Home: `${BASE_URL}/`,
  "Call For Papers": `${BASE_URL}/call-for-papers`,
  Contacts: `${BASE_URL}/contact`,
  Partners: `${BASE_URL}/partners`,
  Committee: `${BASE_URL}/committee`,
  "Event History": `${BASE_URL}/event-history`,
  "Registration & Fees": `${BASE_URL}/registration-and-fees`,
  Publication: `${BASE_URL}/publication`,
  Schedule: `${BASE_URL}/schedule`,
  Venue: `${BASE_URL}/venue`,
  "Keynote Speakers": `${BASE_URL}/keynote-speakers`,
  "Invited Speakers": `${BASE_URL}/invited-speakers`,
};

// 📸 Capture screenshot utility (fast + optimized)
const captureScreenshot = async (url) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // ⚡ Block unnecessary resources
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const type = req.resourceType();
    if (["image", "stylesheet", "font"].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(url, {
    waitUntil: "domcontentloaded",
    timeout: 15000,
  });

  // 🖼️ Use fixed height for speed (skip full scroll height)
  await page.setViewport({ width: 1280, height: 720 });

  const screenshot = await page.screenshot({ encoding: "base64" });

  await browser.close();
  return `data:image/png;base64,${screenshot}`;
};

// 🧠 In-memory cache
let screenshotCache = {
  data: {},
  timestamp: 0,
};

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

// 🔍 Route: GET /api/screenshots (cached + parallel)
router.get("/screenshots", async (req, res) => {
  try {
    const now = Date.now();
    const isFresh = now - screenshotCache.timestamp < CACHE_DURATION;

    if (isFresh && Object.keys(screenshotCache.data).length) {
      return res.json(screenshotCache.data);
    }

    // 🧵 Generate all screenshots in parallel
    const screenshotData = await Promise.all(
      Object.entries(pages).map(async ([title, url]) => {
        try {
          console.log(`📸 Capturing: ${title}`);
          const image = await captureScreenshot(url);
          return [title, image];
        } catch (err) {
          console.error(`❌ Failed to capture ${title}`, err.message);
          return [title, null];
        }
      })
    );

    screenshotCache = {
      data: Object.fromEntries(screenshotData),
      timestamp: now,
    };

    res.json(screenshotCache.data);
  } catch (error) {
    console.error("Error capturing screenshots:", error);
    res.status(500).json({ error: "Failed to capture screenshots" });
  }
});

// 🔄 Route: GET /api/screenshots/refresh (force update)
router.get("/screenshots/refresh", async (req, res) => {
  try {
    const screenshotData = await Promise.all(
      Object.entries(pages).map(async ([title, url]) => {
        try {
          console.log(`📸 Refreshing: ${title}`);
          const image = await captureScreenshot(url);
          return [title, image];
        } catch (err) {
          console.error(`❌ Failed to refresh ${title}`, err.message);
          return [title, null];
        }
      })
    );

    screenshotCache = {
      data: Object.fromEntries(screenshotData),
      timestamp: Date.now(),
    };

    res.json({ message: "Screenshots refreshed successfully." });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(500).json({ error: "Failed to refresh screenshots." });
  }
});

// 🚀 Export router
export default router;
