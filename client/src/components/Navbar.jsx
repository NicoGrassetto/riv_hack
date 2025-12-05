import { Link } from 'react-router-dom'
import { FaTrophy, FaMedal, FaFire, FaUser, FaGamepad, FaAward } from 'react-icons/fa'
import './Navbar.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <FaTrophy className="brand-icon" />
          <span>NMBS Gamify</span>
        </Link>
        
        <div className="navbar-links">
          <Link to="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link to="/sprint-game" className="nav-link sprint-game-link">
            <FaGamepad /> Sprint Game
          </Link>
          <Link to="/badges" className="nav-link badges-link">
            <FaAward /> Badges
          </Link>
          <Link to="/achievements" className="nav-link">
            <FaTrophy /> Achievements
          </Link>
          <Link to="/challenges" className="nav-link">
            <FaFire /> Challenges
          </Link>
          <Link to="/leaderboard" className="nav-link">
            <FaMedal /> Leaderboard
          </Link>
          <Link to="/profile" className="nav-link">
            <FaUser /> Profile
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
