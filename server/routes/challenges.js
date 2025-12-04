const express = require('express');
const router = express.Router();
const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Activity = require('../models/Activity');
const authMiddleware = require('../middleware/auth');

// Get all active challenges
router.get('/', async (req, res) => {
  try {
    const now = new Date();
    const type = req.query.type; // daily, weekly, monthly, special

    let query = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    };

    if (type) {
      query.type = type;
    }

    const challenges = await Challenge.find(query)
      .populate('rewards.badgeId')
      .sort({ startDate: -1 });

    res.json({ challenges });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's challenges
router.get('/my-challenges', authMiddleware, async (req, res) => {
  try {
    const challenges = await Challenge.find({
      'participants.userId': req.user._id,
      isActive: true
    }).populate('rewards.badgeId');

    const userChallenges = challenges.map(challenge => {
      const participation = challenge.participants.find(
        p => p.userId.toString() === req.user._id.toString()
      );

      return {
        challenge,
        progress: participation.progress,
        completed: participation.completed,
        completedAt: participation.completedAt
      };
    });

    res.json({ challenges: userChallenges });
  } catch (error) {
    console.error('Get user challenges error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Join a challenge
router.post('/:challengeId/join', authMiddleware, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.challengeId);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    if (!challenge.isActive) {
      return res.status(400).json({ message: 'Challenge is not active' });
    }

    // Check if already joined
    const alreadyJoined = challenge.participants.some(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (alreadyJoined) {
      return res.status(400).json({ message: 'Already joined this challenge' });
    }

    // Check max participants
    if (challenge.maxParticipants && challenge.participants.length >= challenge.maxParticipants) {
      return res.status(400).json({ message: 'Challenge is full' });
    }

    // Add user to participants
    challenge.participants.push({
      userId: req.user._id,
      progress: 0,
      completed: false
    });

    await challenge.save();

    // Log activity
    await Activity.create({
      userId: req.user._id,
      type: 'challenge',
      description: `Joined challenge: ${challenge.title}`,
      points: 0,
      metadata: { challengeId: challenge._id }
    });

    res.json({
      message: 'Successfully joined challenge',
      challenge
    });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update challenge progress
router.post('/:challengeId/progress', authMiddleware, async (req, res) => {
  try {
    const { progress } = req.body;
    const challenge = await Challenge.findById(req.params.challengeId);

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const participant = challenge.participants.find(
      p => p.userId.toString() === req.user._id.toString()
    );

    if (!participant) {
      return res.status(400).json({ message: 'Not participating in this challenge' });
    }

    if (participant.completed) {
      return res.status(400).json({ message: 'Challenge already completed' });
    }

    // Update progress
    participant.progress = Math.min(progress, 100);

    // Check if completed
    if (participant.progress >= 100) {
      participant.completed = true;
      participant.completedAt = new Date();

      // Award rewards
      const user = await User.findById(req.user._id);
      user.addPoints(challenge.rewards.points);
      user.statistics.challengesCompleted += 1;

      if (challenge.rewards.experience) {
        user.gamification.experience += challenge.rewards.experience;
        user.calculateLevel();
      }

      // Award badge if specified
      if (challenge.rewards.badgeId) {
        const hasBadge = user.gamification.badges.some(
          b => b.badgeId.toString() === challenge.rewards.badgeId.toString()
        );

        if (!hasBadge) {
          user.gamification.badges.push({
            badgeId: challenge.rewards.badgeId,
            earnedAt: new Date()
          });
        }
      }

      await user.save();

      // Log activity
      await Activity.create({
        userId: req.user._id,
        type: 'challenge',
        description: `Completed challenge: ${challenge.title}`,
        points: challenge.rewards.points,
        metadata: { challengeId: challenge._id }
      });
    }

    await challenge.save();

    res.json({
      message: participant.completed ? 'Challenge completed!' : 'Progress updated',
      participant,
      ...(participant.completed && { rewards: challenge.rewards })
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create challenge (admin only - simplified for demo)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const challenge = new Challenge(req.body);
    await challenge.save();

    res.status(201).json({
      message: 'Challenge created successfully',
      challenge
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
