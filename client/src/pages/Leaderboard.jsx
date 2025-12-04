import { useQuery } from '@tanstack/react-query'
import { usersAPI } from '../api/api'
import { FaMedal, FaTrophy, FaStar } from 'react-icons/fa'
import './Leaderboard.css'

function Leaderboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => usersAPI.getLeaderboard(50, 'all'),
  })

  const leaderboard = data?.data?.leaderboard || []

  if (isLoading) {
    return <div className="loading">Loading leaderboard...</div>
  }

  const getMedalIcon = (rank) => {
    if (rank === 1) return <FaTrophy style={{ color: '#FFD700' }} />
    if (rank === 2) return <FaMedal style={{ color: '#C0C0C0' }} />
    if (rank === 3) return <FaMedal style={{ color: '#CD7F32' }} />
    return <span className="rank-number">#{rank}</span>
  }

  return (
    <div className="leaderboard-page">
      <div className="container">
        <div className="page-header">
          <h1><FaTrophy /> Leaderboard</h1>
          <p>See how you rank against other players</p>
        </div>

        <div className="card leaderboard-card">
          {leaderboard.length === 0 ? (
            <div className="empty-state">
              No players on the leaderboard yet. Be the first!
            </div>
          ) : (
            <div className="leaderboard-list">
              {leaderboard.map((player) => (
                <div
                  key={player.userId}
                  className={`leaderboard-item ${player.rank <= 3 ? 'top-three' : ''}`}
                >
                  <div className="player-rank">{getMedalIcon(player.rank)}</div>

                  <div className="player-avatar">
                    <div className="avatar-circle">
                      {player.displayName?.[0]?.toUpperCase() || player.username[0].toUpperCase()}
                    </div>
                  </div>

                  <div className="player-info">
                    <div className="player-name">
                      {player.displayName || player.username}
                    </div>
                    <div className="player-username">@{player.username}</div>
                  </div>

                  <div className="player-level">
                    <div className="level-badge">
                      <FaStar />
                      <span>Lvl {player.level}</span>
                    </div>
                  </div>

                  <div className="player-points">
                    <div className="points-value">{player.points.toLocaleString()}</div>
                    <div className="points-label">points</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Leaderboard
