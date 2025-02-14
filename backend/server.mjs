import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes/index.mjs';  // Adjusted for ES modules

dotenv.config();  // Load .env variables

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', routes);  // Use routes for API

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
