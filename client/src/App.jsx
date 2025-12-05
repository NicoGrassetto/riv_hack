import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Achievements from './pages/Achievements'
import Leaderboard from './pages/Leaderboard'
import Challenges from './pages/Challenges'
import Profile from './pages/Profile'
import SprintGame from './pages/SprintGame'
import BadgeCatalogue from './pages/BadgeCatalogue'
import TeamHealthCheckin from './pages/TeamHealthCheckin'

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/badges" element={<BadgeCatalogue />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/sprint-game" element={<SprintGame />} />
        <Route path="/team-health" element={<TeamHealthCheckin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}

export default App
