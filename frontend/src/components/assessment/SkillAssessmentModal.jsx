import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  SparklesIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { ASSESSMENT_QUESTIONS, GENERAL_QUESTIONS, generateSkillSummary } from '../../data/skillAssessment';
import { PROJECT_DOMAINS } from '../../services/firestore';

export default function SkillAssessmentModal({ isOpen, onClose, onComplete, onNavigateToGenerate }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [isCompleting, setIsCompleting] = useState(false);
  const [assessmentResults, setAssessmentResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Combine all questions
  const allQuestions = [
    ...GENERAL_QUESTIONS,
    ...Object.values(ASSESSMENT_QUESTIONS).flat(),
  ];

  const totalSteps = allQuestions.length;
  const currentQuestion = allQuestions[currentStep];
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleResponse = (questionId, value) => {
    setResponses(prev => {
      const newResponses = { ...prev };
      
      if (currentQuestion.type === 'multiple') {
        const currentValues = newResponses[questionId] || [];
        if (currentValues.includes(value)) {
          newResponses[questionId] = currentValues.filter(v => v !== value);
        } else {
          newResponses[questionId] = [...currentValues, value];
        }
      } else {
        newResponses[questionId] = value;
      }
      
      return newResponses;
    });
  };

  const canProceed = () => {
    const response = responses[currentQuestion.id];
    if (currentQuestion.type === 'multiple') {
      return response && response.length > 0;
    }
    return response !== undefined;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      const assessment = generateSkillSummary(responses);
      setAssessmentResults(assessment);
      await onComplete(assessment);
      setShowResults(true);
    } catch (error) {
      console.error('Error completing assessment:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const handleStartGenerating = () => {
    onClose();
    if (onNavigateToGenerate) {
      onNavigateToGenerate();
    }
  };

  const handleCloseResults = () => {
    setShowResults(false);
    onClose();
  };

  const getDomainIcon = (domain) => {
    switch (domain) {
      case PROJECT_DOMAINS.CODING: return '💻';
      case PROJECT_DOMAINS.HARDWARE: return '🔧';
      case PROJECT_DOMAINS.DESIGN: return '🎨';
      case PROJECT_DOMAINS.RESEARCH: return '🔬';
      default: return '📋';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 px-8 py-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Skill Assessment</h1>
                  <p className="text-white/80">Help us understand your experience</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="relative mt-6">
              <div className="w-full bg-white/20 rounded-full h-2 backdrop-blur-sm">
                <motion.div
                  className="bg-white h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-white/80">
                <span>Question {currentStep + 1} of {totalSteps}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {showResults ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="space-y-6 text-center"
                >
                  {/* Success Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
                      <TrophyIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  {/* Results Title */}
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Assessment Complete! 🎉
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Here's your personalized skill profile
                    </p>
                  </div>

                  {/* Skill Level Display */}
                  {assessmentResults && (
                    <div className="space-y-6">
                      <div className="p-6 bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl border border-primary-200 dark:border-primary-800">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                          <AcademicCapIcon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Overall Skill Level
                          </h3>
                        </div>
                        <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 capitalize mb-2">
                          {assessmentResults.overallLevel}
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          Perfect! We'll generate projects tailored to your experience level.
                        </p>
                      </div>

                      {/* Domain Breakdown */}
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(assessmentResults.domainLevels).map(([domain, level]) => (
                          <div key={domain} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                            <div className="text-2xl mb-2">{getDomainIcon(domain)}</div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                              {domain}
                            </div>
                            <div className="text-xs text-primary-600 dark:text-primary-400 capitalize">
                              {level}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Recommendations */}
                      {assessmentResults.recommendations && assessmentResults.recommendations.length > 0 && (
                        <div className="text-left space-y-3">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Personalized Recommendations:
                          </h4>
                          <ul className="space-y-2">
                            {assessmentResults.recommendations.slice(0, 3).map((rec, index) => (
                              <li key={index} className="flex items-start space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                      onClick={handleStartGenerating}
                      className="flex-1 flex items-center justify-center space-x-2 px-6 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <RocketLaunchIcon className="h-5 w-5" />
                      <span>Start Generating Projects</span>
                    </button>
                    <button
                      onClick={handleCloseResults}
                      className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                {/* Question */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {currentQuestion.question}
                  </h2>
                  
                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                      const isSelected = currentQuestion.type === 'multiple'
                        ? responses[currentQuestion.id]?.includes(option.value)
                        : responses[currentQuestion.id] === option.value;

                      return (
                        <motion.button
                          key={option.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          onClick={() => handleResponse(currentQuestion.id, option.value)}
                          className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-primary-300 hover:bg-primary-25 dark:hover:bg-primary-900/10'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option.label}</span>
                            {isSelected && (
                              <CheckCircleIcon className="h-5 w-5 text-primary-500" />
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handlePrevious}
                    disabled={currentStep === 0}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      currentStep === 0
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <ChevronLeftIcon className="h-5 w-5" />
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={!canProceed() || isCompleting}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                      !canProceed() || isCompleting
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    <span>
                      {currentStep === totalSteps - 1 
                        ? (isCompleting ? 'Completing...' : 'Complete Assessment')
                        : 'Next'
                      }
                    </span>
                    {currentStep < totalSteps - 1 && <ChevronRightIcon className="h-5 w-5" />}
                  </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
