const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Activity = require('../models/Activity');
const authMiddleware = require('../middleware/auth');

// Get user profile
router.get('/:userId', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('gamification.badges.badgeId')
      .populate('gamification.achievements.achievementId');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { displayName, bio, avatar } = req.body;
    const user = req.user;

    // Sanitize and validate inputs
    if (displayName) {
      const sanitized = displayName.trim().substring(0, 50);
      user.profile.displayName = sanitized;
    }
    if (bio) {
      const sanitized = bio.trim().substring(0, 500);
      user.profile.bio = sanitized;
    }
    if (avatar) {
      const sanitized = avatar.trim().substring(0, 200);
      user.profile.avatar = sanitized;
    }

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        profile: user.profile
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user activities
router.get('/:userId/activities', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100); // Max 100 items per page
    const skip = (page - 1) * limit;

    const activities = await Activity.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip);

    const total = await Activity.countDocuments({ userId: req.params.userId });

    res.json({
      activities,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add points to user (admin or system action)
router.post('/points', authMiddleware, async (req, res) => {
  try {
    const { points, reason } = req.body;
    const user = req.user;

    if (!points || points <= 0) {
      return res.status(400).json({ message: 'Invalid points value' });
    }

    // Limit max points that can be added at once to prevent abuse
    if (points > 10000) {
      return res.status(400).json({ message: 'Cannot add more than 10000 points at once' });
    }

    user.addPoints(points);
    await user.save();

    // Log activity
    await Activity.create({
      userId: user._id,
      type: 'custom',
      description: reason || 'Points awarded',
      points
    });

    res.json({
      message: 'Points added successfully',
      gamification: user.gamification
    });
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get leaderboard
router.get('/leaderboard/top', async (req, res) => {
  try {
    // Check if database is connected
    const { isDBConnected } = require('../config/database');
    if (!isDBConnected()) {
      return res.json({ 
        leaderboard: [],
        message: 'Database not connected - leaderboard unavailable'
      });
    }

    const limit = Math.min(parseInt(req.query.limit) || 10, 100); // Max 100 users
    const timeframe = req.query.timeframe || 'all'; // all, weekly, monthly

    let query = {};
    
    // Filter by timeframe if needed (you can customize this)
    if (timeframe === 'weekly') {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      query.createdAt = { $gte: weekAgo };
    } else if (timeframe === 'monthly') {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      query.createdAt = { $gte: monthAgo };
    }

    const users = await User.find(query)
      .select('username profile.displayName profile.avatar gamification.totalPoints gamification.level')
      .sort({ 'gamification.totalPoints': -1 })
      .limit(limit);

    const leaderboard = users.map((user, index) => ({
      rank: index + 1,
      userId: user._id,
      username: user.username,
      displayName: user.profile.displayName,
      avatar: user.profile.avatar,
      points: user.gamification.totalPoints,
      level: user.gamification.level
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
