import { useState, useEffect, useRef } from 'react'
import { sprintGameAPI } from '../api/api'
import './SprintGame.css'

function SprintGame() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('leaderboard')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const isMounted = useRef(true)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await sprintGameAPI.getAnalytics()
      
      if (isMounted.current) {
        setAnalytics(response.data)
        setLoading(false)
      }
    } catch (err) {
      if (isMounted.current) {
        setError('Failed to load sprint game data')
        setLoading(false)
        console.error(err)
      }
    }
  }

  useEffect(() => {
    isMounted.current = true
    fetchAnalytics()
    
    return () => {
      isMounted.current = false
    }
  }, [])

  const getTeamColor = (teamName) => {
    const colors = {
      'Blue': '#3B82F6',
      'Green': '#10B981',
      'Orange': '#F97316',
      'Yellow': '#EAB308',
      'Turquoise': '#14B8A6',
      'Lavender': '#A78BFA',
      'Amber': '#F59E0B',
      'Azure': '#0EA5E9',
      'Emerald': '#059669',
      'Silver': '#9CA3AF',
      'Gold': '#D97706',
      'Maroon': '#991B1B'
    }
    return colors[teamName] || '#6B7280'
  }

  const getRankEmoji = (rank) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `#${rank}`
  }

  if (loading) {
    return (
      <div className="sprint-game-loading">
        <div className="loading-spinner"></div>
        <p>Loading Sprint Game...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="sprint-game-error">
        <span className="error-icon">⚠️</span>
        <p>{error}</p>
        <button onClick={fetchAnalytics}>Retry</button>
      </div>
    )
  }

  return (
    <div className="sprint-game">
      <header className="sprint-game-header">
        <div className="header-content">
          <h1>🎮 Sprint Progress Game</h1>
          <p className="subtitle">Track team performance across sprints and earn rewards!</p>
        </div>
        <div className="summary-cards">
          <div className="summary-card">
            <span className="card-icon">📊</span>
            <div className="card-content">
              <span className="card-value">{analytics?.summary?.totalFeatures}</span>
              <span className="card-label">Total Features</span>
            </div>
          </div>
          <div className="summary-card">
            <span className="card-icon">✅</span>
            <div className="card-content">
              <span className="card-value">{analytics?.summary?.completedFeatures}</span>
              <span className="card-label">Completed</span>
            </div>
          </div>
          <div className="summary-card">
            <span className="card-icon">🔄</span>
            <div className="card-content">
              <span className="card-value">{analytics?.summary?.inProgressFeatures}</span>
              <span className="card-label">In Progress</span>
            </div>
          </div>
          <div className="summary-card highlight">
            <span className="card-icon">📈</span>
            <div className="card-content">
              <span className="card-value">{analytics?.summary?.overallCompletion}%</span>
              <span className="card-label">Overall Completion</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="sprint-tabs">
        <button 
          className={activeTab === 'leaderboard' ? 'active' : ''} 
          onClick={() => setActiveTab('leaderboard')}
        >
          🏆 Leaderboard
        </button>
        <button 
          className={activeTab === 'sprints' ? 'active' : ''} 
          onClick={() => setActiveTab('sprints')}
        >
          📈 Sprint Progress
        </button>
        <button 
          className={activeTab === 'teams' ? 'active' : ''} 
          onClick={() => setActiveTab('teams')}
        >
          👥 Teams
        </button>
        <button 
          className={activeTab === 'burndown' ? 'active' : ''} 
          onClick={() => setActiveTab('burndown')}
        >
          📉 Burndown
        </button>
      </nav>

      <main className="sprint-game-content">
        {activeTab === 'leaderboard' && (
          <section className="leaderboard-section">
            <h2>🏆 Team Leaderboard</h2>
            <div className="leaderboard-list">
              {analytics?.leaderboard?.map((team, index) => (
                <div 
                  key={team.name} 
                  className={`leaderboard-item rank-${index + 1}`}
                  style={{ borderLeftColor: getTeamColor(team.name) }}
                  onClick={() => {
                    setSelectedTeam(team.name)
                    setActiveTab('teams')
                  }}
                >
                  <div className="rank">{getRankEmoji(index + 1)}</div>
                  <div 
                    className="team-badge" 
                    style={{ backgroundColor: getTeamColor(team.name) }}
                  >
                    {team.name.charAt(0)}
                  </div>
                  <div className="team-info">
                    <span className="team-name">{team.name} Team</span>
                    <span className="team-stats">
                      {team.featuresCompleted}/{team.totalFeatures} features completed
                    </span>
                  </div>
                  <div className="team-metrics">
                    <div className="metric">
                      <span className="metric-value">{team.completionRate}%</span>
                      <span className="metric-label">Completion</span>
                    </div>
                    <div className="metric highlight">
                      <span className="metric-value">{team.score}</span>
                      <span className="metric-label">Score</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'sprints' && (
          <section className="sprints-section">
            <h2>📈 Sprint Progress Over Time</h2>
            <div className="sprint-progress-chart">
              {Object.entries(analytics?.sprintProgress || {}).map(([sprint, data]) => (
                <div key={sprint} className="sprint-bar-container">
                  <div className="sprint-label">
                    <span className="sprint-name">{sprint}</span>
                    <span className="sprint-date">{data.date}</span>
                  </div>
                  <div className="sprint-bar-wrapper">
                    <div 
                      className="sprint-bar"
                      style={{ 
                        width: `${data.average}%`,
                        backgroundColor: data.average >= 80 ? '#10B981' : 
                                        data.average >= 50 ? '#F59E0B' : '#EF4444'
                      }}
                    >
                      <span className="bar-label">{data.average}%</span>
                    </div>
                  </div>
                  <div className="sprint-count">{data.count} items</div>
                </div>
              ))}
            </div>
            
            <div className="sprint-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#10B981' }}></span>
                <span>≥80% - On Track</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#F59E0B' }}></span>
                <span>50-79% - Needs Attention</span>
              </div>
              <div className="legend-item">
                <span className="legend-color" style={{ backgroundColor: '#EF4444' }}></span>
                <span>&lt;50% - At Risk</span>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'teams' && (
          <section className="teams-section">
            <h2>👥 Team Performance</h2>
            <div className="teams-grid">
              {Object.entries(analytics?.teamStats || {}).map(([teamName, team]) => (
                <div 
                  key={teamName} 
                  className={`team-card ${selectedTeam === teamName ? 'selected' : ''}`}
                  style={{ borderTopColor: getTeamColor(teamName) }}
                  onClick={() => setSelectedTeam(selectedTeam === teamName ? null : teamName)}
                >
                  <div className="team-card-header">
                    <div 
                      className="team-avatar"
                      style={{ backgroundColor: getTeamColor(teamName) }}
                    >
                      {teamName.charAt(0)}
                    </div>
                    <h3>{teamName} Team</h3>
                  </div>
                  
                  <div className="team-card-stats">
                    <div className="stat">
                      <span className="stat-value">{team.totalFeatures}</span>
                      <span className="stat-label">Features</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{team.completedFeatures}</span>
                      <span className="stat-label">Completed</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{team.averageCompletion}%</span>
                      <span className="stat-label">Avg. Completion</span>
                    </div>
                  </div>
                  
                  <div className="completion-bar">
                    <div 
                      className="completion-fill"
                      style={{ 
                        width: `${team.averageCompletion}%`,
                        backgroundColor: getTeamColor(teamName)
                      }}
                    ></div>
                  </div>
                  
                  <div className="team-types">
                    <span className="type-badge stories">
                      📖 {team.featureTypes?.Story || 0} Stories
                    </span>
                    <span className="type-badge features">
                      ⚙️ {team.featureTypes?.Feature || 0} Features
                    </span>
                  </div>
                  
                  {selectedTeam === teamName && (
                    <div className="team-velocity">
                      <h4>Sprint Velocity</h4>
                      <div className="velocity-grid">
                        {Object.entries(team.sprintVelocity || {}).map(([sprint, vel]) => (
                          <div key={sprint} className="velocity-item">
                            <span className="velocity-sprint">{sprint}</span>
                            <span className="velocity-value">{vel.average}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'burndown' && (
          <section className="burndown-section">
            <h2>📉 Burndown Chart</h2>
            <div className="burndown-chart">
              <div className="chart-container">
                <div className="chart-y-axis">
                  <span>100%</span>
                  <span>75%</span>
                  <span>50%</span>
                  <span>25%</span>
                  <span>0%</span>
                </div>
                <div className="chart-area">
                  <div className="ideal-line"></div>
                  <div className="actual-line">
                    {Object.entries(analytics?.sprintProgress || {}).map(([sprint, data], index, arr) => {
                      const remaining = 100 - data.average
                      const left = arr.length > 1 ? (index / (arr.length - 1)) * 100 : 50
                      return (
                        <div 
                          key={sprint}
                          className="data-point"
                          style={{ 
                            left: `${left}%`, 
                            bottom: `${remaining}%` 
                          }}
                          title={`${sprint}: ${data.average}% complete (${remaining}% remaining)`}
                        >
                          <span className="point-label">{remaining}%</span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="chart-x-axis">
                    {Object.keys(analytics?.sprintProgress || {}).map(sprint => (
                      <span key={sprint}>{sprint}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="burndown-stats">
                <div className="burndown-stat">
                  <span className="stat-icon">🎯</span>
                  <div className="stat-content">
                    <span className="stat-value">{analytics?.summary?.notStartedFeatures}</span>
                    <span className="stat-label">Not Started</span>
                  </div>
                </div>
                <div className="burndown-stat">
                  <span className="stat-icon">🔄</span>
                  <div className="stat-content">
                    <span className="stat-value">{analytics?.summary?.inProgressFeatures}</span>
                    <span className="stat-label">In Progress</span>
                  </div>
                </div>
                <div className="burndown-stat">
                  <span className="stat-icon">✅</span>
                  <div className="stat-content">
                    <span className="stat-value">{analytics?.summary?.completedFeatures}</span>
                    <span className="stat-label">Completed</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default SprintGame
