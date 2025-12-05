import { useState, useEffect, useRef, useCallback } from 'react'
import { sprintGameAPI } from '../api/api'
import './SprintGame.css'

// Auto-rotate interval in milliseconds (25 seconds)
const AUTO_ROTATE_INTERVAL = 25000

// Toggle this to use fake data vs real API data
const USE_FAKE_DATA = true

// Comprehensive fake data for demonstration
const FAKE_ANALYTICS = {
  summary: {
    totalFeatures: 76,
    completedFeatures: 42,
    inProgressFeatures: 28,
    notStartedFeatures: 6,
    overallCompletion: 78,
    totalTeams: 12
  },
  leaderboard: [
    {
      name: 'Green',
      score: 285,
      completionRate: 98,
      featuresCompleted: 7,
      totalFeatures: 8,
      kpis: { completion: 98, momentum: 58, predictability: 100 },
      scoreBreakdown: { completedBonus: 70, onTrackBonus: 5, momentumBonus: 9, penalties: 0 }
    },
    {
      name: 'Azure',
      score: 262,
      completionRate: 95,
      featuresCompleted: 5,
      totalFeatures: 6,
      kpis: { completion: 95, momentum: 55, predictability: 100 },
      scoreBreakdown: { completedBonus: 50, onTrackBonus: 5, momentumBonus: 6, penalties: 0 }
    },
    {
      name: 'Lavender',
      score: 245,
      completionRate: 95,
      featuresCompleted: 6,
      totalFeatures: 8,
      kpis: { completion: 95, momentum: 52, predictability: 88 },
      scoreBreakdown: { completedBonus: 60, onTrackBonus: 10, momentumBonus: 6, penalties: 0 }
    },
    {
      name: 'Gold',
      score: 228,
      completionRate: 93,
      featuresCompleted: 3,
      totalFeatures: 5,
      kpis: { completion: 93, momentum: 50, predictability: 80 },
      scoreBreakdown: { completedBonus: 30, onTrackBonus: 10, momentumBonus: 6, penalties: 0 }
    },
    {
      name: 'Blue',
      score: 215,
      completionRate: 96,
      featuresCompleted: 6,
      totalFeatures: 8,
      kpis: { completion: 96, momentum: 68, predictability: 75 },
      scoreBreakdown: { completedBonus: 60, onTrackBonus: 5, momentumBonus: 9, penalties: 0 }
    },
    {
      name: 'Orange',
      score: 178,
      completionRate: 81,
      featuresCompleted: 3,
      totalFeatures: 7,
      kpis: { completion: 81, momentum: 45, predictability: 57 },
      scoreBreakdown: { completedBonus: 30, onTrackBonus: 15, momentumBonus: 6, penalties: 0 }
    },
    {
      name: 'Emerald',
      score: 165,
      completionRate: 71,
      featuresCompleted: 0,
      totalFeatures: 5,
      kpis: { completion: 71, momentum: 38, predictability: 40 },
      scoreBreakdown: { completedBonus: 0, onTrackBonus: 25, momentumBonus: 6, penalties: 0 }
    },
    {
      name: 'Amber',
      score: 152,
      completionRate: 65,
      featuresCompleted: 1,
      totalFeatures: 6,
      kpis: { completion: 65, momentum: 35, predictability: 50 },
      scoreBreakdown: { completedBonus: 10, onTrackBonus: 20, momentumBonus: 3, penalties: 0 }
    },
    {
      name: 'Maroon',
      score: 138,
      completionRate: 62,
      featuresCompleted: 1,
      totalFeatures: 5,
      kpis: { completion: 62, momentum: 28, predictability: 40 },
      scoreBreakdown: { completedBonus: 10, onTrackBonus: 15, momentumBonus: 3, penalties: 0 }
    },
    {
      name: 'Yellow',
      score: 125,
      completionRate: 67,
      featuresCompleted: 1,
      totalFeatures: 6,
      kpis: { completion: 67, momentum: 42, predictability: 33 },
      scoreBreakdown: { completedBonus: 10, onTrackBonus: 15, momentumBonus: 6, penalties: 0 }
    },
    {
      name: 'Silver',
      score: 78,
      completionRate: 32,
      featuresCompleted: 0,
      totalFeatures: 5,
      kpis: { completion: 32, momentum: 5, predictability: 20 },
      scoreBreakdown: { completedBonus: 0, onTrackBonus: 0, momentumBonus: 0, penalties: -4 }
    },
    {
      name: 'Turquoise',
      score: 65,
      completionRate: 33,
      featuresCompleted: 0,
      totalFeatures: 6,
      kpis: { completion: 33, momentum: 8, predictability: 17 },
      scoreBreakdown: { completedBonus: 0, onTrackBonus: 0, momentumBonus: 0, penalties: -6 }
    }
  ],
  badges: {
    sprintStars: [
      { team: 'Green', score: 285, badge: '🥇' },
      { team: 'Azure', score: 262, badge: '🥈' },
      { team: 'Lavender', score: 245, badge: '🥉' }
    ],
    comebackCrew: [
      { team: 'Blue', momentum: 68, badge: '🚀' },
      { team: 'Green', momentum: 58, badge: '⚡' },
      { team: 'Azure', momentum: 55, badge: '🔥' }
    ],
    predictabilityPro: [
      { team: 'Green', predictability: 100, badge: '🎯' },
      { team: 'Azure', predictability: 100, badge: '🏹' },
      { team: 'Lavender', predictability: 88, badge: '📍' }
    ],
    blockerBuster: [
      { team: 'Lavender', qualityScore: 8, badge: '🔓' },
      { team: 'Azure', qualityScore: 6, badge: '🔑' },
      { team: 'Green', qualityScore: 5, badge: '⚡' }
    ]
  },
  // Team Wellness Data - fake data for demo
  teamWellness: {
    lastUpdated: '2024-12-05T10:30:00Z',
    totalResponses: 156,
    overallHealth: 3.8,
    teams: {
      'Green': { 
        mood: 4.2, teamMorale: 4.5, collaboration: 4.3, communication: 4.1, 
        workLifeBalance: 3.8, psychologicalSafety: 4.4, sprintConfidence: 4.6, blockerStress: 4.2,
        responses: 18, trend: 'up'
      },
      'Azure': { 
        mood: 4.0, teamMorale: 4.2, collaboration: 4.1, communication: 4.3, 
        workLifeBalance: 3.9, psychologicalSafety: 4.2, sprintConfidence: 4.4, blockerStress: 4.0,
        responses: 15, trend: 'up'
      },
      'Lavender': { 
        mood: 4.1, teamMorale: 4.0, collaboration: 4.4, communication: 3.9, 
        workLifeBalance: 4.0, psychologicalSafety: 4.3, sprintConfidence: 4.1, blockerStress: 3.8,
        responses: 14, trend: 'stable'
      },
      'Blue': { 
        mood: 3.8, teamMorale: 3.9, collaboration: 4.0, communication: 3.8, 
        workLifeBalance: 3.5, psychologicalSafety: 4.0, sprintConfidence: 4.2, blockerStress: 3.5,
        responses: 16, trend: 'up'
      },
      'Gold': { 
        mood: 3.9, teamMorale: 4.1, collaboration: 3.8, communication: 4.0, 
        workLifeBalance: 3.7, psychologicalSafety: 4.1, sprintConfidence: 4.0, blockerStress: 3.9,
        responses: 12, trend: 'stable'
      },
      'Orange': { 
        mood: 3.6, teamMorale: 3.5, collaboration: 3.7, communication: 3.6, 
        workLifeBalance: 3.2, psychologicalSafety: 3.8, sprintConfidence: 3.4, blockerStress: 3.0,
        responses: 14, trend: 'down'
      },
      'Emerald': { 
        mood: 3.5, teamMorale: 3.6, collaboration: 3.5, communication: 3.4, 
        workLifeBalance: 3.3, psychologicalSafety: 3.7, sprintConfidence: 3.2, blockerStress: 2.8,
        responses: 10, trend: 'stable'
      },
      'Amber': { 
        mood: 3.4, teamMorale: 3.3, collaboration: 3.6, communication: 3.5, 
        workLifeBalance: 3.1, psychologicalSafety: 3.5, sprintConfidence: 3.3, blockerStress: 2.9,
        responses: 12, trend: 'down'
      },
      'Maroon': { 
        mood: 3.3, teamMorale: 3.4, collaboration: 3.2, communication: 3.3, 
        workLifeBalance: 3.0, psychologicalSafety: 3.4, sprintConfidence: 3.1, blockerStress: 2.7,
        responses: 11, trend: 'stable'
      },
      'Yellow': { 
        mood: 3.2, teamMorale: 3.1, collaboration: 3.3, communication: 3.2, 
        workLifeBalance: 2.8, psychologicalSafety: 3.3, sprintConfidence: 2.9, blockerStress: 2.5,
        responses: 13, trend: 'down'
      },
      'Silver': { 
        mood: 2.8, teamMorale: 2.7, collaboration: 2.9, communication: 2.8, 
        workLifeBalance: 2.5, psychologicalSafety: 3.0, sprintConfidence: 2.4, blockerStress: 2.0,
        responses: 9, trend: 'down'
      },
      'Turquoise': { 
        mood: 2.6, teamMorale: 2.5, collaboration: 2.7, communication: 2.6, 
        workLifeBalance: 2.3, psychologicalSafety: 2.8, sprintConfidence: 2.2, blockerStress: 1.8,
        responses: 12, trend: 'down'
      }
    },
    sprintTrends: {
      S1: { mood: 3.2, morale: 3.0, collaboration: 3.1, responses: 89 },
      S2: { mood: 3.4, morale: 3.3, collaboration: 3.4, responses: 112 },
      S3: { mood: 3.6, morale: 3.5, collaboration: 3.6, responses: 134 },
      S4: { mood: 3.7, morale: 3.6, collaboration: 3.8, responses: 148 },
      S5: { mood: 3.8, morale: 3.7, collaboration: 3.9, responses: 156 }
    }
  },
  sprintProgress: {
    S1: { date: '14-Oct', total: 1850, count: 76, average: 24 },
    S2: { date: '28-Oct', total: 3420, count: 76, average: 45 },
    S3: { date: '12-Nov', total: 4864, count: 76, average: 64 },
    S4: { date: '25-Nov', total: 5624, count: 76, average: 74 },
    S5: { date: '9-Dec', total: 5928, count: 76, average: 78 }
  },
  teamStats: {
    'Green': {
      name: 'Green',
      totalFeatures: 8,
      completedFeatures: 7,
      inProgressFeatures: 1,
      averageCompletion: 98,
      featureTypes: { Story: 0, Feature: 8 },
      sprintVelocity: {
        S1: { average: 40 },
        S2: { average: 78 },
        S3: { average: 93 },
        S4: { average: 97 },
        S5: { average: 98 }
      },
      kpis: { completion: 98, momentum: 58, predictability: 100, qualityGates: { ready: 2, readyForQA: 4, blocked: 0 } }
    },
    'Azure': {
      name: 'Azure',
      totalFeatures: 6,
      completedFeatures: 5,
      inProgressFeatures: 1,
      averageCompletion: 95,
      featureTypes: { Story: 0, Feature: 6 },
      sprintVelocity: {
        S1: { average: 35 },
        S2: { average: 65 },
        S3: { average: 85 },
        S4: { average: 93 },
        S5: { average: 95 }
      },
      kpis: { completion: 95, momentum: 55, predictability: 100, qualityGates: { ready: 2, readyForQA: 2, blocked: 0 } }
    },
    'Lavender': {
      name: 'Lavender',
      totalFeatures: 8,
      completedFeatures: 6,
      inProgressFeatures: 2,
      averageCompletion: 95,
      featureTypes: { Story: 0, Feature: 8 },
      sprintVelocity: {
        S1: { average: 45 },
        S2: { average: 80 },
        S3: { average: 91 },
        S4: { average: 95 },
        S5: { average: 95 }
      },
      kpis: { completion: 95, momentum: 52, predictability: 88, qualityGates: { ready: 2, readyForQA: 4, blocked: 0 } }
    },
    'Gold': {
      name: 'Gold',
      totalFeatures: 5,
      completedFeatures: 3,
      inProgressFeatures: 2,
      averageCompletion: 93,
      featureTypes: { Story: 0, Feature: 5 },
      sprintVelocity: {
        S1: { average: 32 },
        S2: { average: 62 },
        S3: { average: 82 },
        S4: { average: 90 },
        S5: { average: 93 }
      },
      kpis: { completion: 93, momentum: 50, predictability: 80, qualityGates: { ready: 1, readyForQA: 2, blocked: 0 } }
    },
    'Blue': {
      name: 'Blue',
      totalFeatures: 8,
      completedFeatures: 6,
      inProgressFeatures: 2,
      averageCompletion: 96,
      featureTypes: { Story: 6, Feature: 2 },
      sprintVelocity: {
        S1: { average: 18 },
        S2: { average: 45 },
        S3: { average: 72 },
        S4: { average: 89 },
        S5: { average: 96 }
      },
      kpis: { completion: 96, momentum: 68, predictability: 75, qualityGates: { ready: 2, readyForQA: 2, blocked: 0 } }
    },
    'Orange': {
      name: 'Orange',
      totalFeatures: 7,
      completedFeatures: 3,
      inProgressFeatures: 4,
      averageCompletion: 81,
      featureTypes: { Story: 4, Feature: 3 },
      sprintVelocity: {
        S1: { average: 15 },
        S2: { average: 38 },
        S3: { average: 58 },
        S4: { average: 75 },
        S5: { average: 81 }
      },
      kpis: { completion: 81, momentum: 45, predictability: 57, qualityGates: { ready: 2, readyForQA: 1, blocked: 0 } }
    },
    'Emerald': {
      name: 'Emerald',
      totalFeatures: 5,
      completedFeatures: 0,
      inProgressFeatures: 4,
      averageCompletion: 71,
      featureTypes: { Story: 0, Feature: 5 },
      sprintVelocity: {
        S1: { average: 20 },
        S2: { average: 42 },
        S3: { average: 58 },
        S4: { average: 68 },
        S5: { average: 71 }
      },
      kpis: { completion: 71, momentum: 38, predictability: 40, qualityGates: { ready: 0, readyForQA: 0, blocked: 0 } }
    },
    'Amber': {
      name: 'Amber',
      totalFeatures: 6,
      completedFeatures: 1,
      inProgressFeatures: 4,
      averageCompletion: 65,
      featureTypes: { Story: 0, Feature: 6 },
      sprintVelocity: {
        S1: { average: 15 },
        S2: { average: 35 },
        S3: { average: 52 },
        S4: { average: 62 },
        S5: { average: 65 }
      },
      kpis: { completion: 65, momentum: 35, predictability: 50, qualityGates: { ready: 2, readyForQA: 0, blocked: 0 } }
    },
    'Maroon': {
      name: 'Maroon',
      totalFeatures: 5,
      completedFeatures: 1,
      inProgressFeatures: 2,
      averageCompletion: 62,
      featureTypes: { Story: 0, Feature: 5 },
      sprintVelocity: {
        S1: { average: 22 },
        S2: { average: 42 },
        S3: { average: 55 },
        S4: { average: 60 },
        S5: { average: 62 }
      },
      kpis: { completion: 62, momentum: 28, predictability: 40, qualityGates: { ready: 1, readyForQA: 0, blocked: 0 } }
    },
    'Yellow': {
      name: 'Yellow',
      totalFeatures: 6,
      completedFeatures: 1,
      inProgressFeatures: 4,
      averageCompletion: 67,
      featureTypes: { Story: 0, Feature: 6 },
      sprintVelocity: {
        S1: { average: 10 },
        S2: { average: 30 },
        S3: { average: 48 },
        S4: { average: 60 },
        S5: { average: 67 }
      },
      kpis: { completion: 67, momentum: 42, predictability: 33, qualityGates: { ready: 1, readyForQA: 0, blocked: 0 } }
    },
    'Silver': {
      name: 'Silver',
      totalFeatures: 5,
      completedFeatures: 0,
      inProgressFeatures: 2,
      averageCompletion: 32,
      featureTypes: { Story: 0, Feature: 5 },
      sprintVelocity: {
        S1: { average: 28 },
        S2: { average: 30 },
        S3: { average: 31 },
        S4: { average: 32 },
        S5: { average: 32 }
      },
      kpis: { completion: 32, momentum: 5, predictability: 20, qualityGates: { ready: 0, readyForQA: 0, blocked: 3 } }
    },
    'Turquoise': {
      name: 'Turquoise',
      totalFeatures: 6,
      completedFeatures: 0,
      inProgressFeatures: 2,
      averageCompletion: 33,
      featureTypes: { Story: 0, Feature: 6 },
      sprintVelocity: {
        S1: { average: 22 },
        S2: { average: 26 },
        S3: { average: 29 },
        S4: { average: 31 },
        S5: { average: 33 }
      },
      kpis: { completion: 33, momentum: 8, predictability: 17, qualityGates: { ready: 0, readyForQA: 0, blocked: 3 } }
    }
  },
  scoringConfig: {
    COMPLETED_BONUS: 10,
    ON_TRACK_BONUS: 5,
    MOMENTUM_BONUS: 3,
    NO_PROGRESS_PENALTY: -2
  }
}

function SprintGame() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('leaderboard')
  const [selectedTeam, setSelectedTeam] = useState(null)
  const [autoRotate, setAutoRotate] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const isMounted = useRef(true)
  const containerRef = useRef(null)

  const tabs = ['leaderboard', 'badges', 'wellness', 'kpis', 'sprints', 'teams', 'burndown']

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use fake data if enabled, otherwise fetch from API
      if (USE_FAKE_DATA) {
        // Simulate network delay for realism
        await new Promise(resolve => setTimeout(resolve, 500))
        if (isMounted.current) {
          setAnalytics(FAKE_ANALYTICS)
          setLoading(false)
        }
        return
      }
      
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

  // Auto-rotate tabs for office screen display
  useEffect(() => {
    if (!autoRotate) return

    const interval = setInterval(() => {
      setActiveTab(current => {
        const currentIndex = tabs.indexOf(current)
        const nextIndex = (currentIndex + 1) % tabs.length
        return tabs[nextIndex]
      })
    }, AUTO_ROTATE_INTERVAL)

    return () => clearInterval(interval)
  }, [autoRotate])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
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

  // Get health color based on score (1-5 scale)
  const getHealthColor = (score) => {
    if (score >= 4.0) return '#10B981' // Green - Excellent
    if (score >= 3.5) return '#22C55E' // Light green - Good
    if (score >= 3.0) return '#EAB308' // Yellow - Okay
    if (score >= 2.5) return '#F97316' // Orange - Needs attention
    return '#EF4444' // Red - Critical
  }

  // Get encouraging icon based on team's journey - no rankings!
  const getTeamIcon = (team, index) => {
    // Everyone gets recognition based on their strengths
    const momentum = team.kpis?.momentum || 0
    const completion = team.kpis?.completion || 0
    
    // High momentum = growing fast
    if (momentum >= 50) return '🚀'
    if (momentum >= 30) return '📈'
    if (momentum >= 15) return '⬆️'
    
    // High completion = delivering well
    if (completion >= 95) return '⭐'
    if (completion >= 80) return '✨'
    if (completion >= 60) return '💪'
    
    // Still contributing
    return '🌱'
  }

  // Get team strength description
  const getTeamStrength = (team) => {
    const momentum = team.kpis?.momentum || 0
    const completion = team.kpis?.completion || 0
    const predictability = team.kpis?.predictability || 0
    
    if (momentum >= 50) return 'Growing Fast'
    if (completion >= 95) return 'High Delivery'
    if (predictability >= 90) return 'Very Reliable'
    if (momentum >= 20) return 'Good Momentum'
    if (completion >= 80) return 'Solid Progress'
    if (predictability >= 50) return 'Steady Flow'
    if (momentum > 0) return 'Building Up'
    return 'Laying Foundation'
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
    <div className={`sprint-game ${isFullscreen ? 'fullscreen-mode' : ''}`} ref={containerRef}>
      <header className="sprint-game-header">
        <div className="header-content">
          <h1>🎮 Sprint Progress Game</h1>
          <p className="subtitle">Track team performance across sprints and earn rewards!</p>
        </div>
        
        {/* Office Screen Controls */}
        <div className="screen-controls">
          <button 
            className={`control-btn ${autoRotate ? 'active' : ''}`}
            onClick={() => setAutoRotate(!autoRotate)}
            title="Auto-rotate tabs every 25 seconds"
          >
            {autoRotate ? '⏸️ Pause' : '▶️ Auto-Rotate'}
          </button>
          <button 
            className="control-btn"
            onClick={toggleFullscreen}
            title="Toggle fullscreen for office display"
          >
            {isFullscreen ? '🔲 Exit Fullscreen' : '🖥️ Fullscreen'}
          </button>
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
          className={activeTab === 'badges' ? 'active' : ''} 
          onClick={() => setActiveTab('badges')}
        >
          🎖️ Badges
        </button>
        <button 
          className={activeTab === 'wellness' ? 'active' : ''} 
          onClick={() => setActiveTab('wellness')}
        >
          💚 Team Wellness
        </button>
        <button 
          className={activeTab === 'kpis' ? 'active' : ''} 
          onClick={() => setActiveTab('kpis')}
        >
          📊 KPIs
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
        {/* LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <section className="leaderboard-section">
            <h2>🤝 Team Contributions</h2>
            <p className="section-subtitle">Every team brings unique value to our shared goals</p>
            <div className="scoring-info inclusive-scoring">
              <h4>How Teams Grow:</h4>
              <div className="scoring-badges">
                <span className="score-badge positive">⭐ Delivery Excellence</span>
                <span className="score-badge positive">📈 Growth & Momentum</span>
                <span className="score-badge positive">🎯 Predictable Flow</span>
                <span className="score-badge neutral">🌱 Building Foundation</span>
              </div>
            </div>
            <div className="leaderboard-list">
              {analytics?.leaderboard?.map((team, index) => (
                <div 
                  key={team.name} 
                  className="leaderboard-item inclusive-item"
                  style={{ borderLeftColor: getTeamColor(team.name) }}
                  onClick={() => {
                    setSelectedTeam(team.name)
                    setActiveTab('teams')
                  }}
                >
                  <div className="team-icon">{getTeamIcon(team, index)}</div>
                  <div 
                    className="team-badge" 
                    style={{ backgroundColor: getTeamColor(team.name) }}
                  >
                    {team.name.charAt(0)}
                  </div>
                  <div className="team-info">
                    <span className="team-name">{team.name} Team</span>
                    <span className="team-strength">{getTeamStrength(team)}</span>
                    <span className="team-stats">
                      {team.featuresCompleted}/{team.totalFeatures} features contributed
                    </span>
                  </div>
                  <div className="team-kpis">
                    <div className="kpi-mini">
                      <span className="kpi-value">{team.kpis?.completion || 0}%</span>
                      <span className="kpi-label">Completion</span>
                    </div>
                    <div className="kpi-mini">
                      <span className={`kpi-value ${team.kpis?.momentum >= 0 ? 'positive' : 'negative'}`}>
                        {team.kpis?.momentum >= 0 ? '+' : ''}{team.kpis?.momentum || 0}
                      </span>
                      <span className="kpi-label">Momentum</span>
                    </div>
                    <div className="kpi-mini">
                      <span className="kpi-value">{team.kpis?.predictability || 0}%</span>
                      <span className="kpi-label">On-Time</span>
                    </div>
                  </div>
                  <div className="team-metrics">
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

        {/* BADGES TAB */}
        {activeTab === 'badges' && (
          <section className="badges-section">
            <h2>🎖️ Team Badges</h2>
            <div className="badges-grid">
              {/* Sprint Stars */}
              <div className="badge-category">
                <div className="badge-header">
                  <span className="badge-icon">⭐</span>
                  <h3>Sprint Stars</h3>
                  <p>Top 3 teams by points this sprint</p>
                </div>
                <div className="badge-winners">
                  {analytics?.badges?.sprintStars?.map((winner, index) => (
                    <div 
                      key={winner.team} 
                      className={`badge-winner rank-${index + 1}`}
                      style={{ borderColor: getTeamColor(winner.team) }}
                    >
                      <span className="winner-badge">{winner.badge}</span>
                      <div 
                        className="winner-avatar"
                        style={{ backgroundColor: getTeamColor(winner.team) }}
                      >
                        {winner.team.charAt(0)}
                      </div>
                      <div className="winner-info">
                        <span className="winner-name">{winner.team} Team</span>
                        <span className="winner-score">{winner.score} points</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comeback Crew */}
              <div className="badge-category">
                <div className="badge-header">
                  <span className="badge-icon">🚀</span>
                  <h3>Comeback Crew</h3>
                  <p>Biggest positive momentum week-over-week</p>
                </div>
                <div className="badge-winners">
                  {analytics?.badges?.comebackCrew?.map((winner, index) => (
                    <div 
                      key={winner.team} 
                      className={`badge-winner rank-${index + 1}`}
                      style={{ borderColor: getTeamColor(winner.team) }}
                    >
                      <span className="winner-badge">{winner.badge}</span>
                      <div 
                        className="winner-avatar"
                        style={{ backgroundColor: getTeamColor(winner.team) }}
                      >
                        {winner.team.charAt(0)}
                      </div>
                      <div className="winner-info">
                        <span className="winner-name">{winner.team} Team</span>
                        <span className="winner-score">+{winner.momentum}% momentum</span>
                      </div>
                    </div>
                  ))}
                  {(!analytics?.badges?.comebackCrew || analytics.badges.comebackCrew.length === 0) && (
                    <p className="no-winners">No teams with positive momentum yet</p>
                  )}
                </div>
              </div>

              {/* Predictability Pro */}
              <div className="badge-category">
                <div className="badge-header">
                  <span className="badge-icon">🎯</span>
                  <h3>Predictability Pro</h3>
                  <p>Highest on-time delivery rate</p>
                </div>
                <div className="badge-winners">
                  {analytics?.badges?.predictabilityPro?.map((winner, index) => (
                    <div 
                      key={winner.team} 
                      className={`badge-winner rank-${index + 1}`}
                      style={{ borderColor: getTeamColor(winner.team) }}
                    >
                      <span className="winner-badge">{winner.badge}</span>
                      <div 
                        className="winner-avatar"
                        style={{ backgroundColor: getTeamColor(winner.team) }}
                      >
                        {winner.team.charAt(0)}
                      </div>
                      <div className="winner-info">
                        <span className="winner-name">{winner.team} Team</span>
                        <span className="winner-score">{winner.predictability}% on-time</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blocker Buster */}
              <div className="badge-category">
                <div className="badge-header">
                  <span className="badge-icon">🔓</span>
                  <h3>Blocker Buster</h3>
                  <p>Most blockers cleared / quality gates passed</p>
                </div>
                <div className="badge-winners">
                  {analytics?.badges?.blockerBuster?.map((winner, index) => (
                    <div 
                      key={winner.team} 
                      className={`badge-winner rank-${index + 1}`}
                      style={{ borderColor: getTeamColor(winner.team) }}
                    >
                      <span className="winner-badge">{winner.badge}</span>
                      <div 
                        className="winner-avatar"
                        style={{ backgroundColor: getTeamColor(winner.team) }}
                      >
                        {winner.team.charAt(0)}
                      </div>
                      <div className="winner-info">
                        <span className="winner-name">{winner.team} Team</span>
                        <span className="winner-score">{winner.qualityScore} quality gates</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* WELLNESS TAB */}
        {activeTab === 'wellness' && (
          <section className="wellness-section">
            <h2>💚 Team Wellness Dashboard</h2>
            <p className="section-subtitle">Anonymous team health check-ins help us support each other better</p>
            
            {/* QR Code Banner */}
            <div className="qr-code-banner">
              <div className="qr-code-display">
                <div className="fake-qr">
                  <div className="qr-pattern">
                    {[...Array(7)].map((_, row) => (
                      <div key={row} className="qr-row">
                        {[...Array(7)].map((_, col) => (
                          <div 
                            key={col} 
                            className={`qr-cell ${(row + col) % 3 === 0 || (row === 0 || row === 6 || col === 0 || col === 6) ? 'filled' : ''}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="qr-info">
                <h3>📱 Scan to Check In</h3>
                <p>Team members can scan this QR code to anonymously share how they're feeling</p>
                <a href="/team-health" className="qr-link-btn" target="_blank">
                  Or click here to open the check-in form →
                </a>
              </div>
            </div>

            {/* Wellness Summary Cards */}
            <div className="wellness-summary-cards">
              <div className="wellness-card overall">
                <span className="wellness-icon">💚</span>
                <div className="wellness-stat">
                  <span className="wellness-value">{analytics?.teamWellness?.overallHealth?.toFixed(1) || '3.8'}</span>
                  <span className="wellness-label">Overall Health</span>
                </div>
                <span className="wellness-scale">/5.0</span>
              </div>
              <div className="wellness-card">
                <span className="wellness-icon">📝</span>
                <div className="wellness-stat">
                  <span className="wellness-value">{analytics?.teamWellness?.totalResponses || 156}</span>
                  <span className="wellness-label">Total Responses</span>
                </div>
              </div>
              <div className="wellness-card">
                <span className="wellness-icon">👥</span>
                <div className="wellness-stat">
                  <span className="wellness-value">12</span>
                  <span className="wellness-label">Teams Reporting</span>
                </div>
              </div>
              <div className="wellness-card">
                <span className="wellness-icon">📈</span>
                <div className="wellness-stat">
                  <span className="wellness-value trend-up">+0.6</span>
                  <span className="wellness-label">vs Last Sprint</span>
                </div>
              </div>
            </div>

            {/* Team Wellness Grid */}
            <div className="wellness-grid">
              <h3>Team Health Overview</h3>
              <div className="wellness-teams-list">
                {analytics?.teamWellness?.teams && Object.entries(analytics.teamWellness.teams)
                  .sort((a, b) => ((b[1].mood + b[1].teamMorale) / 2) - ((a[1].mood + a[1].teamMorale) / 2))
                  .map(([teamName, data]) => {
                    const avgScore = ((data.mood + data.teamMorale + data.collaboration + data.communication) / 4).toFixed(1)
                    return (
                      <div 
                        key={teamName} 
                        className="wellness-team-card"
                        style={{ borderLeftColor: getTeamColor(teamName) }}
                      >
                        <div className="wellness-team-header">
                          <div 
                            className="team-badge"
                            style={{ backgroundColor: getTeamColor(teamName) }}
                          >
                            {teamName.charAt(0)}
                          </div>
                          <div className="team-info">
                            <span className="team-name">{teamName} Team</span>
                            <span className="team-responses">{data.responses} responses</span>
                          </div>
                          <div className={`trend-indicator ${data.trend}`}>
                            {data.trend === 'up' ? '📈' : data.trend === 'down' ? '📉' : '➡️'}
                          </div>
                        </div>
                        <div className="wellness-metrics">
                          <div className="metric-row">
                            <span className="metric-name">😊 Mood</span>
                            <div className="metric-bar-container">
                              <div 
                                className="metric-bar" 
                                style={{ 
                                  width: `${(data.mood / 5) * 100}%`,
                                  backgroundColor: getHealthColor(data.mood)
                                }}
                              />
                            </div>
                            <span className="metric-value">{data.mood.toFixed(1)}</span>
                          </div>
                          <div className="metric-row">
                            <span className="metric-name">🤝 Team</span>
                            <div className="metric-bar-container">
                              <div 
                                className="metric-bar" 
                                style={{ 
                                  width: `${(data.teamMorale / 5) * 100}%`,
                                  backgroundColor: getHealthColor(data.teamMorale)
                                }}
                              />
                            </div>
                            <span className="metric-value">{data.teamMorale.toFixed(1)}</span>
                          </div>
                          <div className="metric-row">
                            <span className="metric-name">💬 Collab</span>
                            <div className="metric-bar-container">
                              <div 
                                className="metric-bar" 
                                style={{ 
                                  width: `${(data.collaboration / 5) * 100}%`,
                                  backgroundColor: getHealthColor(data.collaboration)
                                }}
                              />
                            </div>
                            <span className="metric-value">{data.collaboration.toFixed(1)}</span>
                          </div>
                          <div className="metric-row">
                            <span className="metric-name">⚖️ Balance</span>
                            <div className="metric-bar-container">
                              <div 
                                className="metric-bar" 
                                style={{ 
                                  width: `${(data.workLifeBalance / 5) * 100}%`,
                                  backgroundColor: getHealthColor(data.workLifeBalance)
                                }}
                              />
                            </div>
                            <span className="metric-value">{data.workLifeBalance.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="wellness-overall">
                          <span className="overall-label">Overall:</span>
                          <span 
                            className="overall-score"
                            style={{ color: getHealthColor(parseFloat(avgScore)) }}
                          >
                            {avgScore}
                          </span>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>

            {/* Sprint Wellness Trend */}
            <div className="wellness-trends">
              <h3>📈 Wellness Trends Over Sprints</h3>
              <div className="trend-chart">
                {analytics?.teamWellness?.sprintTrends && Object.entries(analytics.teamWellness.sprintTrends).map(([sprint, data]) => (
                  <div key={sprint} className="trend-column">
                    <div className="trend-bars">
                      <div 
                        className="trend-bar mood"
                        style={{ height: `${(data.mood / 5) * 100}%` }}
                        title={`Mood: ${data.mood}`}
                      />
                      <div 
                        className="trend-bar morale"
                        style={{ height: `${(data.morale / 5) * 100}%` }}
                        title={`Morale: ${data.morale}`}
                      />
                      <div 
                        className="trend-bar collab"
                        style={{ height: `${(data.collaboration / 5) * 100}%` }}
                        title={`Collaboration: ${data.collaboration}`}
                      />
                    </div>
                    <span className="trend-label">{sprint}</span>
                    <span className="trend-responses">{data.responses} 📝</span>
                  </div>
                ))}
              </div>
              <div className="trend-legend">
                <span className="legend-item"><span className="legend-color mood"></span> Mood</span>
                <span className="legend-item"><span className="legend-color morale"></span> Morale</span>
                <span className="legend-item"><span className="legend-color collab"></span> Collaboration</span>
              </div>
            </div>

            {/* Wellness Tips */}
            <div className="wellness-tips-panel">
              <h3>💡 Team Wellness Insights</h3>
              <div className="tips-grid">
                <div className="tip-card positive">
                  <span className="tip-icon">🌟</span>
                  <div className="tip-content">
                    <h4>Top Performing: Green Team</h4>
                    <p>Highest overall wellness score (4.3) with strong psychological safety</p>
                  </div>
                </div>
                <div className="tip-card attention">
                  <span className="tip-icon">⚠️</span>
                  <div className="tip-content">
                    <h4>Needs Support: Turquoise Team</h4>
                    <p>Lower blocker stress scores - may need help clearing impediments</p>
                  </div>
                </div>
                <div className="tip-card trending">
                  <span className="tip-icon">📈</span>
                  <div className="tip-content">
                    <h4>Trending Up: Blue Team</h4>
                    <p>Significant improvement in mood and confidence this sprint</p>
                  </div>
                </div>
                <div className="tip-card insight">
                  <span className="tip-icon">💡</span>
                  <div className="tip-content">
                    <h4>Organization-Wide</h4>
                    <p>Work-life balance is the lowest metric - consider workload review</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* KPIs TAB */}
        {activeTab === 'kpis' && (
          <section className="kpis-section">
            <h2>📊 Key Performance Indicators</h2>
            <div className="kpi-explanation">
              <div className="kpi-card">
                <h4>📈 Completion</h4>
                <p>Primary KPI - % of work done</p>
              </div>
              <div className="kpi-card">
                <h4>🚀 Momentum</h4>
                <p>Δ change from first sprint (S1) to latest sprint (S5 or IP)</p>
              </div>
              <div className="kpi-card">
                <h4>🎯 Predictability</h4>
                <p>% delivered by planned sprint and due date</p>
              </div>
              <div className="kpi-card">
                <h4>✅ Quality Gates</h4>
                <p>"Ready", "Ready for QA", "Blocked" transitions</p>
              </div>
            </div>
            
            <div className="kpi-table">
              <div className="kpi-table-header">
                <span>Team</span>
                <span>Completion</span>
                <span>Momentum</span>
                <span>Predictability</span>
                <span>Ready</span>
                <span>Ready for QA</span>
                <span>Score</span>
              </div>
              {analytics?.leaderboard?.map((team, index) => {
                const teamData = analytics.teamStats[team.name]
                return (
                  <div 
                    key={team.name} 
                    className="kpi-table-row"
                    style={{ borderLeftColor: getTeamColor(team.name) }}
                  >
                    <span className="team-cell">
                      <div 
                        className="team-avatar-small"
                        style={{ backgroundColor: getTeamColor(team.name) }}
                      >
                        {team.name.charAt(0)}
                      </div>
                      {team.name}
                    </span>
                    <span className={`kpi-cell ${team.kpis?.completion >= 95 ? 'excellent' : team.kpis?.completion >= 80 ? 'good' : 'needs-work'}`}>
                      {team.kpis?.completion || 0}%
                    </span>
                    <span className={`kpi-cell ${team.kpis?.momentum >= 20 ? 'excellent' : team.kpis?.momentum > 0 ? 'good' : 'needs-work'}`}>
                      {team.kpis?.momentum >= 0 ? '+' : ''}{team.kpis?.momentum || 0}
                    </span>
                    <span className={`kpi-cell ${team.kpis?.predictability >= 80 ? 'excellent' : team.kpis?.predictability >= 60 ? 'good' : 'needs-work'}`}>
                      {team.kpis?.predictability || 0}%
                    </span>
                    <span className="kpi-cell">
                      {teamData?.kpis?.qualityGates?.ready || 0}
                    </span>
                    <span className="kpi-cell">
                      {teamData?.kpis?.qualityGates?.readyForQA || 0}
                    </span>
                    <span className="kpi-cell score-cell">
                      {team.score}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* SPRINTS TAB */}
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

        {/* TEAMS TAB */}
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

                  <div className="team-kpi-row">
                    <div className="team-kpi">
                      <span className="kpi-icon">🚀</span>
                      <span className={team.kpis?.momentum >= 0 ? 'positive' : 'negative'}>
                        {team.kpis?.momentum >= 0 ? '+' : ''}{team.kpis?.momentum || 0}
                      </span>
                    </div>
                    <div className="team-kpi">
                      <span className="kpi-icon">🎯</span>
                      <span>{team.kpis?.predictability || 0}%</span>
                    </div>
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

        {/* BURNDOWN TAB */}
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

      {/* Auto-rotate indicator */}
      {autoRotate && (
        <div className="auto-rotate-indicator">
          <div className="rotate-progress"></div>
          <span>Auto-rotating in 25s</span>
        </div>
      )}
    </div>
  )
}

export default SprintGame
