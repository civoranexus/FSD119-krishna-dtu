import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import apiRoutes from './routes/index.js';

dotenv.config();

const app = express();

/**
 * Global Middleware
 */
app.use(cors());
app.use(express.json());

/**
 * Health Check Route
 * Used to verify server status
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'HealthVillage backend is running'
  });
});

/**
 * Central API Routes
 */
app.use('/api', apiRoutes);

/**
 * Server Initialization
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
