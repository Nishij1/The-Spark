import { useState, useEffect } from 'react';
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
  AcademicCapIcon,
} from '@heroicons/react/24/outline';
import StepQuiz from '../quiz/StepQuiz';
import { useAuth } from '../../context/AuthContext';
import { quizService } from '../../services/quizService';

const ProjectStepsWithContext = ({
  steps,
  inputSource,
  completedSteps: externalCompletedSteps,
  onStepCompletion,
  projectId,
  projectDifficulty = 5,
  projectDomain = 'coding',
  className = ''
}) => {
  const { currentUser } = useAuth();
  const [internalCompletedSteps, setInternalCompletedSteps] = useState(new Set());
  const [expandedStep, setExpandedStep] = useState(null);
  const [showQuiz, setShowQuiz] = useState({});
  const [quizScores, setQuizScores] = useState({});

  // Use external completed steps if provided, otherwise use internal state
  const completedSteps = externalCompletedSteps || internalCompletedSteps;

  // Load existing quiz scores when component mounts
  useEffect(() => {
    const loadQuizScores = async () => {
      if (!currentUser || !projectId || !steps) return;

      const scores = {};
      for (let i = 0; i < steps.length; i++) {
        try {
          const bestScore = await quizService.getBestQuizScore(currentUser.uid, projectId, i);
          if (bestScore) {
            scores[i] = bestScore.score;
          }
        } catch (error) {
          console.error(`Error loading quiz score for step ${i}:`, error);
        }
      }
      setQuizScores(scores);
    };

    loadQuizScores();
  }, [currentUser, projectId, steps]);

  const toggleStepCompletion = (stepIndex) => {
    const isCurrentlyCompleted = completedSteps.has(stepIndex);
    const newCompletionState = !isCurrentlyCompleted;

    // Check if quiz is required and passed
    const quizScore = quizScores[stepIndex];
    if (newCompletionState && (!quizScore || !quizScore.passed)) {
      // Show quiz instead of marking as complete
      setShowQuiz(prev => ({ ...prev, [stepIndex]: true }));
      return;
    }

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

  const handleQuizPass = (stepIndex, score) => {
    console.log('Quiz passed for step', stepIndex, 'with score:', score);

    // Update quiz scores
    setQuizScores(prev => ({ ...prev, [stepIndex]: score }));

    // Hide quiz
    setShowQuiz(prev => ({ ...prev, [stepIndex]: false }));

    // Mark step as completed
    console.log('Marking step as completed...');
    if (onStepCompletion) {
      console.log('Using external step completion handler');
      onStepCompletion(stepIndex, true);
    } else {
      console.log('Using internal step completion');
      const newCompleted = new Set(internalCompletedSteps);
      newCompleted.add(stepIndex);
      setInternalCompletedSteps(newCompleted);

      // Check if all steps are completed for project completion
      const totalSteps = steps?.length || 0;
      if (newCompleted.size === totalSteps && totalSteps > 0) {
        console.log('🎉 All steps completed! Project should be marked as completed.');
      }
    }
  };

  const handleQuizComplete = (stepIndex, score) => {
    console.log('Quiz completed for step', stepIndex, 'with score:', score);
    // Update quiz scores regardless of pass/fail
    setQuizScores(prev => ({ ...prev, [stepIndex]: score }));
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

      {/* Enhanced Progress Overview */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">Progress</span>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {completedSteps.size} of {steps.length} steps completed
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {Math.round((completedSteps.size / steps.length) * 100)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
          </div>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(completedSteps.size / steps.length) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between items-center">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                completedSteps.has(index)
                  ? 'bg-green-500 scale-110'
                  : index === completedSteps.size
                  ? 'bg-blue-500 scale-110'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
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
                    <motion.button
                      onClick={() => toggleStepCompletion(index)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-green-200 dark:shadow-green-900/50'
                          : isNext
                          ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-indigo-200 dark:shadow-indigo-900/50'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-gray-200 dark:shadow-gray-800'
                      }`}
                    >
                      {isCompleted ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        >
                          <CheckCircleIcon className="h-7 w-7" />
                        </motion.div>
                      ) : (
                        <span className="font-bold text-lg">{index + 1}</span>
                      )}
                    </motion.button>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold ${
                          isCompleted
                            ? 'text-green-800 dark:text-green-200'
                            : isNext
                            ? 'text-indigo-800 dark:text-indigo-200'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {step.title}
                        </h3>
                        {isCompleted && (
                          <motion.span
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            className="text-green-500 text-lg"
                          >
                            ✅
                          </motion.span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {step.estimatedTime && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                            <ClockIcon className="h-4 w-4" />
                            <span>{step.estimatedTime}</span>
                          </div>
                        )}
                        {isCompleted && (
                          <div className="flex items-center space-x-1 text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                            <CheckCircleIcon className="h-3 w-3" />
                            <span>Done</span>
                          </div>
                        )}
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

                    {/* Mark as Completed Button */}
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.button
                          onClick={() => toggleStepCompletion(index)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                            isCompleted
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700'
                              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                          }`}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircleIcon className="h-5 w-5" />
                              <span>Completed ✓</span>
                            </>
                          ) : (
                            <>
                              <div className="w-5 h-5 border-2 border-white rounded border-dashed"></div>
                              <span>Mark as Completed</span>
                            </>
                          )}
                        </motion.button>

                        {isCompleted && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center space-x-1 text-green-600 dark:text-green-400 text-sm"
                          >
                            <span>🎉</span>
                            <span>Great job!</span>
                          </motion.div>
                        )}
                      </div>

                      <button
                        onClick={() => toggleStepExpansion(index)}
                        className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                      >
                        <span>{isExpanded ? 'Hide Details' : 'Show Details'}</span>
                        <QuestionMarkCircleIcon className="h-4 w-4" />
                      </button>
                    </div>
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

                {/* Quiz Section */}
                {!isCompleted && (
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <AcademicCapIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Knowledge Check
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Complete this quiz with 90% or higher to mark the step as complete
                        </p>
                      </div>
                    </div>

                    {/* Quiz Score Display */}
                    {quizScores[index] && (
                      <div className={`mb-4 p-3 rounded-lg ${
                        quizScores[index].passed
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${
                            quizScores[index].passed
                              ? 'text-green-800 dark:text-green-200'
                              : 'text-orange-800 dark:text-orange-200'
                          }`}>
                            {quizScores[index].passed ? 'Quiz Passed!' : 'Quiz Attempted'}
                          </span>
                          <span className={`text-lg font-bold ${
                            quizScores[index].passed
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-orange-600 dark:text-orange-400'
                          }`}>
                            {quizScores[index].percentage}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Quiz Button or Component */}
                    {!showQuiz[index] ? (
                      <button
                        onClick={() => setShowQuiz(prev => ({ ...prev, [index]: true }))}
                        className={`w-full p-4 rounded-lg border-2 border-dashed transition-all ${
                          quizScores[index]?.passed
                            ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-300'
                            : 'border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/10 text-purple-700 dark:text-purple-300 hover:border-purple-400 dark:hover:border-purple-600'
                        }`}
                      >
                        <div className="flex items-center justify-center space-x-2">
                          <AcademicCapIcon className="h-5 w-5" />
                          <span className="font-medium">
                            {quizScores[index]?.passed ? 'Retake Quiz' : 'Start Quiz'}
                          </span>
                        </div>
                      </button>
                    ) : (
                      <StepQuiz
                        step={step}
                        stepIndex={index}
                        projectId={projectId}
                        projectDifficulty={projectDifficulty}
                        projectDomain={projectDomain}
                        userId={currentUser?.uid}
                        onQuizComplete={(score) => handleQuizComplete(index, score)}
                        onQuizPass={(passedStepIndex, score) => handleQuizPass(passedStepIndex, score)}
                        isVisible={showQuiz[index]}
                      />
                    )}
                  </div>
                )}
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
