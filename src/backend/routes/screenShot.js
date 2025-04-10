import express from "express";
import chromium from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import fs from "fs";
import path from "path";

const router = express.Router();

const PAGES = [
  "Home",
  "Call For Papers",
  "Committee",
  "Contacts",
  "Event History",
  "Invited Speakers",
  "Keynote Speakers",
  "Partners",
  "Publication",
  "Registration & Fees",
  "Schedule",
  "Venue",
];

const BASE_URL = "https://cics-conference-website.onrender.com/";

router.get("/generate-screenshots", async (req, res) => {
  const results = {};
  const executablePath =
    process.env.AWS_EXECUTION_ENV ? await chromium.executablePath : puppeteer.executablePath();

  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
  });

  try {
    for (const pageName of PAGES) {
      const page = await browser.newPage();
      const urlPath = pageName.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-");
      const fullUrl = `${BASE_URL}${urlPath}`;

      try {
        await page.goto(fullUrl, { waitUntil: "networkidle2", timeout: 30000 });
        const screenshotBuffer = await page.screenshot({ fullPage: true });

        const filename = `${urlPath}.png`;
        const filePath = path.join("screenshots", filename);
        fs.mkdirSync("screenshots", { recursive: true });
        fs.writeFileSync(filePath, screenshotBuffer);

        results[pageName] = `/screenshots/${filename}`;
      } catch {
        results[pageName] = null;
      }

      await page.close();
    }

    res.json(results);
  } catch {
    res.status(500).json({ error: "Screenshot generation failed." });
  } finally {
    await browser.close();
  }
});


export default router;