import { motion } from 'framer-motion';
import { CheckCircle, Circle, Star, Trophy } from 'lucide-react';

const ProfileProgress = ({ 
  currentLevel, 
  nextLevel, 
  progress, 
  completedProjects, 
  projectsToNext,
  className = '' 
}) => {
  const getLevelColor = (level) => {
    if (level <= 1) return 'from-gray-400 to-gray-600';
    if (level <= 2) return 'from-blue-400 to-blue-600';
    if (level <= 3) return 'from-green-400 to-green-600';
    if (level <= 4) return 'from-purple-400 to-purple-600';
    if (level <= 5) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const getLevelTitle = (level) => {
    if (level <= 1) return 'Beginner';
    if (level <= 2) return 'Explorer';
    if (level <= 3) return 'Builder';
    if (level <= 4) return 'Creator';
    if (level <= 5) return 'Expert';
    return 'Master';
  };

  const milestones = [
    { level: 1, projects: 1, title: 'First Steps' },
    { level: 2, projects: 3, title: 'Getting Started' },
    { level: 3, projects: 10, title: 'Building Momentum' },
    { level: 4, projects: 25, title: 'Serious Builder' },
    { level: 5, projects: 50, title: 'Expert Level' },
    { level: 6, projects: 100, title: 'Master Creator' }
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Learning Progress
        </h3>
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Level {currentLevel}
          </span>
        </div>
      </div>

      {/* Current Level Display */}
      <div className="text-center mb-6">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br ${getLevelColor(currentLevel)} text-white text-2xl font-bold mb-3`}>
          {currentLevel}
        </div>
        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          {getLevelTitle(currentLevel)}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {completedProjects} projects completed
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress to Level {currentLevel + 1}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full bg-gradient-to-r ${getLevelColor(currentLevel + 1)} rounded-full relative`}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-pulse"></div>
          </motion.div>
        </div>
        {projectsToNext > 0 && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            {projectsToNext} more projects to reach Level {currentLevel + 1}
          </p>
        )}
      </div>

      {/* Milestones */}
      <div className="space-y-3">
        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Milestones
        </h5>
        {milestones.map((milestone, index) => {
          const isCompleted = completedProjects >= milestone.projects;
          const isCurrent = currentLevel === milestone.level;
          
          return (
            <motion.div
              key={milestone.level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isCurrent 
                  ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                  : isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : 'bg-gray-50 dark:bg-gray-700'
              }`}
            >
              {/* Status Icon */}
              <div className={`flex-shrink-0 ${
                isCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
              }`}>
                {isCompleted ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${
                    isCurrent 
                      ? 'text-primary-900 dark:text-primary-100'
                      : isCompleted
                      ? 'text-green-900 dark:text-green-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    Level {milestone.level}: {milestone.title}
                  </span>
                  {isCurrent && (
                    <Star className="h-4 w-4 text-yellow-500" />
                  )}
                </div>
                <p className={`text-xs ${
                  isCurrent 
                    ? 'text-primary-600 dark:text-primary-400'
                    : isCompleted
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {milestone.projects} projects required
                </p>
              </div>

              {/* Level Badge */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                isCurrent
                  ? `bg-gradient-to-br ${getLevelColor(milestone.level)} text-white`
                  : isCompleted
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
              }`}>
                {milestone.level}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Next Level Preview */}
      {projectsToNext > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getLevelColor(currentLevel + 1)} text-white flex items-center justify-center font-bold`}>
              {currentLevel + 1}
            </div>
            <div>
              <h6 className="font-medium text-primary-900 dark:text-primary-100">
                Next: {getLevelTitle(currentLevel + 1)}
              </h6>
              <p className="text-sm text-primary-600 dark:text-primary-400">
                Complete {projectsToNext} more projects to unlock
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileProgress;
