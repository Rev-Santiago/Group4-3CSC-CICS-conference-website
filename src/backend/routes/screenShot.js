import express from "express";

const router = express.Router();

// List of all page names
const pageNames = [
  "Home", 
  "Call For Papers", 
  "Contacts", 
  "Partners", 
  "Committee", 
  "Event History", 
  "Registration & Fees", 
  "Publication", 
  "Schedule", 
  "Venue", 
  "Keynote Speakers", 
  "Invited Speakers"
];

// Colored squares as base64 (small files, guaranteed to work)
const colors = [
  // Red
  'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAnElEQVR42u3RAQ0AAAQAMHrxQbIEfV/XbbhGbHlJkAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECCfLYGj9u0MlWEAAAAASUVORK5CYII=',
  // Blue
  'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAnElEQVR42u3RAQ0AAAQAMPrxTbIEfV/XbbhGbHlJkAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECCfLcGvyO0MJQvfAAAAAElFTkSuQmCC',
  // Green
  'iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAnElEQVR42u3RAQ0AAAQAMPpI09JE/V/XbbhGbHlJkAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECBAgAABAgQIECCfLYmxku0MgBxPAAAAAElFTkSuQmCC'
];

// Return screenshots as data URLs
router.get("/screenshots", (req, res) => {
  console.log("Screenshot route called!");
  
  const screenshots = {};
  
  // Create a data URL for each page
  pageNames.forEach((pageName, index) => {
    // Cycle through colors
    const colorIndex = index % colors.length;
    screenshots[pageName] = `data:image/png;base64,${colors[colorIndex]}`;
  });
  
  console.log(`Returning ${Object.keys(screenshots).length} screenshot data URLs`);
  res.json(screenshots);
});

// For compatibility
router.get("/generate-screenshots", (req, res) => {
  console.log("Generate screenshots route called!");
  
  const screenshots = {};
  
  // Create a data URL for each page
  pageNames.forEach((pageName, index) => {
    // Cycle through colors
    const colorIndex = index % colors.length;
    screenshots[pageName] = `data:image/png;base64,${colors[colorIndex]}`;
  });
  
  console.log(`Generated ${Object.keys(screenshots).length} test images`);
  res.json(screenshots);
});

export default router;