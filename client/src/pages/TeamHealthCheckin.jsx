import { useState } from 'react'
import { FaHeart, FaUsers, FaSmile, FaMeh, FaFrown, FaSadTear, FaGrinStars, FaPaperPlane, FaCheck, FaQrcode, FaArrowLeft } from 'react-icons/fa'
import './TeamHealthCheckin.css'

function TeamHealthCheckin() {
  const [showQRScanner, setShowQRScanner] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState('')
  const [submitted, setSubmitted] = useState(false)
  
  // Questionnaire state
  const [mood, setMood] = useState(null)
  const [teamMorale, setTeamMorale] = useState(null)
  const [collaboration, setCollaboration] = useState(null)
  const [communication, setCommunication] = useState(null)
  const [workLifeBalance, setWorkLifeBalance] = useState(null)
  const [psychologicalSafety, setPsychologicalSafety] = useState(null)
  const [sprintConfidence, setSprintConfidence] = useState(null)
  const [blockerStress, setBlockerStress] = useState(null)
  const [comment, setComment] = useState('')

  const teams = [
    'Blue', 'Green', 'Orange', 'Lavender', 'Yellow', 'Turquoise',
    'Amber', 'Azure', 'Emerald', 'Silver', 'Gold', 'Maroon'
  ]

  const moodOptions = [
    { value: 1, icon: <FaSadTear />, label: 'Struggling', color: '#EF4444' },
    { value: 2, icon: <FaFrown />, label: 'Difficult', color: '#F97316' },
    { value: 3, icon: <FaMeh />, label: 'Okay', color: '#EAB308' },
    { value: 4, icon: <FaSmile />, label: 'Good', color: '#22C55E' },
    { value: 5, icon: <FaGrinStars />, label: 'Thriving!', color: '#10B981' },
  ]

  const handleQRScan = (team) => {
    setSelectedTeam(team)
    setShowQRScanner(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedTeam || mood === null || teamMorale === null) return
    
    // In a real app, this would send to the API
    console.log('Submitting team health data:', {
      team: selectedTeam,
      mood,
      teamMorale,
      collaboration,
      communication,
      workLifeBalance,
      psychologicalSafety,
      sprintConfidence,
      blockerStress,
      comment,
      timestamp: new Date().toISOString()
    })
    
    setSubmitted(true)
  }

  const isFormValid = selectedTeam && mood !== null && teamMorale !== null

  // QR Code Scanner simulation
  if (showQRScanner) {
    return (
      <div className="team-health-checkin">
        <div className="container">
          <div className="qr-scanner-section">
            <div className="qr-header">
              <FaQrcode className="qr-icon-large" />
              <h1>Team Health Check-in</h1>
              <p>Scan the QR code displayed in your team area, or select your team below</p>
            </div>
            
            {/* Fake QR Scanner Display */}
            <div className="qr-scanner-display">
              <div className="scanner-frame">
                <div className="scanner-corners">
                  <span></span><span></span><span></span><span></span>
                </div>
                <div className="scanner-line"></div>
                <div className="qr-placeholder">
                  <FaQrcode />
                  <p>Point camera at QR code</p>
                </div>
              </div>
              <p className="scanner-hint">📱 In production, scan the physical QR code posted in your team area</p>
            </div>

            {/* Manual Team Selection */}
            <div className="manual-selection">
              <h3>Or select your team manually:</h3>
              <div className="team-grid">
                {teams.map(team => (
                  <button
                    key={team}
                    className="team-btn"
                    onClick={() => handleQRScan(team)}
                    style={{
                      '--team-color': getTeamColor(team)
                    }}
                  >
                    <span className="team-icon">{getTeamEmoji(team)}</span>
                    <span className="team-name">{team}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Success screen
  if (submitted) {
    return (
      <div className="team-health-checkin">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">
              <FaCheck />
            </div>
            <h1>Thank You! 💚</h1>
            <p>Your team health check-in has been recorded anonymously.</p>
            <div className="wellness-tips">
              <h3>🌟 Wellness Reminders</h3>
              <ul>
                <li>Take regular breaks during the sprint</li>
                <li>Celebrate small wins with your team</li>
                <li>Reach out if you're feeling overwhelmed</li>
                <li>Support teammates who might be struggling</li>
              </ul>
            </div>
            <p className="support-message">
              Remember: Team wellbeing is everyone's responsibility. 
              If you or a teammate is struggling, please reach out to your team lead or HR.
            </p>
            <button 
              className="btn-primary"
              onClick={() => {
                setSubmitted(false)
                setShowQRScanner(true)
                setMood(null)
                setTeamMorale(null)
                setCollaboration(null)
                setCommunication(null)
                setWorkLifeBalance(null)
                setPsychologicalSafety(null)
                setSprintConfidence(null)
                setBlockerStress(null)
                setComment('')
              }}
            >
              Submit Another Check-in
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Main Questionnaire
  return (
    <div className="team-health-checkin">
      <div className="container">
        <button className="back-btn" onClick={() => setShowQRScanner(true)}>
          <FaArrowLeft /> Back to Scanner
        </button>
        
        <div className="checkin-header">
          <div className="header-icons">
            <FaHeart className="heart-icon" />
            <FaUsers className="team-icon" />
          </div>
          <h1>Team Health Check-in</h1>
          <div className="selected-team" style={{ backgroundColor: getTeamColor(selectedTeam) }}>
            {getTeamEmoji(selectedTeam)} {selectedTeam} Team
          </div>
          <p>Your responses are anonymous and help us track team wellbeing over time</p>
        </div>

        <form onSubmit={handleSubmit} className="checkin-form">
          {/* Personal Mood */}
          <div className="form-section">
            <label>
              <span className="question-number">1</span>
              How are you feeling personally today? *
            </label>
            <div className="mood-grid">
              {moodOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`mood-btn ${mood === option.value ? 'selected' : ''}`}
                  style={{ 
                    '--mood-color': option.color,
                    borderColor: mood === option.value ? option.color : 'transparent'
                  }}
                  onClick={() => setMood(option.value)}
                >
                  <span className="mood-icon">{option.icon}</span>
                  <span className="mood-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Team Morale */}
          <div className="form-section">
            <label>
              <span className="question-number">2</span>
              How would you rate overall team morale? *
            </label>
            <div className="mood-grid">
              {moodOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`mood-btn ${teamMorale === option.value ? 'selected' : ''}`}
                  style={{ 
                    '--mood-color': option.color,
                    borderColor: teamMorale === option.value ? option.color : 'transparent'
                  }}
                  onClick={() => setTeamMorale(option.value)}
                >
                  <span className="mood-icon">{option.icon}</span>
                  <span className="mood-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Team Collaboration */}
          <div className="form-section">
            <label>
              <span className="question-number">3</span>
              How well is the team collaborating this sprint?
            </label>
            <div className="scale-grid">
              {[
                { value: 1, label: 'Siloed', emoji: '🏝️' },
                { value: 2, label: 'Disconnected', emoji: '🔗' },
                { value: 3, label: 'Adequate', emoji: '🤝' },
                { value: 4, label: 'Strong', emoji: '💪' },
                { value: 5, label: 'Amazing!', emoji: '🌟' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`scale-btn ${collaboration === option.value ? 'selected' : ''}`}
                  onClick={() => setCollaboration(option.value)}
                >
                  <span className="scale-emoji">{option.emoji}</span>
                  <span className="scale-value">{option.value}</span>
                  <span className="scale-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Communication */}
          <div className="form-section">
            <label>
              <span className="question-number">4</span>
              How effective is team communication?
            </label>
            <div className="scale-grid">
              {[
                { value: 1, label: 'Poor', emoji: '🔇' },
                { value: 2, label: 'Lacking', emoji: '📵' },
                { value: 3, label: 'Okay', emoji: '💬' },
                { value: 4, label: 'Good', emoji: '📢' },
                { value: 5, label: 'Excellent', emoji: '🎯' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`scale-btn ${communication === option.value ? 'selected' : ''}`}
                  onClick={() => setCommunication(option.value)}
                >
                  <span className="scale-emoji">{option.emoji}</span>
                  <span className="scale-value">{option.value}</span>
                  <span className="scale-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Work-Life Balance */}
          <div className="form-section">
            <label>
              <span className="question-number">5</span>
              How is your work-life balance this sprint?
            </label>
            <div className="scale-grid">
              {[
                { value: 1, label: 'Burnout Risk', emoji: '🔥' },
                { value: 2, label: 'Struggling', emoji: '😓' },
                { value: 3, label: 'Managing', emoji: '⚖️' },
                { value: 4, label: 'Balanced', emoji: '☮️' },
                { value: 5, label: 'Thriving', emoji: '🧘' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`scale-btn ${workLifeBalance === option.value ? 'selected' : ''}`}
                  onClick={() => setWorkLifeBalance(option.value)}
                >
                  <span className="scale-emoji">{option.emoji}</span>
                  <span className="scale-value">{option.value}</span>
                  <span className="scale-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Psychological Safety */}
          <div className="form-section">
            <label>
              <span className="question-number">6</span>
              Do you feel safe to speak up and share ideas?
            </label>
            <div className="scale-grid">
              {[
                { value: 1, label: 'Not Safe', emoji: '🤐' },
                { value: 2, label: 'Hesitant', emoji: '😶' },
                { value: 3, label: 'Sometimes', emoji: '🤔' },
                { value: 4, label: 'Usually', emoji: '💭' },
                { value: 5, label: 'Always', emoji: '🗣️' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`scale-btn ${psychologicalSafety === option.value ? 'selected' : ''}`}
                  onClick={() => setPsychologicalSafety(option.value)}
                >
                  <span className="scale-emoji">{option.emoji}</span>
                  <span className="scale-value">{option.value}</span>
                  <span className="scale-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sprint Confidence */}
          <div className="form-section">
            <label>
              <span className="question-number">7</span>
              How confident are you in achieving sprint goals?
            </label>
            <div className="scale-grid">
              {[
                { value: 1, label: 'Very Low', emoji: '😰' },
                { value: 2, label: 'Worried', emoji: '😟' },
                { value: 3, label: 'Hopeful', emoji: '🤞' },
                { value: 4, label: 'Confident', emoji: '💪' },
                { value: 5, label: 'Certain', emoji: '🎯' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`scale-btn ${sprintConfidence === option.value ? 'selected' : ''}`}
                  onClick={() => setSprintConfidence(option.value)}
                >
                  <span className="scale-emoji">{option.emoji}</span>
                  <span className="scale-value">{option.value}</span>
                  <span className="scale-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Blocker Stress */}
          <div className="form-section">
            <label>
              <span className="question-number">8</span>
              How much are blockers affecting team stress?
            </label>
            <div className="scale-grid reverse">
              {[
                { value: 5, label: 'No Blockers', emoji: '🟢' },
                { value: 4, label: 'Minor', emoji: '🟡' },
                { value: 3, label: 'Moderate', emoji: '🟠' },
                { value: 2, label: 'Significant', emoji: '🔴' },
                { value: 1, label: 'Critical', emoji: '🚨' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`scale-btn ${blockerStress === option.value ? 'selected' : ''}`}
                  onClick={() => setBlockerStress(option.value)}
                >
                  <span className="scale-emoji">{option.emoji}</span>
                  <span className="scale-value">{option.value}</span>
                  <span className="scale-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Comment */}
          <div className="form-section">
            <label>
              <span className="question-number">💬</span>
              Anything else you'd like to share about team health? (Optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share thoughts on team dynamics, support needed, or suggestions for improvement..."
              maxLength={500}
            />
            <span className="char-count">{comment.length}/500</span>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={!isFormValid}
          >
            <FaPaperPlane /> Submit Team Health Check-in
          </button>

          <p className="privacy-note">
            🔒 Your responses are completely anonymous. We only track aggregated team wellness trends.
          </p>
        </form>
      </div>
    </div>
  )
}

function getTeamColor(teamName) {
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

function getTeamEmoji(teamName) {
  const emojis = {
    'Blue': '💙',
    'Green': '💚',
    'Orange': '🧡',
    'Yellow': '💛',
    'Turquoise': '🩵',
    'Lavender': '💜',
    'Amber': '🔶',
    'Azure': '💠',
    'Emerald': '💎',
    'Silver': '🪙',
    'Gold': '🥇',
    'Maroon': '🟤'
  }
  return emojis[teamName] || '🏷️'
}

export default TeamHealthCheckin
