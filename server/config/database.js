const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    isConnected = false;
    console.warn('⚠️ MongoDB not available:', error.message);
    console.warn('📊 Sprint Game will still work (uses CSV data)');
    console.warn('🔒 Auth/User features require MongoDB');
  }
};

const isDBConnected = () => isConnected;

module.exports = { connectDB, isDBConnected };
