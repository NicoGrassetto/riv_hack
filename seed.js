const mongoose = require('mongoose');
require('dotenv').config();
const Badge = require('./server/models/Badge');
const Achievement = require('./server/models/Achievement');
const Challenge = require('./server/models/Challenge');

// ============================================
// SPRINT PROGRESS GAME - BADGES
// Based on team sprint performance metrics
// ============================================
const badges = [
  // ============================================
  // TEAM COLOR BADGES
  // ============================================
  {
    name: 'Blue Team Champion',
    description: 'Member of the Blue Team with outstanding performance',
    icon: '💙',
    color: '#3B82F6',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Assigned to Blue Team'
  },
  {
    name: 'Green Machine',
    description: 'Member of the Green Team driving feature completion',
    icon: '💚',
    color: '#10B981',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Assigned to Green Team'
  },
  {
    name: 'Orange Crusader',
    description: 'Member of the Orange Team pushing stories forward',
    icon: '🧡',
    color: '#F97316',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Assigned to Orange Team'
  },
  {
    name: 'Golden Achiever',
    description: 'Member of a team with 100% feature completion',
    icon: '🏆',
    color: '#F59E0B',
    rarity: 'legendary',
    category: 'achievement',
    points: 10,
    awardCondition: 'Team achieves 100% feature completion'
  },

  // ============================================
  // 🎮 AHA JUGAMOS - IMPROVEMENT BADGES
  // ============================================
  {
    name: 'Goal Getter',
    description: 'Self-defined improvement goal met - team sets a micro-goal and pipeline checks it',
    icon: '🎯',
    color: '#10B981',
    rarity: 'rare',
    category: 'improvement',
    points: 5,
    awardCondition: 'Team sets a micro-goal and achieves it (verified by pipeline)'
  },
  {
    name: 'Flow Optimizer',
    description: 'Experiment or flip that improves flow by removing a dependency or reducing lead time',
    icon: '⚡',
    color: '#6366F1',
    rarity: 'epic',
    category: 'improvement',
    points: 5,
    awardCondition: 'Implement an experiment/flip that removes dependency or reduces lead time'
  },
  {
    name: 'Retro Rockstar',
    description: 'Best retrospective with 20+ point improvements identified and actioned',
    icon: '🌟',
    color: '#EC4899',
    rarity: 'legendary',
    category: 'improvement',
    points: 10,
    awardCondition: 'Retrospective generates 20+ improvement points'
  },
  {
    name: 'Critical Contributor',
    description: 'Critical initiative & Collaboration topic in Top 3 for the team',
    icon: '🔝',
    color: '#F59E0B',
    rarity: 'epic',
    category: 'collaboration',
    points: 5,
    awardCondition: 'Team collaboration topic ranks in Top 3'
  },
  {
    name: 'Score Surge',
    description: 'Gross team score improvement - 10 point improvement in the assessed item',
    icon: '📈',
    color: '#22C55E',
    rarity: 'rare',
    category: 'improvement',
    points: 5,
    awardCondition: 'Team achieves 10 point improvement in assessed item'
  },
  {
    name: 'Fast Factor',
    description: 'Quick wins achieved - one per turn per sprint flip',
    icon: '🤗',
    color: '#14B8A6',
    rarity: 'common',
    category: 'improvement',
    points: 2,
    awardCondition: 'Achieve a fast factor (one per turn per sprint flip)'
  },
  {
    name: 'Collective Champion',
    description: 'Collective goal achieved - API task, challenge, or sub-goals completed together',
    icon: '🤝',
    color: '#8B5CF6',
    rarity: 'epic',
    category: 'collaboration',
    points: 5,
    awardCondition: 'Complete collective goal (API task, challenge, sub-goals) - bonus to all contributing teams'
  },

  // ============================================
  // 🎮 AHA JUGAMOS - PREDICTABILITY BADGES
  // ============================================
  {
    name: 'Predictability Pro',
    description: 'Predictability in top 20% of all teams',
    icon: '🔮',
    color: '#A855F7',
    rarity: 'legendary',
    category: 'predictability',
    points: 10,
    awardCondition: 'Team predictability ranks in top 20%'
  },
  {
    name: 'On-Time Titans',
    description: 'Maximum items delivered by due date with highest publish count and touch',
    icon: '⏰',
    color: '#EF4444',
    rarity: 'legendary',
    category: 'delivery',
    points: 10,
    awardCondition: 'Max items delivered by due date (publish count + touch)'
  },
  {
    name: 'Sprint Flipper',
    description: 'Delivered planned sprint flip(s) on time',
    icon: '🔄',
    color: '#0EA5E9',
    rarity: 'rare',
    category: 'delivery',
    points: 5,
    awardCondition: 'Deliver planned sprint flip(s) on schedule'
  },
  {
    name: 'Next Sprint Ready',
    description: 'Converted next sprint successfully - supports stable state for predictive planning',
    icon: '➡️',
    color: '#06B6D4',
    rarity: 'common',
    category: 'predictability',
    points: 2,
    awardCondition: 'Successfully convert and prepare next sprint'
  },
  {
    name: 'Risk Ranger',
    description: 'Act risk window maintained within 1-4 days scope',
    icon: '🛡️',
    color: '#F97316',
    rarity: 'rare',
    category: 'predictability',
    points: 3,
    awardCondition: 'Maintain risk window within 1-4 days scope'
  },

  // ============================================
  // 🎮 AHA JUGAMOS - FLOW & MASTERY BADGES
  // ============================================
  {
    name: 'Momentum Masters',
    description: 'Highest average A/B in-tact across teams - mastering the flow',
    icon: '🏃',
    color: '#8B5CF6',
    rarity: 'legendary',
    category: 'flow',
    points: 15,
    awardCondition: 'Achieve highest average A/B in-tact across all teams'
  },
  {
    name: 'Plan-Sprint Pros',
    description: 'Highest percentage of items delivered on planned sprint',
    icon: '📋',
    color: '#10B981',
    rarity: 'legendary',
    category: 'delivery',
    points: 10,
    awardCondition: 'Highest % of items delivered on planned sprint'
  },

  // ============================================
  // SPRINT PERFORMANCE BADGES
  // ============================================
  {
    name: 'Sprint Starter',
    description: 'Contributed to Sprint 1 progress',
    icon: '🚀',
    color: '#6366F1',
    rarity: 'common',
    category: 'milestone',
    points: 2,
    awardCondition: 'Contribute to Sprint 1'
  },
  {
    name: 'Sprint Warrior',
    description: 'Maintained progress across 3 consecutive sprints',
    icon: '⚔️',
    color: '#8B5CF6',
    rarity: 'rare',
    category: 'milestone',
    points: 5,
    awardCondition: 'Maintain progress across 3 consecutive sprints'
  },
  {
    name: 'Sprint Master',
    description: 'Achieved 80%+ completion in a single sprint',
    icon: '👑',
    color: '#A855F7',
    rarity: 'epic',
    category: 'milestone',
    points: 8,
    awardCondition: 'Achieve 80%+ completion in a single sprint'
  },
  {
    name: 'Velocity Champion',
    description: 'Improved team velocity by 20% sprint over sprint',
    icon: '📈',
    color: '#EC4899',
    rarity: 'epic',
    category: 'special',
    points: 10,
    awardCondition: 'Improve team velocity by 20% sprint over sprint'
  },

  // ============================================
  // FEATURE COMPLETION BADGES
  // ============================================
  {
    name: 'Feature Finisher',
    description: 'Completed your first feature at 100%',
    icon: '✅',
    color: '#22C55E',
    rarity: 'common',
    category: 'achievement',
    points: 3,
    awardCondition: 'Complete first feature at 100%'
  },
  {
    name: 'Story Teller',
    description: 'Completed 5 user stories',
    icon: '📖',
    color: '#14B8A6',
    rarity: 'rare',
    category: 'achievement',
    points: 5,
    awardCondition: 'Complete 5 user stories'
  },
  {
    name: 'Feature Factory',
    description: 'Completed 10 features',
    icon: '🏭',
    color: '#0EA5E9',
    rarity: 'epic',
    category: 'achievement',
    points: 8,
    awardCondition: 'Complete 10 features'
  },
  {
    name: 'Delivery Legend',
    description: 'Achieved 100% completion on 20+ features',
    icon: '🌟',
    color: '#EAB308',
    rarity: 'legendary',
    category: 'special',
    points: 15,
    awardCondition: 'Achieve 100% completion on 20+ features'
  },

  // ============================================
  // PRIORITY BADGES
  // ============================================
  {
    name: 'Priority Hero',
    description: 'Completed a Priority 1 feature',
    icon: '🎯',
    color: '#EF4444',
    rarity: 'rare',
    category: 'achievement',
    points: 5,
    awardCondition: 'Complete a Priority 1 feature'
  },
  {
    name: 'High Performer',
    description: 'Completed 5 high-priority items (Priority 1-2)',
    icon: '🔥',
    color: '#F97316',
    rarity: 'epic',
    category: 'achievement',
    points: 8,
    awardCondition: 'Complete 5 high-priority items (Priority 1-2)'
  },

  // ============================================
  // COLLABORATION BADGES
  // ============================================
  {
    name: 'Team Player',
    description: 'Contributed to features across multiple personas',
    icon: '🤝',
    color: '#06B6D4',
    rarity: 'rare',
    category: 'collaboration',
    points: 5,
    awardCondition: 'Contribute to features across multiple personas'
  },
  {
    name: 'Cross-Functional Star',
    description: 'Worked on both Stories and Features',
    icon: '⭐',
    color: '#8B5CF6',
    rarity: 'rare',
    category: 'special',
    points: 5,
    awardCondition: 'Work on both Stories and Features'
  }
];

// ============================================
// SPRINT PROGRESS GAME - ACHIEVEMENTS
// ============================================
const achievements = [
  // Getting Started
  {
    name: 'Sprint Kickoff',
    description: 'Join your first sprint and start tracking progress',
    icon: '🎬',
    category: 'beginner',
    criteria: {
      type: 'custom',
      target: 1,
      description: 'Join a sprint team'
    },
    rewards: {
      points: 50
    },
    rarity: 'common'
  },
  {
    name: 'First Progress',
    description: 'Record your first progress update on any feature',
    icon: '📊',
    category: 'beginner',
    criteria: {
      type: 'custom',
      target: 1,
      description: 'Update progress on a feature'
    },
    rewards: {
      points: 75
    },
    rarity: 'common'
  },
  
  // Feature Completion Achievements
  {
    name: 'First Delivery',
    description: 'Complete your first feature at 100%',
    icon: '🎉',
    category: 'beginner',
    criteria: {
      type: 'features_completed',
      target: 1,
      description: 'Complete 1 feature'
    },
    rewards: {
      points: 100
    },
    rarity: 'common'
  },
  {
    name: 'Feature Streak',
    description: 'Complete 5 features',
    icon: '🔥',
    category: 'intermediate',
    criteria: {
      type: 'features_completed',
      target: 5,
      description: 'Complete 5 features'
    },
    rewards: {
      points: 250
    },
    rarity: 'rare'
  },
  {
    name: 'Delivery Machine',
    description: 'Complete 10 features',
    icon: '🏆',
    category: 'intermediate',
    criteria: {
      type: 'features_completed',
      target: 10,
      description: 'Complete 10 features'
    },
    rewards: {
      points: 500
    },
    rarity: 'epic'
  },
  {
    name: 'Feature Master',
    description: 'Complete 25 features',
    icon: '👑',
    category: 'advanced',
    criteria: {
      type: 'features_completed',
      target: 25,
      description: 'Complete 25 features'
    },
    rewards: {
      points: 1000
    },
    rarity: 'legendary'
  },
  
  // Sprint Progress Achievements
  {
    name: 'Sprint Finisher',
    description: 'Complete all assigned items in a sprint',
    icon: '🏁',
    category: 'intermediate',
    criteria: {
      type: 'sprint_completion',
      target: 100,
      description: 'Achieve 100% sprint completion'
    },
    rewards: {
      points: 300
    },
    rarity: 'rare'
  },
  {
    name: 'Velocity Star',
    description: 'Improve your completion rate by 25% in a single sprint',
    icon: '📈',
    category: 'intermediate',
    criteria: {
      type: 'velocity_improvement',
      target: 25,
      description: 'Improve velocity by 25%'
    },
    rewards: {
      points: 400
    },
    rarity: 'epic'
  },
  {
    name: 'Consistency King',
    description: 'Maintain 80%+ completion rate for 3 consecutive sprints',
    icon: '👔',
    category: 'advanced',
    criteria: {
      type: 'consistent_performance',
      target: 3,
      description: 'Maintain high performance for 3 sprints'
    },
    rewards: {
      points: 750
    },
    rarity: 'epic'
  },
  
  // Team Achievements
  {
    name: 'Team Leader',
    description: 'Lead your team to #1 on the leaderboard',
    icon: '🥇',
    category: 'advanced',
    criteria: {
      type: 'leaderboard_position',
      target: 1,
      description: 'Reach #1 on team leaderboard'
    },
    rewards: {
      points: 500
    },
    rarity: 'epic'
  },
  {
    name: 'Team Spirit',
    description: 'Contribute to team average completion above 75%',
    icon: '💪',
    category: 'intermediate',
    criteria: {
      type: 'team_average',
      target: 75,
      description: 'Help achieve 75% team average'
    },
    rewards: {
      points: 200
    },
    rarity: 'rare'
  },
  
  // Priority Achievements
  {
    name: 'Priority Crusher',
    description: 'Complete a Priority 1 item',
    icon: '🎯',
    category: 'intermediate',
    criteria: {
      type: 'priority_completion',
      target: 1,
      description: 'Complete a P1 item'
    },
    rewards: {
      points: 300
    },
    rarity: 'rare'
  },
  {
    name: 'High Impact Player',
    description: 'Complete 10 high-priority items (P1-P5)',
    icon: '💎',
    category: 'advanced',
    criteria: {
      type: 'high_priority_completion',
      target: 10,
      description: 'Complete 10 high-priority items'
    },
    rewards: {
      points: 600
    },
    rarity: 'epic'
  },
  
  // Special Achievements
  {
    name: 'Perfect PI',
    description: 'Achieve 100% completion across all sprints in a PI',
    icon: '🌟',
    category: 'master',
    criteria: {
      type: 'pi_completion',
      target: 100,
      description: 'Complete all items in a Program Increment'
    },
    rewards: {
      points: 2000
    },
    rarity: 'legendary'
  },
  {
    name: 'SAFe Champion',
    description: 'Demonstrate excellence across all SAFe Agile metrics',
    icon: '🏅',
    category: 'master',
    criteria: {
      type: 'safe_excellence',
      target: 1,
      description: 'Excel in SAFe Agile practices'
    },
    rewards: {
      points: 1500
    },
    rarity: 'legendary'
  }
];

// ============================================
// SPRINT PROGRESS GAME - CHALLENGES
// Based on real sprint timeline from the data
// ============================================
const challenges = [
  // Daily Challenges
  {
    title: 'Daily Standup Hero',
    description: 'Update progress on at least 2 features today',
    type: 'daily',
    difficulty: 'easy',
    requirements: 'Log progress updates on 2 or more features within 24 hours',
    rewards: {
      points: 50,
      experience: 25
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'Progress Push',
    description: 'Move any feature forward by 10% today',
    type: 'daily',
    difficulty: 'easy',
    requirements: 'Increase completion percentage by at least 10 points on any feature',
    rewards: {
      points: 75,
      experience: 40
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
    isActive: true
  },
  
  // Weekly Sprint Challenges
  {
    title: 'Sprint 5 Warrior',
    description: 'Complete 3 features during Sprint 5 (ends Dec 9)',
    type: 'weekly',
    difficulty: 'medium',
    requirements: 'Achieve 100% completion on 3 features before Sprint 5 ends',
    rewards: {
      points: 300,
      experience: 150
    },
    startDate: new Date('2024-11-25'),
    endDate: new Date('2024-12-09'),
    isActive: true
  },
  {
    title: 'Team Velocity Boost',
    description: 'Help your team improve average completion by 15% this sprint',
    type: 'weekly',
    difficulty: 'medium',
    requirements: 'Contribute to team velocity improvement of 15% or more',
    rewards: {
      points: 400,
      experience: 200
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'Story Sprint',
    description: 'Complete 5 user stories this sprint',
    type: 'weekly',
    difficulty: 'medium',
    requirements: 'Achieve 100% completion on 5 user stories',
    rewards: {
      points: 350,
      experience: 175
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  
  // IP Sprint Challenges (Innovation & Planning)
  {
    title: 'IP Sprint Focus',
    description: 'Make progress on IP-scheduled items before Dec 24',
    type: 'special',
    difficulty: 'hard',
    requirements: 'Update progress on items scheduled for IP sprint',
    rewards: {
      points: 500,
      experience: 250
    },
    startDate: new Date('2024-12-09'),
    endDate: new Date('2024-12-24'),
    isActive: true
  },
  
  // Monthly/PI Challenges
  {
    title: 'PI Completion Champion',
    description: 'Achieve 90% average completion across all your features by end of PI',
    type: 'monthly',
    difficulty: 'hard',
    requirements: 'Maintain 90% or higher average completion on all assigned features',
    rewards: {
      points: 1000,
      experience: 500
    },
    startDate: new Date('2024-10-14'),
    endDate: new Date('2024-12-24'),
    isActive: true
  },
  {
    title: 'December Delivery Drive',
    description: 'Complete 10 features before December 24',
    type: 'monthly',
    difficulty: 'hard',
    requirements: 'Achieve 100% completion on 10 features during December',
    rewards: {
      points: 750,
      experience: 400
    },
    startDate: new Date('2024-12-01'),
    endDate: new Date('2024-12-24'),
    maxParticipants: 100,
    isActive: true
  },
  
  // Team Competition Challenges
  {
    title: 'Team Leaderboard Battle',
    description: 'Help your team reach the Top 3 on the leaderboard',
    type: 'special',
    difficulty: 'hard',
    requirements: 'Your team must be in positions 1-3 on the leaderboard at challenge end',
    rewards: {
      points: 600,
      experience: 300
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    title: 'Green Team Showdown',
    description: 'Challenge: Can Green Team maintain their high completion rate?',
    type: 'special',
    difficulty: 'expert',
    requirements: 'Green Team members must maintain 80%+ average completion',
    rewards: {
      points: 800,
      experience: 400
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    maxParticipants: 50,
    isActive: true
  },
  
  // Priority Challenges
  {
    title: 'Priority 1 Blitz',
    description: 'Complete all Priority 1 items by end of sprint',
    type: 'special',
    difficulty: 'expert',
    requirements: 'All P1 items assigned to you must reach 100% completion',
    rewards: {
      points: 1000,
      experience: 500
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    maxParticipants: 25,
    isActive: true
  },
  {
    title: 'High Priority Hero',
    description: 'Complete 5 items with priority ≤ 10',
    type: 'weekly',
    difficulty: 'hard',
    requirements: 'Achieve 100% on 5 items with priority 10 or higher',
    rewards: {
      points: 550,
      experience: 275
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  
  // Burndown Chart Challenges
  {
    title: 'Burndown Master',
    description: 'Follow the ideal burndown line for this sprint',
    type: 'weekly',
    difficulty: 'medium',
    requirements: 'Your feature completion must track within 10% of ideal burndown',
    rewards: {
      points: 450,
      experience: 225
    },
    startDate: new Date(),
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  
  // Scope Management Challenges
  {
    title: 'Scope Defender',
    description: 'Complete all items in your Initial scope',
    type: 'monthly',
    difficulty: 'expert',
    requirements: 'All items marked as "Initial" scope must reach 100%',
    rewards: {
      points: 1200,
      experience: 600
    },
    startDate: new Date('2024-10-14'),
    endDate: new Date('2024-12-24'),
    maxParticipants: 100,
    isActive: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Badge.deleteMany({});
    await Achievement.deleteMany({});
    await Challenge.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert badges
    const insertedBadges = await Badge.insertMany(badges);
    console.log(`✅ Inserted ${insertedBadges.length} badges`);

    // Link some badges to achievements
    const featureFinisherBadge = insertedBadges.find(b => b.name === 'Feature Finisher');
    const sprintMasterBadge = insertedBadges.find(b => b.name === 'Sprint Master');
    const velocityChampionBadge = insertedBadges.find(b => b.name === 'Velocity Champion');
    const deliveryLegendBadge = insertedBadges.find(b => b.name === 'Delivery Legend');

    // Update achievements with badge rewards
    if (featureFinisherBadge) {
      achievements[2].rewards.badgeId = featureFinisherBadge._id; // First Delivery
    }
    if (sprintMasterBadge) {
      achievements[6].rewards.badgeId = sprintMasterBadge._id; // Sprint Finisher
    }
    if (velocityChampionBadge) {
      achievements[7].rewards.badgeId = velocityChampionBadge._id; // Velocity Star
    }
    if (deliveryLegendBadge) {
      achievements[5].rewards.badgeId = deliveryLegendBadge._id; // Feature Master
    }

    // Insert achievements
    const insertedAchievements = await Achievement.insertMany(achievements);
    console.log(`✅ Inserted ${insertedAchievements.length} achievements`);

    // Insert challenges
    const insertedChallenges = await Challenge.insertMany(challenges);
    console.log(`✅ Inserted ${insertedChallenges.length} challenges`);

    console.log('\n🎮 SPRINT PROGRESS GAME - Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - ${insertedBadges.length} sprint-themed badges`);
    console.log(`   - ${insertedAchievements.length} performance achievements`);
    console.log(`   - ${insertedChallenges.length} sprint challenges`);
    console.log('\n🏃 Game Features:');
    console.log('   - Team-based competition (Blue, Green, Orange, etc.)');
    console.log('   - Sprint progress tracking (S1-S5 + IP)');
    console.log('   - Feature completion rewards');
    console.log('   - Priority-based achievements');
    console.log('   - Burndown chart challenges');
    console.log('   - PI (Program Increment) goals');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
