import { useQuery } from '@tanstack/react-query'
import { authAPI, usersAPI, achievementsAPI, challengesAPI } from '../api/api'
import { FaStar, FaTrophy, FaFire, FaMedal, FaChartLine } from 'react-icons/fa'
import './Dashboard.css'

function Dashboard() {
  const { data: profileData } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile(),
  })

  const { data: achievementsData } = useQuery({
    queryKey: ['achievements-progress'],
    queryFn: () => achievementsAPI.getMyProgress(),
  })

  const { data: challengesData } = useQuery({
    queryKey: ['my-challenges'],
    queryFn: () => challengesAPI.getMyChallenges(),
  })

  const user = profileData?.data?.user
  const gamification = user?.gamification
  const achievements = achievementsData?.data?.progress || []
  const challenges = challengesData?.data?.challenges || []

  const completedAchievements = achievements.filter(a => a.completed).length
  const activeChallenges = challenges.filter(c => !c.completed).length

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.profile?.displayName || user?.username}! 👋</h1>
            <p>Keep up the great work and continue your journey to the top!</p>
          </div>
          <div className="level-badge-large">
            <div className="level-number">{gamification?.level || 1}</div>
            <div className="level-label">Level</div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <FaStar />
            </div>
            <div className="stat-content">
              <div className="stat-value">{gamification?.totalPoints?.toLocaleString() || 0}</div>
              <div className="stat-label">Total Points</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
              <FaTrophy />
            </div>
            <div className="stat-content">
              <div className="stat-value">{completedAchievements}</div>
              <div className="stat-label">Achievements</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <FaFire />
            </div>
            <div className="stat-content">
              <div className="stat-value">{gamification?.streak?.current || 0}</div>
              <div className="stat-label">Day Streak</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <FaMedal />
            </div>
            <div className="stat-content">
              <div className="stat-value">{gamification?.badges?.length || 0}</div>
              <div className="stat-label">Badges Earned</div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="dashboard-section">
          <h2><FaChartLine /> Your Progress</h2>
          <div className="card">
            <div className="progress-item">
              <div className="progress-header">
                <span className="progress-label">Experience Progress</span>
                <span className="progress-value">
                  {gamification?.experience || 0} XP
                </span>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${((gamification?.experience || 0) % 100)}%`,
                  }}
                />
              </div>
              <div className="progress-footer">
                <span>Level {gamification?.level || 1}</span>
                <span>Next: Level {(gamification?.level || 1) + 1}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="dashboard-section">
          <h2><FaTrophy /> Recent Achievements</h2>
          <div className="grid grid-2">
            {achievements
              .filter(a => a.completed)
              .slice(0, 4)
              .map((item, index) => (
                <div key={index} className="card achievement-card">
                  <div className="achievement-icon">{item.achievement.icon}</div>
                  <div className="achievement-content">
                    <h3>{item.achievement.name}</h3>
                    <p>{item.achievement.description}</p>
                    <span className={`badge badge-${item.achievement.rarity}`}>
                      {item.achievement.rarity}
                    </span>
                  </div>
                </div>
              ))}
            {achievements.filter(a => a.completed).length === 0 && (
              <p className="empty-state">No achievements yet. Start completing tasks to earn achievements!</p>
            )}
          </div>
        </div>

        {/* Active Challenges */}
        <div className="dashboard-section">
          <h2><FaFire /> Active Challenges ({activeChallenges})</h2>
          <div className="grid grid-3">
            {challenges
              .filter(c => !c.completed)
              .slice(0, 3)
              .map((item, index) => (
                <div key={index} className="card challenge-card">
                  <div className="challenge-header">
                    <span className={`badge badge-${item.challenge.difficulty}`}>
                      {item.challenge.type}
                    </span>
                    <span className="challenge-points">
                      +{item.challenge.rewards.points} pts
                    </span>
                  </div>
                  <h3>{item.challenge.title}</h3>
                  <p>{item.challenge.description}</p>
                  <div className="progress-bar">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="progress-text">{item.progress}% Complete</span>
                </div>
              ))}
            {activeChallenges === 0 && (
              <p className="empty-state">No active challenges. Check out the Challenges page to join!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
