const express = require('express');
const router = express.Router();
const Badge = require('../models/Badge');
const authMiddleware = require('../middleware/auth');

// Get all badges
router.get('/', async (req, res) => {
  try {
    const badges = await Badge.find({ isActive: true })
      .sort({ rarity: 1, createdAt: -1 });

    res.json({ badges });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's badges
router.get('/my-badges', authMiddleware, async (req, res) => {
  try {
    const user = await req.user.populate('gamification.badges.badgeId');

    const badges = user.gamification.badges.map(b => ({
      badge: b.badgeId,
      earnedAt: b.earnedAt
    }));

    res.json({ badges });
  } catch (error) {
    console.error('Get user badges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create badge (admin only - simplified for demo)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const badge = new Badge(req.body);
    await badge.save();

    res.status(201).json({
      message: 'Badge created successfully',
      badge
    });
  } catch (error) {
    console.error('Create badge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
