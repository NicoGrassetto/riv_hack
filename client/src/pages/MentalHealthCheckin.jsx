import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { FaHeart, FaSmile, FaMeh, FaFrown, FaSadTear, FaGrinStars, FaPaperPlane, FaCheck } from 'react-icons/fa'
import './MentalHealthCheckin.css'

const API_URL = 'http://localhost:5000/api'

function MentalHealthCheckin() {
  const [selectedTeam, setSelectedTeam] = useState('')
  const [mood, setMood] = useState(null)
  const [energy, setEnergy] = useState(null)
  const [stress, setStress] = useState(null)
  const [workload, setWorkload] = useState(null)
  const [support, setSupport] = useState(null)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const teams = [
    'Blue', 'Green', 'Orange', 'Lavender', 'Yellow', 'Turquoise',
    'Amber', 'Azure', 'Emerald', 'Silver', 'Gold', 'Maroon'
  ]

  const moodOptions = [
    { value: 1, icon: <FaSadTear />, label: 'Struggling', color: '#EF4444' },
    { value: 2, icon: <FaFrown />, label: 'Low', color: '#F97316' },
    { value: 3, icon: <FaMeh />, label: 'Okay', color: '#EAB308' },
    { value: 4, icon: <FaSmile />, label: 'Good', color: '#22C55E' },
    { value: 5, icon: <FaGrinStars />, label: 'Great!', color: '#10B981' },
  ]

  const scaleOptions = [
    { value: 1, label: 'Very Low' },
    { value: 2, label: 'Low' },
    { value: 3, label: 'Moderate' },
    { value: 4, label: 'High' },
    { value: 5, label: 'Very High' },
  ]

  const submitMutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`${API_URL}/mental-health/checkin`, data)
      return response.data
    },
    onSuccess: () => {
      setSubmitted(true)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedTeam || mood === null) return

    submitMutation.mutate({
      team: selectedTeam,
      mood,
      energy: energy || 3,
      stress: stress || 3,
      workload: workload || 3,
      support: support || 3,
      comment: comment.trim(),
      timestamp: new Date().toISOString()
    })
  }

  const isFormValid = selectedTeam && mood !== null

  if (submitted) {
    return (
      <div className="mental-health-checkin">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">
              <FaCheck />
            </div>
            <h1>Thank You! 💚</h1>
            <p>Your check-in has been recorded anonymously.</p>
            <p className="support-message">
              Remember: It's okay to not be okay. If you're struggling, 
              please reach out to your team lead or HR for support.
            </p>
            <button 
              className="btn-primary"
              onClick={() => {
                setSubmitted(false)
                setMood(null)
                setEnergy(null)
                setStress(null)
                setWorkload(null)
                setSupport(null)
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

  return (
    <div className="mental-health-checkin">
      <div className="container">
        <div className="checkin-header">
          <div className="heart-icon">
            <FaHeart />
          </div>
          <h1>Mental Health Check-in</h1>
          <p>Your responses are anonymous and help us support team wellbeing</p>
        </div>

        <form onSubmit={handleSubmit} className="checkin-form">
          {/* Team Selection */}
          <div className="form-section">
            <label>Which team are you on?</label>
            <div className="team-grid">
              {teams.map(team => (
                <button
                  key={team}
                  type="button"
                  className={`team-btn ${selectedTeam === team ? 'selected' : ''}`}
                  onClick={() => setSelectedTeam(team)}
                >
                  {team}
                </button>
              ))}
            </div>
          </div>

          {/* Mood Selection */}
          <div className="form-section">
            <label>How are you feeling today? *</label>
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

          {/* Energy Level */}
          <div className="form-section">
            <label>Energy Level</label>
            <div className="scale-grid">
              {scaleOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`scale-btn ${energy === option.value ? 'selected' : ''}`}
                  onClick={() => setEnergy(option.value)}
                >
                  {option.value}
                  <span className="scale-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Stress Level */}
          <div className="form-section">
            <label>Stress Level</label>
            <div className="scale-grid reverse">
              {scaleOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`scale-btn ${stress === option.value ? 'selected' : ''}`}
                  onClick={() => setStress(option.value)}
                >
                  {option.value}
                  <span className="scale-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Workload */}
          <div className="form-section">
            <label>How manageable is your workload?</label>
            <div className="scale-grid">
              {[
                { value: 1, label: 'Overwhelmed' },
                { value: 2, label: 'Heavy' },
                { value: 3, label: 'Balanced' },
                { value: 4, label: 'Light' },
                { value: 5, label: 'Easy' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`scale-btn ${workload === option.value ? 'selected' : ''}`}
                  onClick={() => setWorkload(option.value)}
                >
                  {option.value}
                  <span className="scale-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Team Support */}
          <div className="form-section">
            <label>Do you feel supported by your team?</label>
            <div className="scale-grid">
              {[
                { value: 1, label: 'Not at all' },
                { value: 2, label: 'Slightly' },
                { value: 3, label: 'Somewhat' },
                { value: 4, label: 'Mostly' },
                { value: 5, label: 'Absolutely' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`scale-btn ${support === option.value ? 'selected' : ''}`}
                  onClick={() => setSupport(option.value)}
                >
                  {option.value}
                  <span className="scale-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Comment */}
          <div className="form-section">
            <label>Anything else you'd like to share? (Optional)</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your thoughts are anonymous and help us improve..."
              maxLength={500}
            />
            <span className="char-count">{comment.length}/500</span>
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={!isFormValid || submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              'Submitting...'
            ) : (
              <>
                <FaPaperPlane /> Submit Check-in
              </>
            )}
          </button>

          <p className="privacy-note">
            🔒 Your responses are completely anonymous. We only track aggregated team data.
          </p>
        </form>
      </div>
    </div>
  )
}

export default MentalHealthCheckin
