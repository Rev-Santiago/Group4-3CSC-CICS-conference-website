import express from "express";
import puppeteer from "puppeteer-core";

const router = express.Router();

const pages = {
  Home: "http://localhost:5173/",
  "Call For Papers": "http://localhost:5173/call-for-papers",
  Contacts: "http://localhost:5173/contact",
  Partners: "http://localhost:5173/partners",
  Committee: "http://localhost:5173/committee",
  "Event History": "http://localhost:5173/event-history",
  "Registration & Fees": "http://localhost:5173/registration-and-fees",
  Publication: "http://localhost:5173/publication",
  Schedule: "http://localhost:5173/schedule",
  Venue: "http://localhost:5173/venue",
  "Keynote Speakers": "http://localhost:5173/keynote-speakers",
  "Invited Speakers": "http://localhost:5173/invited-speakers"
};

// Capture screenshot function
const captureScreenshot = async (url) => {
  const browser = await puppeteer.launch({
    executablePath: puppeteer.executablePath(),
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

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

  await page.setViewport({ width: 1280, height: 720 });

  const screenshot = await page.screenshot({ encoding: "base64" });

  await browser.close();

  return `data:image/png;base64,${screenshot}`;
};

// API route to capture screenshots
router.get("/screenshots", async (req, res) => {
    try {
        const screenshotData = {};

        for (const [title, url] of Object.entries(pages)) {
            screenshotData[title] = await captureScreenshot(url);
        }

        res.json(screenshotData);
    } catch (error) {
        console.error("Error capturing screenshots:", error);
        res.status(500).json({ error: "Failed to capture screenshots" });
    }
});

export default router;
