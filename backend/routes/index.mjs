// routes/index.mjs

import express from 'express';
import eventController from '../controllers/eventController.mjs';  // Correct import path

const router = express.Router();

// Use the methods from eventController as the route handlers
router.get('/api/events', eventController.getEvents);
router.get('/api/events/:id', eventController.getEventById);
router.post('/api/events', eventController.createEvent);
router.put('/api/events/:id', eventController.updateEvent);
router.delete('/api/events/:id', eventController.deleteEvent);

export default router;
