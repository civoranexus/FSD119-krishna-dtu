import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Resolve __dirname (ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path to backend/.env
const envPath = path.join(__dirname, '..', '.env');

// 🔐 FORCE LOAD ENV
dotenv.config({ path: envPath });

// 🔍 HARD VERIFY ENV VARIABLES
console.log('ENV CHECK:', {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME,
});

import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
