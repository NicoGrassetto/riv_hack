import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
}

// Users API
export const usersAPI = {
  getUser: (userId) => api.get(`/users/${userId}`),
  updateProfile: (data) => api.put('/users/profile', data),
  getUserActivities: (userId, page = 1, limit = 20) => 
    api.get(`/users/${userId}/activities`, { params: { page, limit } }),
  addPoints: (data) => api.post('/users/points', data),
  getLeaderboard: (limit = 10, timeframe = 'all') => 
    api.get('/users/leaderboard/top', { params: { limit, timeframe } }),
}

// Achievements API
export const achievementsAPI = {
  getAll: () => api.get('/achievements'),
  getMyProgress: () => api.get('/achievements/my-progress'),
  checkAchievements: () => api.post('/achievements/check'),
  create: (data) => api.post('/achievements', data),
}

// Badges API
export const badgesAPI = {
  getAll: () => api.get('/badges'),
  getMyBadges: () => api.get('/badges/my-badges'),
  create: (data) => api.post('/badges', data),
}

// Challenges API
export const challengesAPI = {
  getAll: (type) => api.get('/challenges', { params: { type } }),
  getMyChallenges: () => api.get('/challenges/my-challenges'),
  join: (challengeId) => api.post(`/challenges/${challengeId}/join`),
  updateProgress: (challengeId, progress) => 
    api.post(`/challenges/${challengeId}/progress`, { progress }),
  create: (data) => api.post('/challenges', data),
}

// Sprint Game API - For real-time sprint progress gamification
export const sprintGameAPI = {
  getAnalytics: () => api.get('/sprint-game'),
  getLeaderboard: () => api.get('/sprint-game/leaderboard'),
  getTeams: () => api.get('/sprint-game/teams'),
  getTeam: (teamName) => api.get(`/sprint-game/teams/${encodeURIComponent(teamName)}`),
  getProgress: () => api.get('/sprint-game/progress'),
  getPersonas: () => api.get('/sprint-game/personas'),
  getFeatures: (params) => api.get('/sprint-game/features', { params }),
}

export default api
