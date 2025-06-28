import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LightBulbIcon,
  XMarkIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const ContextualReminder = ({ 
  project, 
  currentStep, 
  completedSteps = [], 
  originalInput,
  onDismiss,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [reminderType, setReminderType] = useState('progress');

  useEffect(() => {
    // Determine what type of reminder to show based on progress
    const progressPercentage = (completedSteps.length / (project.steps?.length || 1)) * 100;
    
    if (progressPercentage === 0) {
      setReminderType('welcome');
    } else if (progressPercentage >= 25 && progressPercentage < 50) {
      setReminderType('quarter');
    } else if (progressPercentage >= 50 && progressPercentage < 75) {
      setReminderType('halfway');
    } else if (progressPercentage >= 75 && progressPercentage < 100) {
      setReminderType('nearComplete');
    } else if (progressPercentage === 100) {
      setReminderType('complete');
    } else {
      setReminderType('progress');
    }
  }, [completedSteps, project.steps]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  const getReminderContent = () => {
    const currentStepData = project.steps?.[currentStep];
    const progressPercentage = (completedSteps.length / (project.steps?.length || 1)) * 100;

    switch (reminderType) {
      case 'welcome':
        return {
          icon: BookOpenIcon,
          title: '🎯 Remember Your Goal',
          message: `You started this project to: "${originalInput || 'learn new concepts'}". Each step you complete brings you closer to mastering these concepts!`,
          color: 'blue',
          action: 'Let\'s begin your learning journey!'
        };

      case 'quarter':
        return {
          icon: CheckCircleIcon,
          title: '🌟 Great Start!',
          message: `You're 25% through your learning journey! Remember, you wanted to "${originalInput || 'learn new concepts'}" - and you're building real understanding through hands-on practice.`,
          color: 'green',
          action: 'Keep building that knowledge!'
        };

      case 'halfway':
        return {
          icon: LightBulbIcon,
          title: '🚀 Halfway There!',
          message: `Amazing progress! You're halfway to solving "${originalInput || 'your learning challenge'}". Notice how the concepts are becoming clearer as you build?`,
          color: 'purple',
          action: 'The learning momentum is building!'
        };

      case 'nearComplete':
        return {
          icon: ArrowRightIcon,
          title: '🎉 Almost Done!',
          message: `You're so close! Just a few more steps and you'll have completely transformed "${originalInput || 'your learning goal'}" into practical, hands-on knowledge.`,
          color: 'orange',
          action: 'Finish strong - you\'ve got this!'
        };

      case 'complete':
        return {
          icon: CheckCircleIcon,
          title: '🏆 Mission Accomplished!',
          message: `Congratulations! You've successfully transformed "${originalInput || 'your learning goal'}" into real, practical understanding. You now have the skills to tackle similar challenges!`,
          color: 'green',
          action: 'Celebrate your achievement!'
        };

      default:
        return {
          icon: LightBulbIcon,
          title: '💡 Learning Connection',
          message: currentStepData?.connectionToGoal || `This step helps you understand "${originalInput || 'your learning goal'}" through practical application.`,
          color: 'blue',
          action: 'Keep connecting theory to practice!'
        };
    }
  };

  if (!isVisible || !project) {
    return null;
  }

  const content = getReminderContent();
  const Icon = content.icon;

  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      title: 'text-blue-800 dark:text-blue-200',
      message: 'text-blue-700 dark:text-blue-300',
      action: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10',
      border: 'border-green-200 dark:border-green-800',
      icon: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      title: 'text-green-800 dark:text-green-200',
      message: 'text-green-700 dark:text-green-300',
      action: 'text-green-600 dark:text-green-400'
    },
    purple: {
      bg: 'from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      title: 'text-purple-800 dark:text-purple-200',
      message: 'text-purple-700 dark:text-purple-300',
      action: 'text-purple-600 dark:text-purple-400'
    },
    orange: {
      bg: 'from-orange-50 to-yellow-50 dark:from-orange-900/10 dark:to-yellow-900/10',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      title: 'text-orange-800 dark:text-orange-200',
      message: 'text-orange-700 dark:text-orange-300',
      action: 'text-orange-600 dark:text-orange-400'
    }
  };

  const colors = colorClasses[content.color] || colorClasses.blue;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl p-6 shadow-lg ${className}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Icon */}
            <div className={`p-3 ${colors.icon} rounded-xl flex-shrink-0`}>
              <Icon className="h-6 w-6" />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-3">
              <h3 className={`font-semibold ${colors.title}`}>
                {content.title}
              </h3>
              
              <p className={`text-sm leading-relaxed ${colors.message}`}>
                {content.message}
              </p>
              
              <div className={`text-sm font-medium ${colors.action} italic`}>
                {content.action}
              </div>

              {/* Progress indicator */}
              <div className="flex items-center space-x-2 pt-2">
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full bg-gradient-to-r ${
                      content.color === 'green' ? 'from-green-400 to-emerald-500' :
                      content.color === 'purple' ? 'from-purple-400 to-indigo-500' :
                      content.color === 'orange' ? 'from-orange-400 to-yellow-500' :
                      'from-blue-400 to-indigo-500'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedSteps.length / (project.steps?.length || 1)) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className={`text-xs ${colors.action}`}>
                  {completedSteps.length}/{project.steps?.length || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Dismiss Button */}
          <button
            onClick={handleDismiss}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContextualReminder;
