const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

console.log('Starting server...');

const frontendPath = path.join(__dirname, '../frontend');

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const connectDB = require('./config/db');

connectDB()
  .then(() => console.log('DB init done'))
  .catch(err => console.error('DB init failed:', err.message));

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/ai', aiRoutes);

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

module.exports = app;