import { useQuery } from '@tanstack/react-query'
import { authAPI } from '../api/api'
import { FaUser, FaTrophy, FaMedal, FaFire, FaStar, FaCalendar } from 'react-icons/fa'
import './Profile.css'

function Profile() {
  const { data } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile(),
  })

  const user = data?.data?.user

  if (!user) {
    return <div className="loading">Loading profile...</div>
  }

  const { gamification, statistics, profile } = user

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header-section">
          <div className="profile-avatar-large">
            {profile.displayName?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
          </div>
          <div className="profile-header-info">
            <h1>{profile.displayName || user.username}</h1>
            <p className="profile-username">@{user.username}</p>
            {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          </div>
          <div className="profile-level-display">
            <div className="level-circle">
              <div className="level-number">{gamification.level}</div>
              <div className="level-label">Level</div>
            </div>
          </div>
        </div>

        <div className="profile-stats-grid">
          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
              <FaStar />
            </div>
            <div className="stat-value">{gamification.totalPoints.toLocaleString()}</div>
            <div className="stat-name">Total Points</div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' }}>
              <FaTrophy />
            </div>
            <div className="stat-value">{gamification.achievements.filter(a => a.completed).length}</div>
            <div className="stat-name">Achievements</div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
              <FaMedal />
            </div>
            <div className="stat-value">{gamification.badges.length}</div>
            <div className="stat-name">Badges</div>
          </div>

          <div className="stat-box">
            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
              <FaFire />
            </div>
            <div className="stat-value">{gamification.streak.current} days</div>
            <div className="stat-name">Current Streak</div>
          </div>
        </div>

        <div className="profile-grid">
          {/* Experience Section */}
          <div className="card profile-section">
            <h2><FaStar /> Experience & Level</h2>
            <div className="experience-details">
              <div className="exp-item">
                <span className="exp-label">Current XP</span>
                <span className="exp-value">{gamification.experience.toLocaleString()}</span>
              </div>
              <div className="exp-item">
                <span className="exp-label">Current Level</span>
                <span className="exp-value">Level {gamification.level}</span>
              </div>
              <div className="exp-item">
                <span className="exp-label">Longest Streak</span>
                <span className="exp-value">{gamification.streak.longest} days</span>
              </div>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="card profile-section">
            <h2><FaTrophy /> Statistics</h2>
            <div className="experience-details">
              <div className="exp-item">
                <span className="exp-label">Activities Completed</span>
                <span className="exp-value">{statistics.activitiesCompleted}</span>
              </div>
              <div className="exp-item">
                <span className="exp-label">Challenges Completed</span>
                <span className="exp-value">{statistics.challengesCompleted}</span>
              </div>
              <div className="exp-item">
                <span className="exp-label">Time Spent</span>
                <span className="exp-value">{Math.round(statistics.totalTimeSpent / 60)} hours</span>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        {gamification.badges.length > 0 && (
          <div className="card profile-section">
            <h2><FaMedal /> Earned Badges</h2>
            <div className="badges-grid">
              {gamification.badges.map((badge, index) => (
                <div key={index} className="badge-item">
                  <div className="badge-icon-large">🏅</div>
                  <div className="badge-info">
                    <div className="badge-name">Badge #{index + 1}</div>
                    <div className="badge-date">
                      Earned {new Date(badge.earnedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="card profile-section">
          <h2><FaCalendar /> Account Information</h2>
          <div className="experience-details">
            <div className="exp-item">
              <span className="exp-label">Member Since</span>
              <span className="exp-value">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="exp-item">
              <span className="exp-label">Last Login</span>
              <span className="exp-value">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="exp-item">
              <span className="exp-label">Email</span>
              <span className="exp-value">{user.email}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
