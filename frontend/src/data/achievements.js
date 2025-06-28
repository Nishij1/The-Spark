// Achievement definitions and logic
export const ACHIEVEMENT_DEFINITIONS = [
  // Beginner Achievements
  {
    id: 'first_project',
    title: 'First Steps',
    description: 'Create your first project',
    iconName: 'star',
    points: 10,
    category: 'beginner',
    condition: (stats, projects) => projects.length >= 1
  },
  {
    id: 'first_completion',
    title: 'Finisher',
    description: 'Complete your first project',
    iconName: 'trophy',
    points: 25,
    category: 'beginner',
    condition: (stats, projects) => (stats?.completedProjects || 0) >= 1
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete a project within 24 hours of creation',
    iconName: 'clock',
    points: 20,
    category: 'speed',
    condition: (stats, projects) => {
      return projects.some(project => {
        if (project.status === 'completed' && project.createdAt && project.updatedAt) {
          const created = new Date(project.createdAt);
          const completed = new Date(project.updatedAt);
          const hoursDiff = (completed - created) / (1000 * 60 * 60);
          return hoursDiff <= 24;
        }
        return false;
      });
    }
  },

  // Progress Achievements
  {
    id: 'project_streak_3',
    title: 'Getting Started',
    description: 'Complete 3 projects',
    iconName: 'target',
    points: 30,
    category: 'progress',
    condition: (stats, projects) => (stats?.completedProjects || 0) >= 3
  },
  {
    id: 'project_streak_5',
    title: 'Momentum Builder',
    description: 'Complete 5 projects',
    iconName: 'zap',
    points: 50,
    category: 'progress',
    condition: (stats, projects) => (stats?.completedProjects || 0) >= 5
  },
  {
    id: 'project_streak_10',
    title: 'Dedicated Learner',
    description: 'Complete 10 projects',
    iconName: 'award',
    points: 75,
    category: 'progress',
    condition: (stats, projects) => (stats?.completedProjects || 0) >= 10
  },
  {
    id: 'project_streak_25',
    title: 'Expert Builder',
    description: 'Complete 25 projects',
    iconName: 'trophy',
    points: 150,
    category: 'progress',
    condition: (stats, projects) => (stats?.completedProjects || 0) >= 25
  },

  // Technology Achievements
  {
    id: 'tech_explorer',
    title: 'Technology Explorer',
    description: 'Use 5 different technologies across projects',
    iconName: 'star',
    points: 40,
    category: 'technology',
    condition: (stats, projects) => {
      const technologies = new Set();
      projects.forEach(project => {
        if (project.technologies) {
          project.technologies.forEach(tech => technologies.add(tech.toLowerCase()));
        }
      });
      return technologies.size >= 5;
    }
  },
  {
    id: 'full_stack',
    title: 'Full Stack Developer',
    description: 'Complete projects using both frontend and backend technologies',
    iconName: 'award',
    points: 60,
    category: 'technology',
    condition: (stats, projects) => {
      const frontendTechs = ['react', 'vue', 'angular', 'html', 'css', 'javascript', 'typescript'];
      const backendTechs = ['node.js', 'python', 'java', 'php', 'ruby', 'go', 'rust', 'c#'];
      
      let hasFrontend = false;
      let hasBackend = false;
      
      projects.forEach(project => {
        if (project.technologies) {
          const projectTechs = project.technologies.map(tech => tech.toLowerCase());
          if (projectTechs.some(tech => frontendTechs.includes(tech))) hasFrontend = true;
          if (projectTechs.some(tech => backendTechs.includes(tech))) hasBackend = true;
        }
      });
      
      return hasFrontend && hasBackend;
    }
  },

  // Time-based Achievements
  {
    id: 'speed_runner',
    title: 'Speed Runner',
    description: 'Complete a project in under 2 hours',
    iconName: 'zap',
    points: 35,
    category: 'speed',
    condition: (stats, projects) => {
      return projects.some(project => {
        if (project.status === 'completed' && project.timeSpent) {
          return project.timeSpent < 120; // Less than 2 hours (120 minutes)
        }
        return false;
      });
    }
  },
  {
    id: 'marathon_runner',
    title: 'Marathon Runner',
    description: 'Spend more than 10 hours on a single project',
    iconName: 'clock',
    points: 45,
    category: 'dedication',
    condition: (stats, projects) => {
      return projects.some(project => {
        if (project.timeSpent) {
          return project.timeSpent > 600; // More than 10 hours (600 minutes)
        }
        return false;
      });
    }
  },
  {
    id: 'time_master',
    title: 'Time Master',
    description: 'Accumulate 50+ hours of total learning time',
    iconName: 'clock',
    points: 100,
    category: 'dedication',
    condition: (stats, projects) => (stats?.totalTimeSpent || 0) >= 3000 // 50 hours in minutes
  },

  // Consistency Achievements
  {
    id: 'consistent_learner',
    title: 'Consistent Learner',
    description: 'Maintain a 7-day learning streak',
    iconName: 'target',
    points: 50,
    category: 'consistency',
    condition: (stats, projects) => (stats?.currentStreak || 0) >= 7
  },
  {
    id: 'dedication_master',
    title: 'Dedication Master',
    description: 'Maintain a 30-day learning streak',
    iconName: 'award',
    points: 150,
    category: 'consistency',
    condition: (stats, projects) => (stats?.currentStreak || 0) >= 30
  },

  // Special Achievements
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete 5 projects with 100% completion rate',
    iconName: 'star',
    points: 75,
    category: 'quality',
    condition: (stats, projects) => {
      const completedProjects = projects.filter(p => p.status === 'completed');
      return completedProjects.length >= 5 && (stats?.completionRate || 0) === 100;
    }
  },
  {
    id: 'variety_seeker',
    title: 'Variety Seeker',
    description: 'Complete projects in 3 different difficulty levels',
    iconName: 'target',
    points: 60,
    category: 'variety',
    condition: (stats, projects) => {
      const difficulties = new Set();
      projects.filter(p => p.status === 'completed').forEach(project => {
        if (project.difficulty) {
          difficulties.add(project.difficulty);
        }
      });
      return difficulties.size >= 3;
    }
  }
];

// Achievement categories for organization
export const ACHIEVEMENT_CATEGORIES = {
  beginner: { name: 'Beginner', color: 'blue', icon: 'star' },
  progress: { name: 'Progress', color: 'green', icon: 'trophy' },
  technology: { name: 'Technology', color: 'purple', icon: 'award' },
  speed: { name: 'Speed', color: 'orange', icon: 'zap' },
  dedication: { name: 'Dedication', color: 'red', icon: 'clock' },
  consistency: { name: 'Consistency', color: 'indigo', icon: 'target' },
  quality: { name: 'Quality', color: 'yellow', icon: 'star' },
  variety: { name: 'Variety', color: 'pink', icon: 'target' }
};

// Function to check which achievements a user has earned
export function checkUserAchievements(stats, projects, currentAchievements = []) {
  const earnedAchievementIds = new Set(currentAchievements.map(a => a.id || a.achievementId));
  const newAchievements = [];

  ACHIEVEMENT_DEFINITIONS.forEach(achievement => {
    if (!earnedAchievementIds.has(achievement.id)) {
      if (achievement.condition(stats, projects)) {
        newAchievements.push({
          id: achievement.id,
          title: achievement.title,
          description: achievement.description,
          iconName: achievement.iconName,
          points: achievement.points,
          category: achievement.category,
          earnedAt: new Date().toISOString()
        });
      }
    }
  });

  return newAchievements;
}

// Function to get achievement progress for unearned achievements
export function getAchievementProgress(achievement, stats, projects) {
  if (!stats || !projects) return 0;

  switch (achievement.id) {
    case 'first_project':
      return Math.min(100, (projects.length / 1) * 100);
    case 'first_completion':
      return Math.min(100, ((stats.completedProjects || 0) / 1) * 100);
    case 'project_streak_3':
      return Math.min(100, ((stats.completedProjects || 0) / 3) * 100);
    case 'project_streak_5':
      return Math.min(100, ((stats.completedProjects || 0) / 5) * 100);
    case 'project_streak_10':
      return Math.min(100, ((stats.completedProjects || 0) / 10) * 100);
    case 'project_streak_25':
      return Math.min(100, ((stats.completedProjects || 0) / 25) * 100);
    case 'tech_explorer':
      const technologies = new Set();
      projects.forEach(project => {
        if (project.technologies) {
          project.technologies.forEach(tech => technologies.add(tech.toLowerCase()));
        }
      });
      return Math.min(100, (technologies.size / 5) * 100);
    case 'time_master':
      return Math.min(100, ((stats.totalTimeSpent || 0) / 3000) * 100);
    case 'consistent_learner':
      return Math.min(100, ((stats.currentStreak || 0) / 7) * 100);
    case 'dedication_master':
      return Math.min(100, ((stats.currentStreak || 0) / 30) * 100);
    case 'speed_runner':
      // Check if any project was completed in under 2 hours
      const hasSpeedRun = projects.some(project => {
        if (project.status === 'completed' && project.timeSpent) {
          return project.timeSpent < 120;
        }
        return false;
      });
      return hasSpeedRun ? 100 : 0;
    case 'early_bird':
      // Check if any project was completed within 24 hours
      const hasEarlyBird = projects.some(project => {
        if (project.status === 'completed' && project.createdAt && project.updatedAt) {
          const created = new Date(project.createdAt);
          const completed = new Date(project.updatedAt);
          const hoursDiff = (completed - created) / (1000 * 60 * 60);
          return hoursDiff <= 24;
        }
        return false;
      });
      return hasEarlyBird ? 100 : 0;
    default:
      return 0;
  }
}

export default {
  ACHIEVEMENT_DEFINITIONS,
  ACHIEVEMENT_CATEGORIES,
  checkUserAchievements,
  getAchievementProgress
};
