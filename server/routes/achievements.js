const express = require('express');
const router = express.Router();
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Activity = require('../models/Activity');
const authMiddleware = require('../middleware/auth');

// Get all achievements
router.get('/', async (req, res) => {
  try {
    const achievements = await Achievement.find({ isActive: true })
      .populate('rewards.badgeId')
      .sort({ 'criteria.target': 1 });

    res.json({ achievements });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's achievements progress
router.get('/my-progress', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('gamification.achievements.achievementId');

    const achievements = await Achievement.find({ isActive: true });
    
    // Calculate progress for each achievement
    const progressData = achievements.map(achievement => {
      const userAchievement = user.gamification.achievements.find(
        ua => ua.achievementId && ua.achievementId._id.toString() === achievement._id.toString()
      );

      let currentValue = 0;
      
      // Calculate current value based on criteria type
      switch (achievement.criteria.type) {
        case 'points':
          currentValue = user.gamification.totalPoints;
          break;
        case 'activities':
          currentValue = user.statistics.activitiesCompleted;
          break;
        case 'streak':
          currentValue = user.gamification.streak.longest;
          break;
        case 'level':
          currentValue = user.gamification.level;
          break;
        case 'challenges':
          currentValue = user.statistics.challengesCompleted;
          break;
        default:
          currentValue = userAchievement?.progress || 0;
      }

      const progress = Math.min((currentValue / achievement.criteria.target) * 100, 100);

      return {
        achievement,
        progress: Math.round(progress),
        currentValue,
        targetValue: achievement.criteria.target,
        completed: userAchievement?.completed || false,
        completedAt: userAchievement?.completedAt
      };
    });

    res.json({ progress: progressData });
  } catch (error) {
    console.error('Get achievement progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Check and award achievements
router.post('/check', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('gamification.achievements.achievementId');

    const achievements = await Achievement.find({ isActive: true });
    const newlyEarned = [];

    for (const achievement of achievements) {
      // Skip if already completed
      const userAchievement = user.gamification.achievements.find(
        ua => ua.achievementId && ua.achievementId._id.toString() === achievement._id.toString()
      );

      if (userAchievement?.completed) continue;

      let currentValue = 0;
      
      // Get current value based on criteria
      switch (achievement.criteria.type) {
        case 'points':
          currentValue = user.gamification.totalPoints;
          break;
        case 'activities':
          currentValue = user.statistics.activitiesCompleted;
          break;
        case 'streak':
          currentValue = user.gamification.streak.longest;
          break;
        case 'level':
          currentValue = user.gamification.level;
          break;
        case 'challenges':
          currentValue = user.statistics.challengesCompleted;
          break;
      }

      // Check if achievement is completed
      if (currentValue >= achievement.criteria.target) {
        if (!userAchievement) {
          // Add new achievement
          user.gamification.achievements.push({
            achievementId: achievement._id,
            progress: 100,
            completed: true,
            completedAt: new Date()
          });
        } else {
          // Update existing achievement
          userAchievement.progress = 100;
          userAchievement.completed = true;
          userAchievement.completedAt = new Date();
        }

        // Award points
        if (achievement.rewards.points > 0) {
          user.addPoints(achievement.rewards.points);
        }

        // Award badge if specified
        if (achievement.rewards.badgeId) {
          const hasBadge = user.gamification.badges.some(
            b => b.badgeId.toString() === achievement.rewards.badgeId.toString()
          );
          
          if (!hasBadge) {
            user.gamification.badges.push({
              badgeId: achievement.rewards.badgeId,
              earnedAt: new Date()
            });
          }
        }

        // Log activity
        await Activity.create({
          userId: user._id,
          type: 'achievement',
          description: `Unlocked achievement: ${achievement.name}`,
          points: achievement.rewards.points,
          metadata: { achievementId: achievement._id }
        });

        newlyEarned.push(achievement);
      }
    }

    await user.save();

    res.json({
      message: newlyEarned.length > 0 ? 'Achievements unlocked!' : 'No new achievements',
      newAchievements: newlyEarned,
      gamification: user.gamification
    });
  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create achievement (admin only - simplified for demo)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const achievement = new Achievement(req.body);
    await achievement.save();

    res.status(201).json({
      message: 'Achievement created successfully',
      achievement
    });
  } catch (error) {
    console.error('Create achievement error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
