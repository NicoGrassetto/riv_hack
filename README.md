# 🎮 NMBS Gamify - Comprehensive Gamification Platform

A full-stack gamification platform with achievements, points, leaderboards, badges, challenges, and user progression tracking.

## 🌟 Features

### Core Gamification Elements
- **Points System**: Earn points for various activities and track your total score
- **Levels & Experience**: Progress through levels by earning experience points
- **Achievements**: Unlock achievements by completing specific tasks and milestones
- **Badges**: Collect unique badges as rewards for achievements
- **Leaderboard**: Compete with other users and climb the rankings
- **Challenges**: Join daily, weekly, and monthly challenges for extra rewards
- **Streaks**: Maintain login streaks to earn bonus points and achievements
- **User Profiles**: Personalized profiles with stats and progress tracking

### Technical Features
- **User Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **RESTful API**: Clean, organized API with proper error handling
- **Real-time Updates**: Dynamic data updates using React Query
- **Responsive Design**: Mobile-friendly UI that works on all devices
- **Activity Tracking**: Comprehensive logging of user actions and progress
- **Progress Visualization**: Beautiful progress bars and visual indicators

## 🛠️ Tech Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logging
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **TanStack Query** (React Query) - Data fetching and caching
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Vite** - Fast build tool and dev server

## 📁 Project Structure

```
NMBS_Gamify/
├── server/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── models/
│   │   ├── User.js              # User schema with gamification
│   │   ├── Achievement.js       # Achievement definitions
│   │   ├── Badge.js             # Badge definitions
│   │   ├── Activity.js          # Activity logging
│   │   └── Challenge.js         # Challenge definitions
│   ├── routes/
│   │   ├── auth.js              # Authentication routes
│   │   ├── users.js             # User management & leaderboard
│   │   ├── achievements.js      # Achievement tracking
│   │   ├── badges.js            # Badge management
│   │   └── challenges.js        # Challenge management
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── errorHandler.js      # Global error handling
│   └── index.js                 # Server entry point
├── client/
│   ├── src/
│   │   ├── api/
│   │   │   └── api.js           # API client & endpoints
│   │   ├── components/
│   │   │   └── Navbar.jsx       # Navigation component
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Login page
│   │   │   ├── Register.jsx     # Registration page
│   │   │   ├── Dashboard.jsx    # Main dashboard
│   │   │   ├── Achievements.jsx # Achievements page
│   │   │   ├── Leaderboard.jsx  # Leaderboard page
│   │   │   ├── Challenges.jsx   # Challenges page
│   │   │   └── Profile.jsx      # User profile page
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── seed.js                      # Database seeding script
├── package.json
├── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```powershell
cd c:\temp\NMBS_Gamify
```

2. **Install server dependencies**
```powershell
npm install
```

3. **Install client dependencies**
```powershell
cd client
npm install
cd ..
```

4. **Set up environment variables**
```powershell
# Copy the example env file
Copy-Item .env.example .env

# Edit .env and update these values:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (a strong secret key)
# - CLIENT_URL (default: http://localhost:3000)
```

5. **Start MongoDB**
```powershell
# If using local MongoDB
# Make sure MongoDB service is running

# If using MongoDB Atlas
# Just ensure your connection string in .env is correct
```

6. **Seed the database** (Optional but recommended)
```powershell
node seed.js
```

7. **Start the development servers**

**Option A: Run both servers concurrently**
```powershell
npm run dev-all
```

**Option B: Run servers separately**

Terminal 1 (Backend):
```powershell
npm run dev
```

Terminal 2 (Frontend):
```powershell
npm run client
```

8. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:userId/activities` - Get user activities
- `POST /api/users/points` - Add points to user
- `GET /api/users/leaderboard/top` - Get leaderboard

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/my-progress` - Get user's achievement progress
- `POST /api/achievements/check` - Check and award achievements
- `POST /api/achievements` - Create achievement (admin)

### Badges
- `GET /api/badges` - Get all badges
- `GET /api/badges/my-badges` - Get user's badges
- `POST /api/badges` - Create badge (admin)

### Challenges
- `GET /api/challenges` - Get all active challenges
- `GET /api/challenges/my-challenges` - Get user's challenges
- `POST /api/challenges/:challengeId/join` - Join a challenge
- `POST /api/challenges/:challengeId/progress` - Update challenge progress
- `POST /api/challenges` - Create challenge (admin)

## 🎨 Key Components

### User Gamification Data Structure
```javascript
{
  totalPoints: Number,
  level: Number,
  experience: Number,
  badges: [{ badgeId, earnedAt }],
  achievements: [{ achievementId, progress, completed, completedAt }],
  streak: {
    current: Number,
    longest: Number,
    lastActivity: Date
  }
}
```

### Achievement Criteria Types
- `points` - Based on total points earned
- `activities` - Based on activities completed
- `streak` - Based on login streak
- `level` - Based on user level
- `challenges` - Based on challenges completed
- `custom` - Custom criteria

### Challenge Types
- `daily` - 24-hour challenges
- `weekly` - 7-day challenges
- `monthly` - 30-day challenges
- `special` - Limited-time events

### Badge Rarities
- `common` - Easy to obtain
- `rare` - Moderate difficulty
- `epic` - Challenging to earn
- `legendary` - Extremely difficult

## 📊 Seeded Data

The `seed.js` script populates the database with:
- **5 Badges**: Including Welcome Badge, Point Master, and Streak Master
- **9 Achievements**: From beginner to master level
- **6 Challenges**: Daily, weekly, monthly, and special challenges

## 🔐 Security Features

- JWT-based authentication with 7-day expiration
- Password hashing with bcryptjs (10 rounds)
- Helmet.js security headers
- CORS protection
- Input validation with express-validator
- Protected routes with authentication middleware

## 🎮 Usage Flow

1. **Register/Login** - Create an account or sign in
2. **Explore Dashboard** - View your stats, progress, and recent activity
3. **Complete Activities** - Earn points and experience
4. **Unlock Achievements** - Complete tasks to unlock achievements
5. **Join Challenges** - Participate in challenges for extra rewards
6. **Earn Badges** - Collect badges as you progress
7. **Climb Leaderboard** - Compete with other users for top positions
8. **Level Up** - Gain experience and reach higher levels

## 🔄 Level Calculation

The level is calculated based on experience points:
```javascript
Level = floor(sqrt(experience / 100)) + 1
```

Example progression:
- Level 1: 0 XP
- Level 2: 100 XP
- Level 3: 400 XP
- Level 4: 900 XP
- Level 5: 1,600 XP

## 📈 Customization

### Adding New Achievements
Edit `seed.js` or use the API:
```javascript
POST /api/achievements
{
  "name": "Custom Achievement",
  "description": "Description here",
  "icon": "🎯",
  "category": "intermediate",
  "criteria": {
    "type": "points",
    "target": 500
  },
  "rewards": {
    "points": 100
  },
  "rarity": "rare"
}
```

### Creating Custom Challenges
```javascript
POST /api/challenges
{
  "title": "Custom Challenge",
  "description": "Challenge description",
  "type": "weekly",
  "difficulty": "medium",
  "requirements": "Requirements text",
  "rewards": {
    "points": 200,
    "experience": 100
  },
  "startDate": "2024-01-01",
  "endDate": "2024-01-08"
}
```

## 🧪 Testing

You can test the API using:
- **Postman** - Import the API endpoints
- **Thunder Client** (VS Code extension)
- **curl** commands
- **Built-in frontend** - The React app provides a complete UI

## 📝 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/nmbs_gamify

# JWT
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# CORS
CLIENT_URL=http://localhost:3000
```

## 🚧 Future Enhancements

- [ ] Real-time notifications for achievements
- [ ] Social features (friends, teams)
- [ ] Custom avatars and profile customization
- [ ] Admin dashboard for managing content
- [ ] Analytics and reporting
- [ ] Quest system with storylines
- [ ] Virtual currency and rewards shop
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Export user data and statistics

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs!

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🆘 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `net start MongoDB` (Windows)
- Check connection string in `.env`
- For MongoDB Atlas, whitelist your IP address

### Port Already in Use
```powershell
# Change port in .env or kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Dependencies Issues
```powershell
# Clear and reinstall
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

## 📧 Support

For questions or issues, please create an issue in the repository.

---

**Built with ❤️ using the MERN stack**
