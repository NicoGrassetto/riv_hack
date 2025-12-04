const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '🏆'
  },
  category: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'master', 'special'],
    default: 'beginner'
  },
  criteria: {
    type: {
      type: String,
      enum: ['points', 'activities', 'streak', 'level', 'challenges', 'custom'],
      required: true
    },
    target: {
      type: Number,
      required: true
    },
    description: String
  },
  rewards: {
    points: {
      type: Number,
      default: 0
    },
    badgeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Badge'
    }
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Achievement', achievementSchema);
