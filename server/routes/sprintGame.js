const express = require('express');
const router = express.Router();
const path = require('path');
const { getSprintAnalytics } = require('../utils/sprintDataParser');

const CSV_PATH = path.join(__dirname, '../../data/Sanitized_data.csv');

/**
 * Get full sprint analytics
 * GET /api/sprint-game
 */
router.get('/', async (req, res) => {
  try {
    const analytics = getSprintAnalytics(CSV_PATH);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching sprint analytics:', error);
    res.status(500).json({ message: 'Error fetching sprint data', error: error.message });
  }
});

/**
 * Get leaderboard
 * GET /api/sprint-game/leaderboard
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const analytics = getSprintAnalytics(CSV_PATH);
    res.json({
      leaderboard: analytics.leaderboard,
      summary: analytics.summary
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ message: 'Error fetching leaderboard', error: error.message });
  }
});

/**
 * Get team statistics
 * GET /api/sprint-game/teams
 */
router.get('/teams', async (req, res) => {
  try {
    const analytics = getSprintAnalytics(CSV_PATH);
    res.json({
      teams: analytics.teamStats,
      summary: analytics.summary
    });
  } catch (error) {
    console.error('Error fetching team stats:', error);
    res.status(500).json({ message: 'Error fetching team statistics', error: error.message });
  }
});

/**
 * Get specific team statistics
 * GET /api/sprint-game/teams/:teamName
 */
router.get('/teams/:teamName', async (req, res) => {
  try {
    const analytics = getSprintAnalytics(CSV_PATH);
    const teamName = req.params.teamName;
    const team = analytics.teamStats[teamName];
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    
    // Get features for this team
    const teamFeatures = analytics.features.filter(f => f.teamName === teamName);
    
    res.json({
      team,
      features: teamFeatures,
      rank: analytics.leaderboard.findIndex(t => t.name === teamName) + 1
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ message: 'Error fetching team', error: error.message });
  }
});

/**
 * Get sprint progress over time (for burndown charts)
 * GET /api/sprint-game/progress
 */
router.get('/progress', async (req, res) => {
  try {
    const analytics = getSprintAnalytics(CSV_PATH);
    res.json({
      sprintProgress: analytics.sprintProgress,
      summary: analytics.summary
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ message: 'Error fetching progress', error: error.message });
  }
});

/**
 * Get persona statistics
 * GET /api/sprint-game/personas
 */
router.get('/personas', async (req, res) => {
  try {
    const analytics = getSprintAnalytics(CSV_PATH);
    res.json({
      personas: analytics.personaStats
    });
  } catch (error) {
    console.error('Error fetching personas:', error);
    res.status(500).json({ message: 'Error fetching personas', error: error.message });
  }
});

/**
 * Get features by status
 * GET /api/sprint-game/features?status=completed|in-progress|not-started
 */
router.get('/features', async (req, res) => {
  try {
    const analytics = getSprintAnalytics(CSV_PATH);
    let features = analytics.features;
    
    const status = req.query.status;
    if (status === 'completed') {
      features = features.filter(f => f.currentCompletion === 100);
    } else if (status === 'in-progress') {
      features = features.filter(f => f.currentCompletion > 0 && f.currentCompletion < 100);
    } else if (status === 'not-started') {
      features = features.filter(f => f.currentCompletion === 0);
    }
    
    const team = req.query.team;
    if (team) {
      features = features.filter(f => f.teamName === team);
    }
    
    res.json({
      features,
      count: features.length
    });
  } catch (error) {
    console.error('Error fetching features:', error);
    res.status(500).json({ message: 'Error fetching features', error: error.message });
  }
});

module.exports = router;
