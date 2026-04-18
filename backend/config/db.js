const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const mongoURL = process.env.MONGODB_URI || process.env.MONGODB_URL || 'mongodb://localhost:27017/codexnoir';
    const conn = await mongoose.connect(mongoURL);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    isConnected = false;
  }
};

module.exports = connectDB;