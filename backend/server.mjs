import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.mjs';  // Ensure this path is correct
import db from './config/database.mjs';

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Register the API routes
app.use('/api', routes);

// Test route
app.get('/', (req, res) => {
  res.send('Welcome to the Conference Website API');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Test database connection
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ' + err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + db.threadId);
});
