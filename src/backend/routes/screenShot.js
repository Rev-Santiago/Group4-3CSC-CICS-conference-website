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

// 📸 Capture screenshot utility
const captureScreenshot = async (url) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

  const screenshot = await page.screenshot({ encoding: "base64" });
  await browser.close();

  return `data:image/png;base64,${screenshot}`;
};

// 🧠 In-memory cache
let screenshotCache = {};

// 🔍 Route: GET /api/screenshots (load from cache if available)
router.get("/screenshots", async (req, res) => {
  try {
    if (Object.keys(screenshotCache).length) {
      return res.json(screenshotCache);
    }

    const screenshotData = {};
    for (const [title, url] of Object.entries(pages)) {
      try {
        console.log(`📸 Capturing: ${title}`);
        screenshotData[title] = await captureScreenshot(url);
      } catch (err) {
        console.error(`❌ Failed to capture ${title}`, err.message);
        screenshotData[title] = null;
      }
    }

    screenshotCache = screenshotData;
    res.json(screenshotData);
  } catch (error) {
    console.error("Error capturing screenshots:", error);
    res.status(500).json({ error: "Failed to capture screenshots" });
  }
});

// 🔄 Route: GET /api/screenshots/refresh (force refresh)
router.get("/screenshots/refresh", async (req, res) => {
  try {
    const screenshotData = {};

    for (const [title, url] of Object.entries(pages)) {
      try {
        console.log(`📸 Refreshing: ${title}`);
        screenshotData[title] = await captureScreenshot(url);
      } catch (err) {
        console.error(`❌ Failed to refresh ${title}`, err.message);
        screenshotData[title] = null;
      }
    }

    screenshotCache = screenshotData;
    res.json({ message: "Screenshots refreshed successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to refresh screenshots." });
  }
});

// 🚀 Export router to be used in server.js
export default router;
