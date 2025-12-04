const fs = require('fs');
const path = require('path');

/**
 * Parse the sprint data CSV file and extract gamification metrics
 */
function parseSprintData(csvPath) {
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').filter(line => line.trim());
  
  // Parse header
  const headers = lines[0].split(';').map(h => h.trim());
  
  // Parse data rows
  const features = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(';');
    if (values.length < 11) continue;
    
    const feature = {
      teamName: values[0]?.trim() || '',
      priority: parseInt(values[1]) || 0,
      type: values[2]?.trim() || '',
      featureName: values[3]?.trim() || '',
      epicOwner: values[4]?.trim() || '',
      scope: values[5]?.trim() || '',
      initialStatus: values[6]?.trim() || '',
      plannedDeliverySprint: values[7]?.trim() || '',
      plannedDueDate: values[8]?.trim() || '',
      comments: values[9]?.trim() || '',
      currentCompletion: parseInt(values[10]) || 0,
      sprintProgress: {
        S1: parseInt(values[11]) || null,
        S2: parseInt(values[12]) || null,
        S3: parseInt(values[13]) || null,
        S4: parseInt(values[14]) || null,
        S5: parseInt(values[15]) || null,
        IP: parseInt(values[16]) || null
      }
    };
    
    features.push(feature);
  }
  
  return features;
}

/**
 * Calculate team statistics from parsed data
 */
function calculateTeamStats(features) {
  const teamStats = {};
  
  features.forEach(feature => {
    const team = feature.teamName;
    if (!team) return;
    
    if (!teamStats[team]) {
      teamStats[team] = {
        name: team,
        totalFeatures: 0,
        completedFeatures: 0,
        inProgressFeatures: 0,
        averageCompletion: 0,
        totalCompletion: 0,
        sprintVelocity: {
          S1: { total: 0, count: 0 },
          S2: { total: 0, count: 0 },
          S3: { total: 0, count: 0 },
          S4: { total: 0, count: 0 },
          S5: { total: 0, count: 0 }
        },
        featureTypes: { Story: 0, Feature: 0 },
        priorities: {}
      };
    }
    
    const stats = teamStats[team];
    stats.totalFeatures++;
    stats.totalCompletion += feature.currentCompletion;
    
    if (feature.currentCompletion === 100) {
      stats.completedFeatures++;
    } else if (feature.currentCompletion > 0) {
      stats.inProgressFeatures++;
    }
    
    // Track feature types
    if (feature.type === 'Story') stats.featureTypes.Story++;
    if (feature.type === 'Feature') stats.featureTypes.Feature++;
    
    // Track priorities
    const priority = feature.priority;
    stats.priorities[priority] = (stats.priorities[priority] || 0) + 1;
    
    // Calculate sprint velocity
    Object.keys(feature.sprintProgress).forEach(sprint => {
      if (feature.sprintProgress[sprint] !== null && sprint !== 'IP') {
        stats.sprintVelocity[sprint].total += feature.sprintProgress[sprint];
        stats.sprintVelocity[sprint].count++;
      }
    });
  });
  
  // Calculate averages
  Object.values(teamStats).forEach(stats => {
    stats.averageCompletion = stats.totalFeatures > 0 
      ? Math.round(stats.totalCompletion / stats.totalFeatures) 
      : 0;
    
    // Calculate average sprint velocity
    Object.keys(stats.sprintVelocity).forEach(sprint => {
      const sv = stats.sprintVelocity[sprint];
      sv.average = sv.count > 0 ? Math.round(sv.total / sv.count) : 0;
    });
  });
  
  return teamStats;
}

/**
 * Calculate persona statistics
 */
function calculatePersonaStats(features) {
  const personaStats = {};
  
  features.forEach(feature => {
    const persona = feature.epicOwner?.trim();
    if (!persona) return;
    
    if (!personaStats[persona]) {
      personaStats[persona] = {
        name: persona,
        totalFeatures: 0,
        completedFeatures: 0,
        averageCompletion: 0,
        totalCompletion: 0,
        teams: new Set()
      };
    }
    
    const stats = personaStats[persona];
    stats.totalFeatures++;
    stats.totalCompletion += feature.currentCompletion;
    
    if (feature.currentCompletion === 100) {
      stats.completedFeatures++;
    }
    
    if (feature.teamName) {
      stats.teams.add(feature.teamName);
    }
  });
  
  // Calculate averages and convert sets
  Object.values(personaStats).forEach(stats => {
    stats.averageCompletion = stats.totalFeatures > 0 
      ? Math.round(stats.totalCompletion / stats.totalFeatures) 
      : 0;
    stats.teams = Array.from(stats.teams);
  });
  
  return personaStats;
}

/**
 * Calculate overall sprint progress across all teams
 */
function calculateSprintProgress(features) {
  const sprints = {
    S1: { date: '14-Oct', total: 0, count: 0, average: 0 },
    S2: { date: '28-Oct', total: 0, count: 0, average: 0 },
    S3: { date: '12-Nov', total: 0, count: 0, average: 0 },
    S4: { date: '25-Nov', total: 0, count: 0, average: 0 },
    S5: { date: '9-Dec', total: 0, count: 0, average: 0 }
  };
  
  features.forEach(feature => {
    Object.keys(sprints).forEach(sprint => {
      const value = feature.sprintProgress[sprint];
      if (value !== null && !isNaN(value)) {
        sprints[sprint].total += value;
        sprints[sprint].count++;
      }
    });
  });
  
  Object.values(sprints).forEach(sprint => {
    sprint.average = sprint.count > 0 ? Math.round(sprint.total / sprint.count) : 0;
  });
  
  return sprints;
}

/**
 * Generate leaderboard data
 */
function generateLeaderboard(teamStats) {
  return Object.values(teamStats)
    .map(team => ({
      name: team.name,
      score: calculateTeamScore(team),
      completionRate: team.averageCompletion,
      featuresCompleted: team.completedFeatures,
      totalFeatures: team.totalFeatures
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Calculate team score for gamification
 */
function calculateTeamScore(team) {
  // Base score from completion percentage
  let score = team.averageCompletion * 10;
  
  // Bonus for completed features
  score += team.completedFeatures * 50;
  
  // Bonus for high-priority completions (would need more data)
  score += team.inProgressFeatures * 10;
  
  // Velocity bonus - improvement over sprints
  const velocities = Object.values(team.sprintVelocity)
    .map(s => s.average)
    .filter(v => v > 0);
  
  if (velocities.length >= 2) {
    const improvement = velocities[velocities.length - 1] - velocities[0];
    if (improvement > 0) {
      score += improvement * 5; // Bonus for improvement
    }
  }
  
  return Math.round(score);
}

/**
 * Get all sprint data analytics
 */
function getSprintAnalytics(csvPath) {
  const features = parseSprintData(csvPath);
  const teamStats = calculateTeamStats(features);
  const personaStats = calculatePersonaStats(features);
  const sprintProgress = calculateSprintProgress(features);
  const leaderboard = generateLeaderboard(teamStats);
  
  return {
    features,
    teamStats,
    personaStats,
    sprintProgress,
    leaderboard,
    summary: {
      totalFeatures: features.length,
      totalTeams: Object.keys(teamStats).length,
      totalPersonas: Object.keys(personaStats).length,
      overallCompletion: Math.round(
        features.reduce((sum, f) => sum + f.currentCompletion, 0) / features.length
      ),
      completedFeatures: features.filter(f => f.currentCompletion === 100).length,
      inProgressFeatures: features.filter(f => f.currentCompletion > 0 && f.currentCompletion < 100).length,
      notStartedFeatures: features.filter(f => f.currentCompletion === 0).length
    }
  };
}

module.exports = {
  parseSprintData,
  calculateTeamStats,
  calculatePersonaStats,
  calculateSprintProgress,
  generateLeaderboard,
  getSprintAnalytics
};
