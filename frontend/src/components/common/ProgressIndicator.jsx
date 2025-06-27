import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import {
  AcademicCapIcon,
  SparklesIcon,
  RocketLaunchIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const ProgressIndicator = ({ currentStep, steps, className = '' }) => {
  const defaultSteps = [
    {
      id: 'assessment',
      title: 'Skill Assessment',
      description: 'Evaluate your experience',
      icon: AcademicCapIcon,
    },
    {
      id: 'generation',
      title: 'AI Generation',
      description: 'Generate personalized projects',
      icon: SparklesIcon,
    },
    {
      id: 'selection',
      title: 'Project Selection',
      description: 'Choose your project',
      icon: RocketLaunchIcon,
    },
    {
      id: 'creation',
      title: 'Start Building',
      description: 'Begin your project',
      icon: PlayIcon,
    },
  ];

  const progressSteps = steps || defaultSteps;
  const currentStepIndex = progressSteps.findIndex(step => step.id === currentStep);

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Progress Bar */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {progressSteps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const isUpcoming = index > currentStepIndex;

            return (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="relative flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted
                        ? 'bg-green-500 border-green-500 text-white'
                        : isCurrent
                        ? 'bg-primary-500 border-primary-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </motion.div>

                  {/* Step Info */}
                  <div className="mt-3 text-center">
                    <div className={`text-sm font-medium ${
                      isCompleted || isCurrent
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {step.description}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {index < progressSteps.length - 1 && (
                  <div className="flex-1 mx-4">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isCompleted ? 1 : 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="h-0.5 bg-green-500 origin-left"
                    />
                    <div className={`h-0.5 ${
                      isCompleted ? 'bg-transparent' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Step {currentStepIndex + 1} of {progressSteps.length}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(((currentStepIndex + 1) / progressSteps.length) * 100)}% Complete
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentStepIndex + 1) / progressSteps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
          />
        </div>

        {/* Current Step Info */}
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            'bg-primary-500 text-white'
          }`}>
            {React.createElement(progressSteps[currentStepIndex]?.icon, { className: 'h-5 w-5' })}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {progressSteps[currentStepIndex]?.title}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {progressSteps[currentStepIndex]?.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
