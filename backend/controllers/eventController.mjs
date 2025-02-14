import db from '../config/database.mjs';  // Database connection

// Get all events
const getEvents = (req, res) => {
  db.query('SELECT * FROM events', (err, results) => {
    if (err) {
      console.error('Error fetching events: ' + err.stack);
      return res.status(500).json({ message: 'Error fetching events' });
    }
    res.status(200).json(results);
  });
};

// Get event by ID
const getEventById = (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM events WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error fetching event by ID: ' + err.stack);
      return res.status(500).json({ message: 'Error fetching event' });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(result[0]);
  });
};

// Create a new event
const createEvent = (req, res) => {
  const { name, description, date } = req.body;
  const query = 'INSERT INTO events (name, description, date) VALUES (?, ?, ?)';
  db.query(query, [name, description, date], (err, result) => {
    if (err) {
      console.error('Error creating event: ' + err.stack);
      return res.status(500).json({ message: 'Error creating event' });
    }
    res.status(201).json({ id: result.insertId, name, description, date });
  });
};

// Update an event by ID
const updateEvent = (req, res) => {
  const { id } = req.params;
  const { name, description, date } = req.body;
  const query = 'UPDATE events SET name = ?, description = ?, date = ? WHERE id = ?';
  db.query(query, [name, description, date, id], (err, result) => {
    if (err) {
      console.error('Error updating event: ' + err.stack);
      return res.status(500).json({ message: 'Error updating event' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event updated successfully' });
  });
};

// Delete an event by ID
const deleteEvent = (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM events WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting event: ' + err.stack);
      return res.status(500).json({ message: 'Error deleting event' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  });
};

// Export all functions as default
export default {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
