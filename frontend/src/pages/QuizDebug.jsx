import { useState } from 'react';
import StepQuiz from '../components/quiz/StepQuiz';
import { generateQuizQuestions, calculateQuizScore } from '../services/quizService';
import { runAllQuizTests } from '../utils/quizTestUtils';

const QuizDebug = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [stepCompleted, setStepCompleted] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(5);

  const testStep = {
    title: "Setting Up Your Development Environment",
    description: "Learn how to configure your development environment for optimal productivity. This includes installing necessary tools, setting up your IDE, and configuring version control.",
    learningFocus: "Development environment setup and configuration",
    connectionToGoal: "A properly configured development environment is essential for efficient coding and project management.",
    hints: [
      "Start by installing the latest version of your chosen IDE",
      "Configure your IDE with useful extensions and plugins",
      "Set up version control (Git) early in the process",
      "Create a consistent folder structure for your projects"
    ],
    reflectionPrompts: [
      "What challenges did you face while setting up your environment?",
      "How will this setup improve your development workflow?"
    ],
    estimatedTime: "30-45 minutes"
  };

  const handleQuizComplete = (score) => {
    console.log('Quiz completed with score:', score);
    setQuizResults(score);
  };

  const handleQuizPass = (stepIndex, score) => {
    console.log('Quiz passed for step', stepIndex, 'with score:', score);
    setStepCompleted(true);
    alert(`Congratulations! You passed the quiz with ${score.percentage}% and the step has been marked as complete!`);
  };

  const resetTest = () => {
    setShowQuiz(false);
    setQuizResults(null);
    setStepCompleted(false);
  };

  const startQuizWithDifficulty = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setShowQuiz(true);
    setQuizResults(null);
    setStepCompleted(false);
  };

  // Test the quiz generation and scoring functions directly
  const testQuizFunctions = () => {
    console.log('Testing quiz generation...');
    const questions = generateQuizQuestions(testStep, 0, 'coding', selectedDifficulty);
    console.log('Generated questions for difficulty', selectedDifficulty, ':', questions);

    // Test with perfect answers
    const perfectAnswers = {};
    questions.forEach(question => {
      if (question.type === 'multiple_choice') {
        const correctOption = question.options.find(opt => opt.correct);
        perfectAnswers[question.id] = correctOption.id;
      } else if (question.type === 'true_false') {
        perfectAnswers[question.id] = question.correct;
      }
    });

    console.log('Perfect answers:', perfectAnswers);
    const perfectScore = calculateQuizScore(perfectAnswers, questions);
    console.log('Perfect score:', perfectScore);

    // Test with wrong answers
    const wrongAnswers = {};
    questions.forEach(question => {
      if (question.type === 'multiple_choice') {
        const wrongOption = question.options.find(opt => !opt.correct);
        wrongAnswers[question.id] = wrongOption?.id || 'wrong';
      } else if (question.type === 'true_false') {
        wrongAnswers[question.id] = !question.correct;
      }
    });

    console.log('Wrong answers:', wrongAnswers);
    const wrongScore = calculateQuizScore(wrongAnswers, questions);
    console.log('Wrong score:', wrongScore);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz Debug Page
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            This page is for debugging the quiz functionality. Use the buttons below to test different scenarios.
          </p>

          {/* Difficulty Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project Difficulty (affects quiz complexity):
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(parseInt(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value={1}>1 - Very Easy</option>
              <option value={2}>2 - Easy</option>
              <option value={3}>3 - Easy-Medium</option>
              <option value={4}>4 - Medium</option>
              <option value={5}>5 - Medium (Default)</option>
              <option value={6}>6 - Medium-Hard</option>
              <option value={7}>7 - Hard</option>
              <option value={8}>8 - Very Hard</option>
              <option value={9}>9 - Expert</option>
              <option value={10}>10 - Master</option>
            </select>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => startQuizWithDifficulty(selectedDifficulty)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start Quiz (Difficulty {selectedDifficulty})
            </button>

            <button
              onClick={testQuizFunctions}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Test Quiz Functions
            </button>

            <button
              onClick={runAllQuizTests}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Run All Tests
            </button>

            <button
              onClick={resetTest}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Reset Test
            </button>
          </div>

          {/* Status Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg border-2 ${
              showQuiz ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <h3 className="font-semibold text-gray-900 dark:text-white">Quiz Active</h3>
              <p className={`text-sm ${showQuiz ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500'}`}>
                {showQuiz ? 'Yes' : 'No'}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${
              quizResults ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <h3 className="font-semibold text-gray-900 dark:text-white">Quiz Completed</h3>
              <p className={`text-sm ${quizResults ? 'text-purple-600 dark:text-purple-400' : 'text-gray-500'}`}>
                {quizResults ? `${quizResults.percentage}%` : 'No'}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${
              stepCompleted ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600'
            }`}>
              <h3 className="font-semibold text-gray-900 dark:text-white">Step Completed</h3>
              <p className={`text-sm ${stepCompleted ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                {stepCompleted ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>

        {/* Quiz Component */}
        {showQuiz && (
          <StepQuiz
            step={testStep}
            stepIndex={0}
            projectId="debug-project"
            projectDifficulty={selectedDifficulty}
            projectDomain="coding"
            userId="debug-user"
            onQuizComplete={handleQuizComplete}
            onQuizPass={handleQuizPass}
            isVisible={showQuiz}
          />
        )}

        {/* Results Display */}
        {quizResults && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quiz Results
            </h2>
            <pre className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg overflow-auto">
              {JSON.stringify(quizResults, null, 2)}
            </pre>
          </div>
        )}

        {/* Step Content Display */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Test Step Content
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Title:</h3>
              <p className="text-gray-600 dark:text-gray-400">{testStep.title}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Description:</h3>
              <p className="text-gray-600 dark:text-gray-400">{testStep.description}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Learning Focus:</h3>
              <p className="text-gray-600 dark:text-gray-400">{testStep.learningFocus}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Hints:</h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                {testStep.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizDebug;
