import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  LightBulbIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const ProjectStepsWithContext = ({
  steps,
  inputSource,
  completedSteps: externalCompletedSteps,
  onStepCompletion,
  className = ''
}) => {
  const [internalCompletedSteps, setInternalCompletedSteps] = useState(new Set());
  const [expandedStep, setExpandedStep] = useState(null);

  // Use external completed steps if provided, otherwise use internal state
  const completedSteps = externalCompletedSteps || internalCompletedSteps;

  const toggleStepCompletion = (stepIndex) => {
    const isCurrentlyCompleted = completedSteps.has(stepIndex);
    const newCompletionState = !isCurrentlyCompleted;

    if (onStepCompletion) {
      // Use external handler if provided
      onStepCompletion(stepIndex, newCompletionState);
    } else {
      // Use internal state management
      const newCompleted = new Set(internalCompletedSteps);
      if (newCompletionState) {
        newCompleted.add(stepIndex);
      } else {
        newCompleted.delete(stepIndex);
      }
      setInternalCompletedSteps(newCompleted);
    }
  };

  const toggleStepExpansion = (stepIndex) => {
    setExpandedStep(expandedStep === stepIndex ? null : stepIndex);
  };

  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 px-4 py-2 rounded-full mb-4">
          <PlayCircleIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">
            Step-by-Step Learning Journey
          </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm max-w-2xl mx-auto">
          Each step is designed to build your understanding progressively. Click on any step to see how it connects to your original learning goal.
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {completedSteps.size} of {steps.length} steps completed
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.has(index);
          const isExpanded = expandedStep === index;
          const isNext = !isCompleted && completedSteps.size === index;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl border-2 transition-all duration-200 ${
                isCompleted
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                  : isNext
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {/* Step Header */}
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Step Number/Status */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => toggleStepCompletion(index)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isCompleted
                          ? 'bg-green-500 text-white'
                          : isNext
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircleIcon className="h-6 w-6" />
                      ) : (
                        <span className="font-bold">{index + 1}</span>
                      )}
                    </button>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-semibold ${
                        isCompleted
                          ? 'text-green-800 dark:text-green-200'
                          : isNext
                          ? 'text-indigo-800 dark:text-indigo-200'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {step.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        {step.estimatedTime && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <ClockIcon className="h-4 w-4" />
                            <span>{step.estimatedTime}</span>
                          </div>
                        )}
                        <button
                          onClick={() => toggleStepExpansion(index)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        >
                          <QuestionMarkCircleIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      {step.description}
                    </p>

                    {/* Learning Focus */}
                    {step.learningFocus && (
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpenIcon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                          Focus: {step.learningFocus}
                        </span>
                      </div>
                    )}

                    {/* Connection to Goal */}
                    {step.connectionToGoal && (
                      <div className="space-y-2">
                        <div className="flex items-start space-x-2 bg-blue-50 dark:bg-blue-900/10 p-3 rounded-lg">
                          <ArrowRightIcon className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                              Problem Resolution:
                            </p>
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              {step.connectionToGoal}
                            </p>
                          </div>
                        </div>

                        {/* Progress indicator for this step */}
                        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                          <div className={`w-2 h-2 rounded-full ${
                            isCompleted ? 'bg-green-500' : isNext ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                          <span>
                            {isCompleted
                              ? 'Completed - Knowledge gained!'
                              : isNext
                              ? 'Current step - Building understanding...'
                              : 'Upcoming - Will build on previous learning'
                            }
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Hints */}
                        {step.hints && step.hints.length > 0 && (
                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <LightBulbIcon className="h-5 w-5 text-yellow-500" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Helpful Hints</h4>
                            </div>
                            <ul className="space-y-2">
                              {step.hints.map((hint, hintIndex) => (
                                <li key={hintIndex} className="flex items-start space-x-2">
                                  <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></span>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">{hint}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Reflection Prompts */}
                        {step.reflectionPrompts && step.reflectionPrompts.length > 0 && (
                          <div>
                            <div className="flex items-center space-x-2 mb-3">
                              <ChatBubbleLeftRightIcon className="h-5 w-5 text-purple-500" />
                              <h4 className="font-medium text-gray-900 dark:text-white">Reflection Questions</h4>
                            </div>
                            <ul className="space-y-2">
                              {step.reflectionPrompts.map((prompt, promptIndex) => (
                                <li key={promptIndex} className="flex items-start space-x-2">
                                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                                  <span className="text-sm text-gray-600 dark:text-gray-400">{prompt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Learning Journey Summary */}
      {completedSteps.size > 0 && completedSteps.size < steps.length && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-6 rounded-2xl border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center space-x-3 mb-4">
            <BookOpenIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200">
              Learning Progress Summary
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                🎯 Original Challenge:
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {inputSource || "Learn new concepts through hands-on project building"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                📈 Progress Made:
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Completed {completedSteps.size} of {steps.length} learning milestones
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Next Step:</strong> {steps[completedSteps.size]?.title || "Continue building!"}
            </p>
            {steps[completedSteps.size]?.connectionToGoal && (
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                This will help by: {steps[completedSteps.size].connectionToGoal}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Completion Message */}
      {completedSteps.size === steps.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-8 rounded-2xl border border-green-200 dark:border-green-800 text-center"
        >
          <div className="text-4xl mb-4">🎉</div>
          <div className="inline-flex items-center space-x-2 mb-4">
            <CheckCircleIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
              Learning Journey Complete!
            </h3>
          </div>

          <div className="space-y-4">
            <p className="text-green-700 dark:text-green-300">
              🎯 <strong>Challenge Solved:</strong> You started with "{inputSource || "a learning goal"}"
              and now have practical, hands-on experience!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  🧠 Knowledge Gained:
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You've transformed theoretical concepts into practical understanding through hands-on building.
                </p>
              </div>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                  🚀 Next Steps:
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Apply these skills to new projects, explore advanced concepts, or help others learn!
                </p>
              </div>
            </div>

            <p className="text-sm text-green-600 dark:text-green-400 italic">
              "I wanted to learn X → I built Y → Now I understand X!" ✨
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectStepsWithContext;
