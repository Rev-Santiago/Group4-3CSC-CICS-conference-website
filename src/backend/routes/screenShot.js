import express from "express";
import puppeteer from "puppeteer";

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
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(url, { waitUntil: "networkidle2" });

    // Get the full height of the document
    const bodyHandle = await page.$("body");
    const { height } = await bodyHandle.boundingBox();
    await page.setViewport({ width: 1280, height: Math.ceil(height) });

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
