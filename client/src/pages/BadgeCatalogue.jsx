import { useQuery } from '@tanstack/react-query'
import { badgesAPI } from '../api/api'
import { FaMedal, FaStar, FaGamepad, FaRocket, FaUsers, FaChartLine, FaTrophy, FaShieldAlt, FaLightbulb } from 'react-icons/fa'
import './BadgeCatalogue.css'

function BadgeCatalogue() {
  const { data, isLoading } = useQuery({
    queryKey: ['all-badges'],
    queryFn: () => badgesAPI.getAll(),
  })

  const { data: myBadgesData } = useQuery({
    queryKey: ['my-badges'],
    queryFn: () => badgesAPI.getMyBadges(),
  })

  const badges = data?.data?.badges || []
  const myBadges = myBadgesData?.data?.badges || []
  const earnedBadgeIds = myBadges.map(b => b.badge?._id || b.badgeId)

  if (isLoading) {
    return <div className="loading">Loading badge catalogue...</div>
  }

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
      title: 'Team Badges',
      description: 'Badges representing team membership and identity',
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
