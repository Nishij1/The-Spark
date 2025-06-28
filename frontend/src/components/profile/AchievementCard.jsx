import { motion } from 'framer-motion';
import { Trophy, Star, Target, Zap, Award, Clock } from 'lucide-react';

const AchievementCard = ({ achievement, isEarned = false, progress = 0 }) => {
  const getIcon = (iconName) => {
    const icons = {
      trophy: Trophy,
      star: Star,
      target: Target,
      zap: Zap,
      award: Award,
      clock: Clock
    };
    const Icon = icons[iconName] || Trophy;
    return Icon;
  };

  const Icon = getIcon(achievement.iconName);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-lg border-2 transition-all duration-300 ${
        isEarned
          ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 shadow-lg'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      {/* Earned Badge */}
      {isEarned && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          EARNED
        </div>
      )}

      {/* Achievement Content */}
      <div className="p-6">
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div className={`flex-shrink-0 p-3 rounded-full ${
            isEarned
              ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
          }`}>
            <Icon className="h-6 w-6" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-semibold mb-2 ${
              isEarned
                ? 'text-yellow-900 dark:text-yellow-100'
                : 'text-gray-900 dark:text-white'
            }`}>
              {achievement.title}
            </h3>
            
            <p className={`text-sm mb-3 ${
              isEarned
                ? 'text-yellow-700 dark:text-yellow-300'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {achievement.description}
            </p>

            {/* Progress Bar (for unearned achievements) */}
            {!isEarned && progress > 0 && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Earned Date */}
            {isEarned && achievement.earnedAt && (
              <div className="flex items-center space-x-2 text-xs text-yellow-600 dark:text-yellow-400">
                <Clock className="h-3 w-3" />
                <span>
                  Earned {new Date(achievement.earnedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}

            {/* Reward/Points */}
            {achievement.points && (
              <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                isEarned
                  ? 'bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}>
                <Star className="h-3 w-3" />
                <span>{achievement.points} points</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Shine Effect for Earned Achievements */}
      {isEarned && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full animate-pulse"></div>
      )}
    </motion.div>
  );
};

export default AchievementCard;
