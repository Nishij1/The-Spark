import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  LightBulbIcon,
  TrophyIcon,
  ArrowRightIcon,
  BookOpenIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { generateLearningProgressSummary } from '../../utils/projectEnhancer';

const LearningProgressTracker = ({ 
  project, 
  completedSteps = [], 
  currentStep = 0,
  originalInput = '',
  className = '' 
}) => {
  const [progressSummary, setProgressSummary] = useState(null);
  const [showInsights, setShowInsights] = useState(false);

  useEffect(() => {
    if (project) {
      const summary = generateLearningProgressSummary(project, completedSteps);
      setProgressSummary(summary);
    }
  }, [project, completedSteps]);

  if (!project || !progressSummary) {
    return null;
  }

  const { progressPercentage, completedSteps: completed, totalSteps, nextMilestone } = progressSummary;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 px-4 py-2 rounded-full mb-4">
          <TrophyIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            Learning Progress & Problem Resolution
          </span>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Learning Journey
          </h3>
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {Math.round(progressPercentage)}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
          <motion.div
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>{completed} of {totalSteps} steps completed</span>
          <span>{totalSteps - completed} steps remaining</span>
        </div>
      </div>

      {/* Problem Resolution Context */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <BookOpenIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-blue-800 dark:text-blue-200">
            How Each Step Solves Your Learning Challenge
          </h3>
        </div>

        {originalInput && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Your Original Goal:</strong> {originalInput}
            </p>
          </div>
        )}

        {/* Current Step Context */}
        {project.steps && project.steps[currentStep] && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {currentStep + 1}
              </span>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">
                Current Step: {project.steps[currentStep].title}
              </h4>
            </div>
            
            {project.steps[currentStep].connectionToGoal && (
              <div className="ml-8 p-3 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>How this helps:</strong> {project.steps[currentStep].connectionToGoal}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Skills Learned */}
      {progressSummary.skillsLearned.length > 0 && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-2xl border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              Skills You've Mastered
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {progressSummary.skillsLearned.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-2 p-2 bg-white dark:bg-gray-800 rounded-lg"
              >
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{skill}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Next Milestone */}
      {nextMilestone && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-6 rounded-2xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <ArrowRightIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-purple-800 dark:text-purple-200">
              Next Learning Milestone
            </h3>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-purple-700 dark:text-purple-300">
              {nextMilestone.stepTitle}
            </h4>
            
            {nextMilestone.learningFocus && (
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Learning Focus:</strong> {nextMilestone.learningFocus}
                </p>
              </div>
            )}
            
            {nextMilestone.connectionToGoal && (
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>How it helps:</strong> {nextMilestone.connectionToGoal}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Learning Insights */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 p-6 rounded-2xl border border-amber-200 dark:border-amber-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <LightBulbIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
              Learning Insights
            </h3>
          </div>
          <button
            onClick={() => setShowInsights(!showInsights)}
            className="text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
          >
            <SparklesIcon className="h-5 w-5" />
          </button>
        </div>

        <AnimatePresence>
          {showInsights && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3"
            >
              {progressSummary.learningInsights.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 bg-white dark:bg-gray-800 rounded-lg"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300">{insight}</p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!showInsights && (
          <p className="text-sm text-amber-700 dark:text-amber-300">
            Click the sparkle icon to see personalized learning insights based on your progress.
          </p>
        )}
      </div>

      {/* Completion Celebration */}
      {progressPercentage === 100 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 p-8 rounded-2xl border border-green-200 dark:border-green-800 text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
            Congratulations!
          </h3>
          <p className="text-green-700 dark:text-green-300 mb-4">
            You've successfully completed your learning journey and solved your original challenge!
          </p>
          <div className="text-sm text-green-600 dark:text-green-400">
            You now have the knowledge and skills to tackle similar problems independently.
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default LearningProgressTracker;
