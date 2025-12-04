const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profile: {
    displayName: String,
    avatar: {
      type: String,
      default: 'default-avatar.png'
    },
    bio: String
  },
  gamification: {
    totalPoints: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    experience: {
      type: Number,
      default: 0
    },
    badges: [{
      badgeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Badge'
      },
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }],
    achievements: [{
      achievementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Achievement'
      },
      progress: {
        type: Number,
        default: 0
      },
      completed: {
        type: Boolean,
        default: false
      },
      completedAt: Date
    }],
    streak: {
      current: {
        type: Number,
        default: 0
      },
      longest: {
        type: Number,
        default: 0
      },
      lastActivity: Date
    }
  },
  statistics: {
    activitiesCompleted: {
      type: Number,
      default: 0
    },
    challengesCompleted: {
      type: Number,
      default: 0
    },
    totalTimeSpent: {
      type: Number,
      default: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: Date
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Calculate level based on experience
userSchema.methods.calculateLevel = function() {
  // Simple formula: Level = floor(sqrt(experience / 100))
  this.gamification.level = Math.floor(Math.sqrt(this.gamification.experience / 100)) + 1;
};

// Add points and experience
userSchema.methods.addPoints = function(points) {
  this.gamification.totalPoints += points;
  this.gamification.experience += points;
  this.calculateLevel();
};

module.exports = mongoose.model('User', userSchema);
