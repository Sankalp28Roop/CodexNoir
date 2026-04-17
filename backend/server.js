const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const frontendPath = path.join(__dirname, '../frontend');

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const connectDB = require('./config/db');

let dbReady = false;

connectDB()
  .then(() => {
    dbReady = true;
    console.log('Database connected');
  })
  .catch(err => {
    console.error('DB Error:', err.message);
  });

app.use((req, res, next) => {
  if (!dbReady) {
    console.log('DB not ready, waiting...');
  }
  next();
});

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