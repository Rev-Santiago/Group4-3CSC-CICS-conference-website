// routes/index.mjs
import express from 'express';
import { getAllEvents } from '../controllers/eventController.mjs'; // Named import
import { createEvent } from '../controllers/eventController.mjs';

const router = express.Router();

// Define the GET /api/events route
router.get('/events', getAllEvents);
router.post('/events', createEvent);

export default router;
