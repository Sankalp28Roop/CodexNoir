const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const aiRoutes = require('./routes/ai');

const app = express();

const frontendPath = path.join(__dirname, '../frontend');

app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const connectDB = require('./config/db');

let isDBConnected = false;

connectDB()
  .then(() => {
    isDBConnected = true;
    console.log('Database connected successfully');
  })
  .catch(err => {
    console.error('Database connection failed:', err.message);
  });

app.use((req, res, next) => {
  if (!isDBConnected) {
    return res.status(503).json({ message: 'Service temporarily unavailable' });
  }
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/ai', aiRoutes);

app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

let server;
if (process.env.VERCEL === undefined) {
  server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;