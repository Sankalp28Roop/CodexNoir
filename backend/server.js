const express = require('express');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

console.log('[Server] Starting...');

const frontendPath = path.join(__dirname, '../frontend');

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests, please try again later' }
});

const connectDB = require('./config/db');

connectDB()
  .then(() => {
    console.log('[Server] Database initialized');
  })
  .catch(err => {
    console.error('[Server] DB init error:', err.message);
  });

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/ai', aiRoutes);

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

process.on('unhandledRejection', (err) => {
  console.error('[Server] Unhandled rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught exception:', err.message);
});

module.exports = app;