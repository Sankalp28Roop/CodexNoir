const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

console.log('[Server] Starting...');

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

let dbReady = false;
let dbConnecting = false;

const connectWithRetry = async () => {
  if (dbConnecting) return;
  dbConnecting = true;
  try {
    await connectDB();
    dbReady = true;
    console.log('[Server] Database initialized');
  } catch (err) {
    console.error('[Server] DB init error:', err.message);
    dbConnecting = false;
    setTimeout(connectWithRetry, 2000);
  }
};

connectWithRetry();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const aiRoutes = require('./routes/ai');

const dbMiddleware = (req, res, next) => {
  if (!dbReady) {
    return res.status(503).json({ message: 'Database connecting, please try again' });
  }
  next();
};

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/notes', dbMiddleware, notesRoutes);
app.use('/api/ai', dbMiddleware, aiRoutes);

process.on('unhandledRejection', (err) => {
  console.error('[Server] Unhandled rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught exception:', err.message);
});

module.exports = app;