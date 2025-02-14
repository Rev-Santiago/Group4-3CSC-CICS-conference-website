import db from '../config/database.mjs';  // Import your database connection

// Create an event
// Create an event
export const createEvent = async (req, res) => {
  const { name, description, date } = req.body;

  if (!name || !description || !date) {
    return res.status(400).json({ error: 'All fields (name, description, date) are required' });
  }

  // Convert ISO date to MySQL-compatible format
  const mysqlDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');

  const query = 'INSERT INTO events (name, description, date) VALUES (?, ?, ?)';
  const values = [name, description, mysqlDate];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting event: ', err);  // Log the full error message
      return res.status(500).json({ error: 'Failed to create event' });
    }
    res.status(201).json({
      id: result.insertId,
      name,
      description,
      date: mysqlDate,
    });
  });
};


// Get all events
export const getAllEvents = (req, res) => {
  const query = 'SELECT * FROM events ORDER BY date';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching events: ', err);  // Log the full error message
      return res.status(500).json({ error: 'Failed to fetch events' });
    }
    res.status(200).json(results);
  });
};

// Get a single event by ID
export const getEventById = (req, res) => {
  const eventId = req.params.id;

  const query = 'SELECT * FROM events WHERE id = ?';
  db.query(query, [eventId], (err, results) => {
    if (err) {
      console.error('Error fetching event: ', err);  // Log the full error message
      return res.status(500).json({ error: 'Failed to fetch event' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json(results[0]);
  });
};

// Update an event by ID
export const updateEvent = (req, res) => {
  const eventId = req.params.id;
  const { name, description, date } = req.body;

  const query = 'UPDATE events SET name = ?, description = ?, date = ? WHERE id = ?';
  const values = [name, description, date, eventId];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating event: ', err);  // Log the full error message
      return res.status(500).json({ error: 'Failed to update event' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({
      id: eventId,
      name,
      description,
      date,
    });
  });
};

// Delete an event by ID
export const deleteEvent = (req, res) => {
  const eventId = req.params.id;

  const query = 'DELETE FROM events WHERE id = ?';
  db.query(query, [eventId], (err, result) => {
    if (err) {
      console.error('Error deleting event: ', err);  // Log the full error message
      return res.status(500).json({ error: 'Failed to delete event' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ message: 'Event deleted successfully' });
  });
};
