import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.mjs';  // Import routes from the routes/index.js

dotenv.config();  // Load .env variables

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware setup
app.use(cors());
app.use(express.json());  // To parse JSON in request bodies

// Use the routes defined in routes/index.js
app.use('/api', routes);  // All routes will be prefixed with '/api'

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
