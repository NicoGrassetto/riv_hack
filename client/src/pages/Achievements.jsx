import { useQuery } from '@tanstack/react-query'
import { achievementsAPI } from '../api/api'
import { FaTrophy, FaLock, FaCheck } from 'react-icons/fa'
import './Achievements.css'

function Achievements() {
  const { data, isLoading } = useQuery({
    queryKey: ['achievements-progress'],
    queryFn: () => achievementsAPI.getMyProgress(),
  })

  const achievements = data?.data?.progress || []

  if (isLoading) {
    return <div className="loading">Loading achievements...</div>
  }

  const categories = ['beginner', 'intermediate', 'advanced', 'master', 'special']

  return (
    <div className="achievements-page">
      <div className="container">
        <div className="page-header">
          <h1><FaTrophy /> Achievements</h1>
          <p>Unlock achievements by completing various tasks and challenges</p>
        </div>

        <div className="achievements-stats">
          <div className="stat">
            <span className="stat-number">
              {achievements.filter(a => a.completed).length}
            </span>
            <span className="stat-label">Unlocked</span>
          </div>
          <div className="stat">
            <span className="stat-number">{achievements.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-number">
              {Math.round((achievements.filter(a => a.completed).length / achievements.length) * 100) || 0}%
            </span>
            <span className="stat-label">Progress</span>
          </div>
        </div>

        {categories.map(category => {
          const categoryAchievements = achievements.filter(
            a => a.achievement.category === category
          )

          if (categoryAchievements.length === 0) return null

          return (
            <div key={category} className="achievement-category">
              <h2 className="category-title">
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </h2>
              <div className="grid grid-3">
                {categoryAchievements.map((item, index) => (
                  <div
                    key={index}
                    className={`card achievement-item ${item.completed ? 'completed' : 'locked'}`}
                  >
                    <div className="achievement-badge">
                      <div className="achievement-icon-large">
                        {item.completed ? item.achievement.icon : '🔒'}
                      </div>
                      {item.completed && (
                        <div className="completed-badge">
                          <FaCheck />
                        </div>
                      )}
                    </div>

                    <h3>{item.completed ? item.achievement.name : '???'}</h3>
                    <p>
                      {item.completed
                        ? item.achievement.description
                        : 'Complete requirements to unlock'}
                    </p>

                    <div className="achievement-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                      <span className="progress-label">
                        {item.currentValue} / {item.targetValue}
                      </span>
                    </div>

                    <div className="achievement-footer">
                      <span className={`badge badge-${item.achievement.rarity}`}>
                        {item.achievement.rarity}
                      </span>
                      {item.achievement.rewards.points > 0 && (
                        <span className="points-reward">
                          +{item.achievement.rewards.points} pts
                        </span>
                      )}
                    </div>

                    {item.completed && item.completedAt && (
                      <div className="completed-date">
                        Unlocked on {new Date(item.completedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Achievements
