import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { challengesAPI } from '../api/api'
import { FaFire, FaClock, FaTrophy } from 'react-icons/fa'
import './Challenges.css'

function Challenges() {
  const queryClient = useQueryClient()

  const { data: allChallengesData } = useQuery({
    queryKey: ['all-challenges'],
    queryFn: () => challengesAPI.getAll(),
  })

  const { data: myChallengesData } = useQuery({
    queryKey: ['my-challenges'],
    queryFn: () => challengesAPI.getMyChallenges(),
  })

  const joinMutation = useMutation({
    mutationFn: (challengeId) => challengesAPI.join(challengeId),
    onSuccess: () => {
      queryClient.invalidateQueries(['all-challenges'])
      queryClient.invalidateQueries(['my-challenges'])
    },
  })

  const allChallenges = allChallengesData?.data?.challenges || []
  const myChallenges = myChallengesData?.data?.challenges || []

  const myChallengeIds = new Set(myChallenges.map(c => c.challenge._id))
  const availableChallenges = allChallenges.filter(
    c => !myChallengeIds.has(c._id)
  )

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: '#10b981',
      medium: '#f59e0b',
      hard: '#ef4444',
      expert: '#a855f7',
    }
    return colors[difficulty] || '#6b7280'
  }

  return (
    <div className="challenges-page">
      <div className="container">
        <div className="page-header">
          <h1><FaFire /> Challenges</h1>
          <p>Take on challenges to earn extra points and rewards</p>
        </div>

        {/* My Challenges */}
        {myChallenges.length > 0 && (
          <div className="challenges-section">
            <h2>My Active Challenges ({myChallenges.length})</h2>
            <div className="grid grid-2">
              {myChallenges.map((item) => (
                <div key={item.challenge._id} className="card challenge-detail-card">
                  <div className="challenge-header-row">
                    <span
                      className="badge"
                      style={{
                        backgroundColor: `${getDifficultyColor(item.challenge.difficulty)}20`,
                        color: getDifficultyColor(item.challenge.difficulty),
                      }}
                    >
                      {item.challenge.difficulty}
                    </span>
                    <span className="challenge-type">{item.challenge.type}</span>
                  </div>

                  <h3>{item.challenge.title}</h3>
                  <p>{item.challenge.description}</p>

                  <div className="challenge-meta">
                    <div className="meta-item">
                      <FaClock />
                      <span>
                        Ends {new Date(item.challenge.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="meta-item">
                      <FaTrophy />
                      <span>+{item.challenge.rewards.points} points</span>
                    </div>
                  </div>

                  <div className="challenge-progress-section">
                    <div className="progress-header">
                      <span>Progress</span>
                      <span className="progress-percent">{item.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  {item.completed && (
                    <div className="completed-banner">
                      ✅ Completed on {new Date(item.completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Challenges */}
        <div className="challenges-section">
          <h2>Available Challenges ({availableChallenges.length})</h2>
          <div className="grid grid-3">
            {availableChallenges.map((challenge) => (
              <div key={challenge._id} className="card challenge-card-compact">
                <div className="challenge-header-row">
                  <span
                    className="badge"
                    style={{
                      backgroundColor: `${getDifficultyColor(challenge.difficulty)}20`,
                      color: getDifficultyColor(challenge.difficulty),
                    }}
                  >
                    {challenge.difficulty}
                  </span>
                  <span className="points-badge">
                    +{challenge.rewards.points}
                  </span>
                </div>

                <h3>{challenge.title}</h3>
                <p className="challenge-desc">{challenge.description}</p>

                <div className="challenge-footer">
                  <span className="challenge-type-small">
                    {challenge.type}
                  </span>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => joinMutation.mutate(challenge._id)}
                    disabled={joinMutation.isLoading}
                  >
                    {joinMutation.isLoading ? 'Joining...' : 'Join'}
                  </button>
                </div>
              </div>
            ))}

            {availableChallenges.length === 0 && (
              <div className="empty-state">
                No available challenges at the moment. Check back later!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Challenges
