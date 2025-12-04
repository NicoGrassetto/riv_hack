require('dotenv').config();

// Validate critical environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL ERROR: JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { connectDB, isDBConnected } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const achievementRoutes = require('./routes/achievements');
const badgeRoutes = require('./routes/badges');
const challengeRoutes = require('./routes/challenges');
const sprintGameRoutes = require('./routes/sprintGame');
const { apiLimiter } = require('./middleware/rateLimiter');

// Initialize Express app
const app = express();

// Connect to database (optional - Sprint Game works without it)
if (process.env.MONGODB_URI) {
  connectDB();
} else {
  console.warn('⚠️ MONGODB_URI not set - running without database');
  console.warn('📊 Sprint Game will work, but Auth/User features disabled');
}

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/badges', badgeRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/sprint-game', sprintGameRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'NMBS Gamify API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      achievements: '/api/achievements',
      badges: '/api/badges',
      challenges: '/api/challenges',
      sprintGame: '/api/sprint-game'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
});
