import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  TrophyIcon,
  ArrowRightIcon,
  ClockIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import { 
  generateQuizQuestions, 
  calculateQuizScore, 
  quizService, 
  QUIZ_QUESTION_TYPES 
} from '../../services/quizService';

const StepQuiz = ({
  step,
  stepIndex,
  projectId,
  projectDifficulty = 5,
  projectDomain = 'coding',
  userId,
  onQuizComplete,
  onQuizPass,
  isVisible = false
}) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeStarted, setTimeStarted] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Initialize quiz when component becomes visible
  useEffect(() => {
    if (isVisible && questions.length === 0) {
      const generatedQuestions = generateQuizQuestions(step, stepIndex, projectDomain, projectDifficulty);
      setQuestions(generatedQuestions);
      setTimeStarted(Date.now());
      console.log('Generated quiz questions with difficulty:', projectDifficulty, generatedQuestions);
    }
  }, [isVisible, step, stepIndex, projectDomain, projectDifficulty, questions.length]);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const hasAnsweredCurrent = currentQuestion ? answers[currentQuestion.id] !== undefined : false;

  // Debug logging
  console.log('Current question state:', {
    currentQuestionIndex,
    currentQuestion: currentQuestion?.id,
    isLastQuestion,
    hasAnsweredCurrent,
    currentAnswer: currentQuestion ? answers[currentQuestion.id] : 'no question',
    allAnswers: answers
  });

  const handleAnswer = (questionId, answer) => {
    console.log('Answer selected:', { questionId, answer });
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: answer
      };
      console.log('Updated answers:', newAnswers);
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (isLastQuestion) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    console.log('Submitting quiz with answers:', answers);
    console.log('Questions:', questions);

    try {
      const score = calculateQuizScore(answers, questions);
      console.log('Calculated score:', score);

      const timeSpent = timeStarted ? Math.round((Date.now() - timeStarted) / 1000) : 0;

      // Save quiz attempt to database
      if (userId && projectId) {
        try {
          await quizService.saveQuizAttempt(userId, projectId, stepIndex, answers, {
            ...score,
            timeSpent
          });
          console.log('Quiz attempt saved to database');
        } catch (dbError) {
          console.error('Error saving to database:', dbError);
          // Continue with local processing even if database save fails
        }
      }

      setQuizScore(score);
      setShowResults(true);

      // Notify parent components
      console.log('Notifying parent components...');
      onQuizComplete?.(score);
      if (score.passed) {
        console.log('Quiz passed! Notifying onQuizPass...');
        onQuizPass?.(stepIndex, score);
      } else {
        console.log('Quiz not passed. Score:', score.percentage, '% (need 90%)');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Error submitting quiz: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setQuizScore(null);
    setTimeStarted(Date.now());
    setShowExplanation(false);
  };

  if (!isVisible || questions.length === 0) {
    return null;
  }

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            quizScore?.passed 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : 'bg-orange-100 dark:bg-orange-900/30'
          }`}>
            {quizScore?.passed ? (
              <TrophyIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            ) : (
              <ClockIcon className="h-8 w-8 text-orange-600 dark:text-orange-400" />
            )}
          </div>

          <h3 className={`text-xl font-bold mb-2 ${
            quizScore?.passed 
              ? 'text-green-800 dark:text-green-200' 
              : 'text-orange-800 dark:text-orange-200'
          }`}>
            {quizScore?.passed ? 'Quiz Passed! 🎉' : 'Keep Learning! 📚'}
          </h3>

          <div className="space-y-2 mb-6">
            <div className={`text-3xl font-bold ${
              quizScore?.passed 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-orange-600 dark:text-orange-400'
            }`}>
              {quizScore?.percentage}%
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              {quizScore?.correctAnswers} out of {quizScore?.totalQuestions} correct
            </p>
          </div>

          {quizScore?.passed ? (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
              <p className="text-green-800 dark:text-green-200 text-sm">
                Excellent work! You've demonstrated a solid understanding of this step. 
                The step has been automatically marked as complete.
              </p>
            </div>
          ) : (
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg mb-4">
              <p className="text-orange-800 dark:text-orange-200 text-sm">
                You need 90% or higher to pass. Review the step content and try again. 
                Each attempt helps reinforce your learning!
              </p>
            </div>
          )}

          {!quizScore?.passed && (
            <button
              onClick={resetQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <QuestionMarkCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Step {stepIndex + 1} Quiz
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Need 90% to pass
          </div>
          {questions.length > 0 && (
            <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
              questions[0].difficulty === 'easy'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : questions[0].difficulty === 'medium'
                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {questions[0].difficulty.charAt(0).toUpperCase() + questions[0].difficulty.slice(1)} Level
            </div>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Current Question */}
      {currentQuestion && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
            {currentQuestion.question}
          </h4>

          {/* Multiple Choice Options */}
          {currentQuestion.type === QUIZ_QUESTION_TYPES.MULTIPLE_CHOICE && (
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswer(currentQuestion.id, option.id)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    answers[currentQuestion.id] === option.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      answers[currentQuestion.id] === option.id
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {answers[currentQuestion.id] === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-white">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* True/False Options */}
          {currentQuestion.type === QUIZ_QUESTION_TYPES.TRUE_FALSE && (
            <div className="flex space-x-4">
              {[true, false].map((value) => (
                <button
                  key={value.toString()}
                  onClick={() => handleAnswer(currentQuestion.id, value)}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    answers[currentQuestion.id] === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <div className={`text-2xl mb-2 ${
                      answers[currentQuestion.id] === value ? 'text-blue-600' : 'text-gray-400'
                    }`}>
                      {value ? '✓' : '✗'}
                    </div>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {value ? 'True' : 'False'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-gray-600 dark:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!hasAnsweredCurrent || isSubmitting}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          <span>{isLastQuestion ? 'Submit Quiz' : 'Next'}</span>
          {!isLastQuestion && <ArrowRightIcon className="h-4 w-4" />}
        </button>
      </div>
    </motion.div>
  );
};

export default StepQuiz;
