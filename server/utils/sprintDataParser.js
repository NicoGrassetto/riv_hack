const fs = require('fs');
const path = require('path');

/**
 * Scoring Configuration - Configurable weights for gamification
 */
const SCORING_CONFIG = {
  // Points for completion thresholds
  COMPLETED_BONUS: 10,           // +10 for ≥95% completion
  ON_TRACK_BONUS: 5,             // +5 for ≥80% and future due
  MOMENTUM_BONUS: 3,             // +3 for momentum ≥+20
  NO_PROGRESS_PENALTY: -2,       // -2 for ≤0 momentum
  
  // Thresholds
  COMPLETED_THRESHOLD: 95,
  ON_TRACK_THRESHOLD: 80,
  MOMENTUM_THRESHOLD: 20,
  
  // Base score multipliers
  COMPLETION_MULTIPLIER: 10,
  FEATURE_COMPLETE_BONUS: 50,
  IN_PROGRESS_BONUS: 10,
  VELOCITY_IMPROVEMENT_BONUS: 5,
  
  // Quality gate bonuses
  READY_STATUS_BONUS: 2,
  READY_FOR_QA_BONUS: 3,
  BLOCKER_CLEARED_BONUS: 5
};

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
        priorities: {},
        // New KPI metrics
        kpis: {
          completion: 0,
          momentum: 0,
          predictability: 0,
          qualityGates: { ready: 0, readyForQA: 0, blocked: 0, cleared: 0 }
        },
        // For momentum calculation
        firstSprintValues: [],
        latestSprintValues: [],
        // For predictability
        onTimeDeliveries: 0,
        plannedDeliveries: 0
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
    
    // Track momentum (first to latest sprint)
    const sprintValues = Object.entries(feature.sprintProgress)
      .filter(([key, val]) => val !== null && key !== 'IP')
      .map(([key, val]) => ({ sprint: key, value: val }));
    
    if (sprintValues.length > 0) {
      stats.firstSprintValues.push(sprintValues[0].value);
      stats.latestSprintValues.push(sprintValues[sprintValues.length - 1].value);
    }
    
    // Track quality gates
    const status = feature.initialStatus?.toLowerCase() || '';
    if (status.includes('ready for qa')) {
      stats.kpis.qualityGates.readyForQA++;
    } else if (status.includes('ready')) {
      stats.kpis.qualityGates.ready++;
    }
    if (status.includes('blocked')) {
      stats.kpis.qualityGates.blocked++;
    }
    
    // Track predictability (on-time delivery)
    if (feature.plannedDeliverySprint && feature.plannedDeliverySprint !== 'UNC') {
      stats.plannedDeliveries++;
      // Consider delivered on time if completion >= 95% by planned sprint
      if (feature.currentCompletion >= 95) {
        stats.onTimeDeliveries++;
      }
    }
  });
  
  // Calculate averages and KPIs
  Object.values(teamStats).forEach(stats => {
    stats.averageCompletion = stats.totalFeatures > 0 
      ? Math.round(stats.totalCompletion / stats.totalFeatures) 
      : 0;
    
    // Calculate average sprint velocity
    Object.keys(stats.sprintVelocity).forEach(sprint => {
      const sv = stats.sprintVelocity[sprint];
      sv.average = sv.count > 0 ? Math.round(sv.total / sv.count) : 0;
    });
    
    // KPI: Completion (primary) - % done
    stats.kpis.completion = stats.averageCompletion;
    
    // KPI: Momentum - Δ from first to latest sprint
    if (stats.firstSprintValues.length > 0 && stats.latestSprintValues.length > 0) {
      const avgFirst = stats.firstSprintValues.reduce((a, b) => a + b, 0) / stats.firstSprintValues.length;
      const avgLatest = stats.latestSprintValues.reduce((a, b) => a + b, 0) / stats.latestSprintValues.length;
      stats.kpis.momentum = Math.round(avgLatest - avgFirst);
    }
    
    // KPI: Predictability - % delivered by planned sprint
    stats.kpis.predictability = stats.plannedDeliveries > 0
      ? Math.round((stats.onTimeDeliveries / stats.plannedDeliveries) * 100)
      : 0;
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
      scoreBreakdown: getScoreBreakdown(team),
      completionRate: team.averageCompletion,
      featuresCompleted: team.completedFeatures,
      totalFeatures: team.totalFeatures,
      kpis: team.kpis
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Get score breakdown for transparency
 */
function getScoreBreakdown(team) {
  const breakdown = {
    completionPoints: 0,
    onTrackPoints: 0,
    momentumPoints: 0,
    qualityPoints: 0,
    penalties: 0
  };
  
  // +10 for ≥95% completion
  if (team.averageCompletion >= SCORING_CONFIG.COMPLETED_THRESHOLD) {
    breakdown.completionPoints = SCORING_CONFIG.COMPLETED_BONUS;
  }
  // +5 for ≥80% (on-track)
  else if (team.averageCompletion >= SCORING_CONFIG.ON_TRACK_THRESHOLD) {
    breakdown.onTrackPoints = SCORING_CONFIG.ON_TRACK_BONUS;
  }
  
  // +3 for momentum ≥+20
  if (team.kpis.momentum >= SCORING_CONFIG.MOMENTUM_THRESHOLD) {
    breakdown.momentumPoints = SCORING_CONFIG.MOMENTUM_BONUS;
  }
  // -2 for no progress (≤0 momentum)
  else if (team.kpis.momentum <= 0) {
    breakdown.penalties = SCORING_CONFIG.NO_PROGRESS_PENALTY;
  }
  
  // Quality gate bonuses
  breakdown.qualityPoints = 
    (team.kpis.qualityGates.ready * SCORING_CONFIG.READY_STATUS_BONUS) +
    (team.kpis.qualityGates.readyForQA * SCORING_CONFIG.READY_FOR_QA_BONUS);
  
  return breakdown;
}

/**
 * Calculate team score for gamification (enhanced with new rubric)
 */
function calculateTeamScore(team) {
  let score = 0;
  
  // Base score from completion percentage
  score += team.averageCompletion * SCORING_CONFIG.COMPLETION_MULTIPLIER;
  
  // Bonus for completed features
  score += team.completedFeatures * SCORING_CONFIG.FEATURE_COMPLETE_BONUS;
  
  // Bonus for in-progress features
  score += team.inProgressFeatures * SCORING_CONFIG.IN_PROGRESS_BONUS;
  
  // Apply the new scoring rubric
  const breakdown = getScoreBreakdown(team);
  score += breakdown.completionPoints;
  score += breakdown.onTrackPoints;
  score += breakdown.momentumPoints;
  score += breakdown.qualityPoints;
  score += breakdown.penalties;
  
  // Velocity bonus - improvement over sprints
  const velocities = Object.values(team.sprintVelocity)
    .map(s => s.average)
    .filter(v => v > 0);
  
  if (velocities.length >= 2) {
    const improvement = velocities[velocities.length - 1] - velocities[0];
    if (improvement > 0) {
      score += improvement * SCORING_CONFIG.VELOCITY_IMPROVEMENT_BONUS;
    }
  }
  
  // Predictability bonus
  if (team.kpis.predictability >= 80) {
    score += 10;
  } else if (team.kpis.predictability >= 60) {
    score += 5;
  }
  
  return Math.round(score);
}

/**
 * Calculate badges for teams
 */
function calculateBadges(teamStats, leaderboard) {
  const badges = {
    sprintStars: [],      // Top 3 teams by points
    comebackCrew: [],     // Biggest positive momentum
    predictabilityPro: [], // Highest on-time delivery
    blockerBuster: []     // Most blockers cleared (simulated)
  };
  
  // Sprint Stars: Top 3 teams by points
  badges.sprintStars = leaderboard.slice(0, 3).map((team, index) => ({
    team: team.name,
    rank: index + 1,
    score: team.score,
    badge: index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'
  }));
  
  // Comeback Crew: Biggest positive momentum
  const sortedByMomentum = Object.values(teamStats)
    .filter(t => t.kpis.momentum > 0)
    .sort((a, b) => b.kpis.momentum - a.kpis.momentum)
    .slice(0, 3);
  
  badges.comebackCrew = sortedByMomentum.map((team, index) => ({
    team: team.name,
    momentum: team.kpis.momentum,
    rank: index + 1,
    badge: '🚀'
  }));
  
  // Predictability Pro: Highest on-time delivery rate
  const sortedByPredictability = Object.values(teamStats)
    .filter(t => t.kpis.predictability > 0)
    .sort((a, b) => b.kpis.predictability - a.kpis.predictability)
    .slice(0, 3);
  
  badges.predictabilityPro = sortedByPredictability.map((team, index) => ({
    team: team.name,
    predictability: team.kpis.predictability,
    rank: index + 1,
    badge: '🎯'
  }));
  
  // Blocker Buster: Teams with most "Ready" or "Ready for QA" transitions
  const sortedByQuality = Object.values(teamStats)
    .map(t => ({
      ...t,
      qualityScore: t.kpis.qualityGates.ready + t.kpis.qualityGates.readyForQA
    }))
    .filter(t => t.qualityScore > 0)
    .sort((a, b) => b.qualityScore - a.qualityScore)
    .slice(0, 3);
  
  badges.blockerBuster = sortedByQuality.map((team, index) => ({
    team: team.name,
    qualityScore: team.qualityScore,
    rank: index + 1,
    badge: '🔓'
  }));
  
  return badges;
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
  const badges = calculateBadges(teamStats, leaderboard);
  
  return {
    features,
    teamStats,
    personaStats,
    sprintProgress,
    leaderboard,
    badges,
    scoringConfig: SCORING_CONFIG,
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
  calculateBadges,
  getSprintAnalytics,
  SCORING_CONFIG
};
