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

async function startServer() {
  try {
    await connectDB();
    console.log('Database connected');
    
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

    app.use((err, req, res, next) => {
      console.error('Error:', err.message);
      res.status(500).json({ message: 'Something went wrong!' });
    });
    
    console.log('Server ready');
  } catch (err) {
    console.error('Failed to start server:', err.message);
  }
}

startServer();

module.exports = app;