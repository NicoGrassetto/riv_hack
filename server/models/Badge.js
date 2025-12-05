const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
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
    required: true
  },
  color: {
    type: String,
    default: '#FFD700'
  },
  rarity: {
    type: String,
    enum: ['common', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  category: {
    type: String,
    enum: [
      'achievement', 
      'milestone', 
      'special', 
      'seasonal', 
      'team',
      'delivery',
      'predictability',
      'flow',
      'collaboration',
      'improvement'
    ],
    default: 'achievement'
  },
  points: {
    type: Number,
    default: 0
  },
  awardCondition: {
    type: String,
    default: ''
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

module.exports = mongoose.model('Badge', badgeSchema);
