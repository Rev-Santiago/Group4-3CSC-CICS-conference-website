// 📦 Import Puppeteer for serverless environments like Render
import puppeteer from "puppeteer";

/**
 * Captures a full-page screenshot of the given URL
 * optimized for serverless environments like Render.
 * 
 * @param {string} url - The page URL to capture
 * @returns {string} base64 encoded PNG image string
 */
const captureScreenshot = async (url) => {
  // 🛠️ Get the path to the headless Chromium binary
 const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

  const page = await browser.newPage();

  // ⚡ Speed optimization: Block fonts, images, and stylesheets
  await page.setRequestInterception(true);
  page.on("request", (req) => {
    const type = req.resourceType();
    if (["image", "stylesheet", "font"].includes(type)) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // 🌐 Navigate to the page
  await page.goto(url, {
    waitUntil: "networkidle2", // waits for most requests to finish
    timeout: 20000,
  });

  // 📏 Get full height of the <body> to capture the entire page
  const bodyHandle = await page.$("body");
  const box = await bodyHandle?.boundingBox();

  if (!box) {
    throw new Error("❌ Could not get body bounding box!");
  }

  // 🖼️ Set viewport height to match page content
  await page.setViewport({
    width: 1280,
    height: Math.ceil(box.height),
  });

  // 📸 Capture the screenshot in base64 encoding
  const screenshot = await page.screenshot({ encoding: "base64" });

  await browser.close();

  // 🎯 Return the image as a data URI
  return `data:image/png;base64,${screenshot}`;
};

export default captureScreenshot;
