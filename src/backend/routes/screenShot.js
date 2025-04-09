import express from "express";
import puppeteer from "puppeteer";

const router = express.Router();
const BASE_URL = "https://cics-conference-website.onrender.com"; // Replace with your actual deployed frontend

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

// Capture screenshot function
const captureScreenshot = async (url) => {
    const browser = await puppeteer.launch({
        headless: "new", // Needed in latest Puppeteer versions
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });

    const screenshot = await page.screenshot({ encoding: "base64" });
    await browser.close();

    return `data:image/png;base64,${screenshot}`;
};

let screenshotCache = {};

router.get("/screenshots", async (req, res) => {
    try {
        if (Object.keys(screenshotCache).length) {
            return res.json(screenshotCache); // Serve cached version
        }

        const screenshotData = {};
        for (const [title, url] of Object.entries(pages)) {
            screenshotData[title] = await captureScreenshot(url);
        }

        screenshotCache = screenshotData;
        res.json(screenshotData);
    } catch (error) {
        console.error("Error capturing screenshots:", error);
        res.status(500).json({ error: "Failed to capture screenshots" });
    }
});


export default router;
