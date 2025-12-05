import { useState } from 'react'
import { FaMedal, FaStar, FaGamepad, FaRocket, FaUsers, FaChartLine, FaTrophy, FaShieldAlt, FaLightbulb, FaSeedling } from 'react-icons/fa'
import './BadgeCatalogue.css'

// Hardcoded badges data (works without database)
const allBadges = [
  // IMPROVEMENT BADGES
  {
    _id: '1',
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
    _id: '2',
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
    _id: '3',
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
    _id: '4',
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
    _id: '5',
    name: 'Fast Factor',
    description: 'Quick wins achieved - one per turn per sprint flip',
    icon: '🤗',
    color: '#14B8A6',
    rarity: 'common',
    category: 'improvement',
    points: 2,
    awardCondition: 'Achieve a fast factor (one per turn per sprint flip)'
  },
  // COLLABORATION BADGES
  {
    _id: '6',
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
    _id: '7',
    name: 'Collective Champion',
    description: 'Collective goal achieved - API task, challenge, or sub-goals completed together',
    icon: '🤝',
    color: '#8B5CF6',
    rarity: 'epic',
    category: 'collaboration',
    points: 5,
    awardCondition: 'Complete collective goal (API task, challenge, sub-goals) - bonus to all contributing teams'
  },
  {
    _id: '8',
    name: 'Team Player',
    description: 'Contributed to features across multiple personas',
    icon: '🤝',
    color: '#06B6D4',
    rarity: 'rare',
    category: 'collaboration',
    points: 5,
    awardCondition: 'Contribute to features across multiple personas'
  },
  // PREDICTABILITY BADGES
  {
    _id: '9',
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
    _id: '10',
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
    _id: '11',
    name: 'Risk Ranger',
    description: 'Act risk window maintained within 1-4 days scope',
    icon: '🛡️',
    color: '#F97316',
    rarity: 'rare',
    category: 'predictability',
    points: 3,
    awardCondition: 'Maintain risk window within 1-4 days scope'
  },
  // DELIVERY BADGES
  {
    _id: '12',
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
    _id: '13',
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
    _id: '14',
    name: 'Plan-Sprint Pros',
    description: 'Highest percentage of items delivered on planned sprint',
    icon: '📋',
    color: '#10B981',
    rarity: 'legendary',
    category: 'delivery',
    points: 10,
    awardCondition: 'Highest % of items delivered on planned sprint'
  },
  // FLOW BADGES
  {
    _id: '15',
    name: 'Momentum Masters',
    description: 'Highest average A/B in-tact across teams - mastering the flow',
    icon: '🏃',
    color: '#8B5CF6',
    rarity: 'legendary',
    category: 'flow',
    points: 15,
    awardCondition: 'Achieve highest average A/B in-tact across all teams'
  },
  // TEAM BADGES - Celebrating team identity and belonging
  {
    _id: '16',
    name: 'Team Blue',
    description: 'Proud member of the Blue Team - bringing unique perspectives to our journey',
    icon: '💙',
    color: '#3B82F6',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Member of Blue Team'
  },
  {
    _id: '17',
    name: 'Team Green',
    description: 'Proud member of the Green Team - contributing to our shared success',
    icon: '💚',
    color: '#10B981',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Member of Green Team'
  },
  {
    _id: '39',
    name: 'Team Orange',
    description: 'Proud member of the Orange Team - adding creativity and energy to every sprint',
    icon: '🧡',
    color: '#F97316',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Member of Orange Team'
  },
  {
    _id: '40',
    name: 'Team Lavender',
    description: 'Proud member of the Lavender Team - crafting beautiful experiences together',
    icon: '💜',
    color: '#A855F7',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Member of Lavender Team'
  },
  {
    _id: '41',
    name: 'Team Yellow',
    description: 'Proud member of the Yellow Team - bringing data insights to light',
    icon: '💛',
    color: '#EAB308',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Member of Yellow Team'
  },
  {
    _id: '42',
    name: 'Team Turquoise',
    description: 'Proud member of the Turquoise Team - building cloud foundations together',
    icon: '🩵',
    color: '#14B8A6',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Member of Turquoise Team'
  },
  {
    _id: '43',
    name: 'Team Amber',
    description: 'Proud member of the Amber Team - keeping our systems secure and strong',
    icon: '🔶',
    color: '#D97706',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Member of Amber Team'
  },
  {
    _id: '44',
    name: 'Team Azure',
    description: 'Proud member of the Azure Team - connecting services with care',
    icon: '💠',
    color: '#0EA5E9',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Member of Azure Team'
  },
  {
    _id: '45',
    name: 'Team Emerald',
    description: 'Proud member of the Emerald Team - pioneering innovation with ML',
    icon: '💎',
    color: '#059669',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Member of Emerald Team'
  },
  {
    _id: '46',
    name: 'Team Silver',
    description: 'Proud member of the Silver Team - bridging legacy and future',
    icon: '🪙',
    color: '#94A3B8',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Member of Silver Team'
  },
  {
    _id: '47',
    name: 'Team Gold',
    description: 'Proud member of the Gold Team - delivering premium value',
    icon: '🥇',
    color: '#F59E0B',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Member of Gold Team'
  },
  {
    _id: '48',
    name: 'Team Maroon',
    description: 'Proud member of the Maroon Team - empowering administration',
    icon: '🟤',
    color: '#991B1B',
    rarity: 'common',
    category: 'team',
    points: 0,
    awardCondition: 'Member of Maroon Team'
  },
  {
    _id: '18',
    name: 'Golden Achiever',
    description: 'Member of a team with 100% feature completion',
    icon: '🏆',
    color: '#F59E0B',
    rarity: 'legendary',
    category: 'achievement',
    points: 10,
    awardCondition: 'Team achieves 100% feature completion'
  },
  // MILESTONE BADGES
  {
    _id: '19',
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
    _id: '20',
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
    _id: '21',
    name: 'Sprint Master',
    description: 'Achieved 80%+ completion in a single sprint',
    icon: '👑',
    color: '#A855F7',
    rarity: 'epic',
    category: 'milestone',
    points: 8,
    awardCondition: 'Achieve 80%+ completion in a single sprint'
  },
  // ACHIEVEMENT BADGES
  {
    _id: '22',
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
    _id: '23',
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
    _id: '24',
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
    _id: '25',
    name: 'Priority Hero',
    description: 'Completed a Priority 1 feature',
    icon: '🎯',
    color: '#EF4444',
    rarity: 'rare',
    category: 'achievement',
    points: 5,
    awardCondition: 'Complete a Priority 1 feature'
  },
  // SPECIAL BADGES
  {
    _id: '26',
    name: 'Velocity Champion',
    description: 'Improved team velocity by 20% sprint over sprint',
    icon: '📈',
    color: '#EC4899',
    rarity: 'epic',
    category: 'special',
    points: 10,
    awardCondition: 'Improve team velocity by 20% sprint over sprint'
  },
  {
    _id: '27',
    name: 'Delivery Legend',
    description: 'Achieved 100% completion on 20+ features',
    icon: '🌟',
    color: '#EAB308',
    rarity: 'legendary',
    category: 'special',
    points: 15,
    awardCondition: 'Achieve 100% completion on 20+ features'
  },
  {
    _id: '28',
    name: 'Cross-Functional Star',
    description: 'Worked on both Stories and Features',
    icon: '⭐',
    color: '#8B5CF6',
    rarity: 'rare',
    category: 'special',
    points: 5,
    awardCondition: 'Work on both Stories and Features'
  },
  // ============================================
  // 🌱 GROWTH & INCLUSION BADGES
  // Celebrating effort, progress, and different contribution styles
  // ============================================
  {
    _id: '29',
    name: 'Foundation Builder',
    description: 'Laying the groundwork for future success - every journey starts somewhere',
    icon: '🌱',
    color: '#10B981',
    rarity: 'common',
    category: 'growth',
    points: 3,
    awardCondition: 'Start contributing to team goals'
  },
  {
    _id: '30',
    name: 'Steady Climber',
    description: 'Consistent improvement over time - slow and steady wins the race',
    icon: '🧗',
    color: '#6366F1',
    rarity: 'rare',
    category: 'growth',
    points: 5,
    awardCondition: 'Show improvement across 3 consecutive sprints'
  },
  {
    _id: '31',
    name: 'Resilience Star',
    description: 'Overcame blockers and kept pushing forward despite challenges',
    icon: '💪',
    color: '#F59E0B',
    rarity: 'epic',
    category: 'growth',
    points: 8,
    awardCondition: 'Successfully unblock and complete a previously blocked item'
  },
  {
    _id: '32',
    name: 'Helping Hand',
    description: 'Supported other teams or teammates to achieve their goals',
    icon: '🤲',
    color: '#EC4899',
    rarity: 'rare',
    category: 'growth',
    points: 5,
    awardCondition: 'Contribute to another team\'s success'
  },
  {
    _id: '33',
    name: 'Knowledge Sharer',
    description: 'Documented processes, shared learnings, or mentored others',
    icon: '📚',
    color: '#8B5CF6',
    rarity: 'rare',
    category: 'growth',
    points: 5,
    awardCondition: 'Share knowledge through documentation or mentoring'
  },
  {
    _id: '34',
    name: 'Quality Guardian',
    description: 'Focused on quality over speed - better to do it right',
    icon: '🛡️',
    color: '#0EA5E9',
    rarity: 'rare',
    category: 'growth',
    points: 5,
    awardCondition: 'Pass QA on first submission'
  },
  {
    _id: '35',
    name: 'Problem Solver',
    description: 'Identified and resolved complex technical or process issues',
    icon: '🔧',
    color: '#14B8A6',
    rarity: 'epic',
    category: 'growth',
    points: 8,
    awardCondition: 'Resolve a complex blocker affecting the team'
  },
  {
    _id: '36',
    name: 'Fresh Perspective',
    description: 'Brought new ideas or approaches that improved team processes',
    icon: '💡',
    color: '#F97316',
    rarity: 'rare',
    category: 'growth',
    points: 5,
    awardCondition: 'Suggest an improvement that gets implemented'
  },
  {
    _id: '37',
    name: 'Comeback Kid',
    description: 'Bounced back from a difficult sprint with improved performance',
    icon: '🦅',
    color: '#EF4444',
    rarity: 'epic',
    category: 'growth',
    points: 8,
    awardCondition: 'Improve by 20%+ after a challenging sprint'
  },
  {
    _id: '38',
    name: 'Team Spirit',
    description: 'Consistently supports team morale and collaboration',
    icon: '🎊',
    color: '#A855F7',
    rarity: 'rare',
    category: 'growth',
    points: 5,
    awardCondition: 'Recognized by teammates for positive contribution'
  }
]

function BadgeCatalogue() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  // Use hardcoded badges (works without database)
  const badges = allBadges
  const earnedBadgeIds = [] // No earned badges in demo mode

  // Category configuration with icons and descriptions
  const categoryConfig = {
    improvement: {
      icon: <FaLightbulb />,
      title: '🎮 Aha Jugamos - Improvement',
      description: 'Badges for continuous improvement and goal achievement',
      gradient: 'linear-gradient(135deg, #10B981, #059669)'
    },
    predictability: {
      icon: <FaChartLine />,
      title: '🎮 Aha Jugamos - Predictability',
      description: 'Badges for consistent and predictable delivery',
      gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)'
    },
    delivery: {
      icon: <FaRocket />,
      title: '🎮 Aha Jugamos - Delivery & Predictability',
      description: 'Badges for on-time delivery and sprint execution',
      gradient: 'linear-gradient(135deg, #EF4444, #DC2626)'
    },
    flow: {
      icon: <FaGamepad />,
      title: '🎮 Aha Jugamos - Flow & Mastery',
      description: 'Badges for achieving flow state and team mastery',
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706)'
    },
    collaboration: {
      icon: <FaUsers />,
      title: '🎮 Aha Jugamos - Collaboration',
      description: 'Badges for teamwork and cross-team achievements',
      gradient: 'linear-gradient(135deg, #06B6D4, #0891B2)'
    },
    team: {
      icon: <FaShieldAlt />,
      title: '🤗 Team Identity',
      description: 'Celebrating our diverse teams - every team brings unique value to our community',
      gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)'
    },
    milestone: {
      icon: <FaStar />,
      title: 'Sprint Milestones',
      description: 'Badges for sprint performance achievements',
      gradient: 'linear-gradient(135deg, #6366F1, #4F46E5)'
    },
    achievement: {
      icon: <FaTrophy />,
      title: 'Feature Achievements',
      description: 'Badges for completing features and stories',
      gradient: 'linear-gradient(135deg, #22C55E, #16A34A)'
    },
    special: {
      icon: <FaMedal />,
      title: 'Special Recognition',
      description: 'Special badges for outstanding performance',
      gradient: 'linear-gradient(135deg, #EC4899, #DB2777)'
    },
    growth: {
      icon: <FaSeedling />,
      title: '🌱 Growth & Inclusion',
      description: 'Badges celebrating effort, progress, and different contribution styles',
      gradient: 'linear-gradient(135deg, #10B981, #34D399)'
    }
  }

  // Group badges by category
  const badgesByCategory = badges.reduce((acc, badge) => {
    const category = badge.category || 'achievement'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(badge)
    return acc
  }, {})

  // Sort categories by importance
  const categoryOrder = [
    'improvement',
    'predictability', 
    'delivery',
    'flow',
    'collaboration',
    'growth',
    'team',
    'milestone',
    'achievement',
    'special'
  ]

  const getRarityGlow = (rarity) => {
    switch (rarity) {
      case 'legendary': return '0 0 20px rgba(234, 179, 8, 0.6)'
      case 'epic': return '0 0 15px rgba(168, 85, 247, 0.5)'
      case 'rare': return '0 0 10px rgba(59, 130, 246, 0.4)'
      default: return 'none'
    }
  }

  const totalBadges = badges.length
  const earnedCount = earnedBadgeIds.length

  return (
    <div className="badge-catalogue-page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1><FaMedal /> Badge Catalogue</h1>
            <p>Earn badges by achieving goals, improving flow, and delivering with excellence</p>
          </div>
          <div className="header-stats">
            <div className="stat-badge">
              <span className="stat-number">{earnedCount}</span>
              <span className="stat-label">Earned</span>
            </div>
            <div className="stat-divider">/</div>
            <div className="stat-badge">
              <span className="stat-number">{totalBadges}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>

        {/* Aha Jugamos Banner */}
        <div className="aha-jugamos-banner">
          <div className="banner-icon">🎮</div>
          <div className="banner-content">
            <h2>Aha Jugamos - Gamification System</h2>
            <p>Complete challenges, improve flow, and earn points to level up your team!</p>
          </div>
          <div className="banner-points">
            <span className="points-label">Point System</span>
            <div className="points-list">
              <span>+2 to +15 pts per badge</span>
            </div>
          </div>
        </div>

        {/* Badge Categories */}
        {categoryOrder.map(category => {
          const categoryBadges = badgesByCategory[category]
          if (!categoryBadges || categoryBadges.length === 0) return null

          const config = categoryConfig[category] || {
            icon: <FaMedal />,
            title: category.charAt(0).toUpperCase() + category.slice(1),
            description: 'Category badges',
            gradient: 'linear-gradient(135deg, #6B7280, #4B5563)'
          }

          return (
            <div key={category} className="badge-category">
              <div 
                className="category-header"
                style={{ background: config.gradient }}
              >
                <div className="category-icon">{config.icon}</div>
                <div className="category-info">
                  <h2>{config.title}</h2>
                  <p>{config.description}</p>
                </div>
                <div className="category-count">
                  {categoryBadges.filter(b => earnedBadgeIds.includes(b._id)).length} / {categoryBadges.length}
                </div>
              </div>

              <div className="badges-grid">
                {categoryBadges.map((badge, index) => {
                  const isEarned = earnedBadgeIds.includes(badge._id)
                  
                  return (
                    <div 
                      key={badge._id || index}
                      className={`badge-card ${isEarned ? 'earned' : 'locked'} rarity-${badge.rarity}`}
                      style={{ 
                        '--badge-color': badge.color,
                        boxShadow: isEarned ? getRarityGlow(badge.rarity) : 'none'
                      }}
                    >
                      <div className="badge-icon-container">
                        <div 
                          className="badge-icon"
                          style={{ 
                            background: isEarned 
                              ? `linear-gradient(135deg, ${badge.color}20, ${badge.color}40)` 
                              : 'linear-gradient(135deg, #374151, #1F2937)'
                          }}
                        >
                          <span className="icon-emoji">
                            {isEarned ? badge.icon : '🔒'}
                          </span>
                        </div>
                        {badge.points > 0 && (
                          <div className="badge-points">+{badge.points}</div>
                        )}
                      </div>

                      <div className="badge-info">
                        <h3 className="badge-name">
                          {isEarned ? badge.name : '???'}
                        </h3>
                        <p className="badge-description">
                          {isEarned ? badge.description : 'Complete the requirement to unlock'}
                        </p>
                      </div>

                      <div className="badge-footer">
                        <span className={`rarity-tag rarity-${badge.rarity}`}>
                          {badge.rarity}
                        </span>
                        {badge.awardCondition && isEarned && (
                          <div className="award-condition">
                            <span className="condition-label">Condition:</span>
                            <span className="condition-text">{badge.awardCondition}</span>
                          </div>
                        )}
                      </div>

                      {!isEarned && badge.awardCondition && (
                        <div className="unlock-hint">
                          <span className="hint-icon">💡</span>
                          <span className="hint-text">{badge.awardCondition}</span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}

        {/* Points Legend */}
        <div className="points-legend">
          <h3>🏆 Points Reference</h3>
          <div className="legend-grid">
            <div className="legend-item">
              <span className="legend-badge common">Common</span>
              <span className="legend-points">+2 to +3 pts</span>
            </div>
            <div className="legend-item">
              <span className="legend-badge rare">Rare</span>
              <span className="legend-points">+3 to +5 pts</span>
            </div>
            <div className="legend-item">
              <span className="legend-badge epic">Epic</span>
              <span className="legend-points">+5 to +10 pts</span>
            </div>
            <div className="legend-item">
              <span className="legend-badge legendary">Legendary</span>
              <span className="legend-points">+10 to +15 pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BadgeCatalogue
