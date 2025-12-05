import { useQuery } from '@tanstack/react-query'
import { authAPI, achievementsAPI, challengesAPI } from '../api/api'
import { FaStar, FaTrophy, FaFire, FaMedal, FaChartLine, FaGamepad, FaAward, FaUsers, FaRocket } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import './Dashboard.css'

// Import the sprint data parser to show real data
import axios from 'axios'

function Dashboard() {
  // Try to get authenticated user data
  const { data: profileData, isError: profileError } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile(),
    retry: false
  })

  const { data: achievementsData } = useQuery({
    queryKey: ['achievements-progress'],
    queryFn: () => achievementsAPI.getMyProgress(),
    retry: false,
    enabled: !!profileData?.data?.user
  })

  const { data: challengesData } = useQuery({
    queryKey: ['my-challenges'],
    queryFn: () => challengesAPI.getMyChallenges(),
    retry: false,
    enabled: !!profileData?.data?.user
  })

  // Always fetch sprint data (works without auth)
  const { data: sprintData } = useQuery({
    queryKey: ['sprint-data'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:5000/api/sprint-game/data')
      return response.data
    },
    retry: 1
  })

  const user = profileData?.data?.user
  const gamification = user?.gamification
  const achievements = achievementsData?.data?.progress || []
  const challenges = challengesData?.data?.challenges || []
  const teams = sprintData?.teams || []

  const completedAchievements = achievements.filter(a => a.completed).length
  const activeChallenges = challenges.filter(c => !c.completed).length

  // Calculate stats from sprint data
  const totalFeatures = teams.reduce((sum, t) => sum + (t.features?.length || 0), 0)
  const completedFeatures = teams.reduce((sum, t) => 
    sum + (t.features?.filter(f => f.currentCompletion === 100).length || 0), 0)
  const avgCompletion = teams.length > 0 
    ? Math.round(teams.reduce((sum, t) => sum + (t.avgCompletion || 0), 0) / teams.length)
    : 0

  // Get top performing teams
  const topTeams = [...teams]
    .sort((a, b) => (b.avgCompletion || 0) - (a.avgCompletion || 0))
    .slice(0, 5)

  // Show dashboard with sprint data (works for everyone)
  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            {user ? (
              <>
                <h1>Welcome back, {user?.profile?.displayName || user?.username}! 👋</h1>
                <p>Keep up the great work and continue your journey to the top!</p>
              </>
            ) : (
              <>
                <h1>Sprint Dashboard 🎮</h1>
                <p>Track team progress, earn badges, and make sprints fun!</p>
              </>
            )}
          </div>
          {user && (
            <div className="level-badge-large">
              <div className="level-number">{gamification?.level || 1}</div>
              <div className="level-label">Level</div>
            </div>
          )}
        </div>

        {/* Quick Links for non-authenticated users */}
        {!user && (
          <div className="quick-links" style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            <Link to="/sprint-game" className="quick-link-btn" style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaGamepad /> Sprint Game
            </Link>
            <Link to="/badges" className="quick-link-btn" style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <FaAward /> Badge Catalogue
            </Link>
          </div>
        )}

        {/* Stats Overview */}
        <div className="stats-grid">
          {user ? (
            <>
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
            </>
          ) : (
            <>
              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <FaUsers />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{teams.length}</div>
                  <div className="stat-label">Teams</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
                  <FaRocket />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{totalFeatures}</div>
                  <div className="stat-label">Total Features</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                  <FaTrophy />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{completedFeatures}</div>
                  <div className="stat-label">Completed</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
                  <FaChartLine />
                </div>
                <div className="stat-content">
                  <div className="stat-value">{avgCompletion}%</div>
                  <div className="stat-label">Avg Progress</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Top Teams Section (for non-authenticated users) */}
        {!user && topTeams.length > 0 && (
          <div className="dashboard-section">
            <h2><FaTrophy /> Top Performing Teams</h2>
            <div className="grid grid-3">
              {topTeams.map((team, index) => (
                <div key={team.name} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2rem' }}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '⭐'}
                    </span>
                    <div>
                      <h3 style={{ margin: 0 }}>Team {team.name}</h3>
                      <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                        {team.features?.length || 0} features
                      </span>
                    </div>
                  </div>
                  <div className="progress-bar" style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px' }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${team.avgCompletion || 0}%`,
                        height: '100%',
                        background: 'linear-gradient(135deg, #10b981, #059669)',
                        borderRadius: '4px'
                      }}
                    />
                  </div>
                  <div style={{ marginTop: '0.5rem', textAlign: 'right', fontWeight: 'bold', color: '#10b981' }}>
                    {Math.round(team.avgCompletion || 0)}% Complete
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Progress Section - for authenticated users */}
        {user && (
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
        )}

        {/* Recent Achievements - for authenticated users */}
        {user && (
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
        )}

        {/* Active Challenges - for authenticated users */}
        {user && (
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
        )}
      </div>
    </div>
  )
}

export default Dashboard
