import { useState } from 'react';
import StepQuiz from './StepQuiz';

// Test component to verify quiz functionality
const QuizTest = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

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
    setQuizResults(score);
    console.log('Quiz completed with score:', score);
  };

  const handleQuizPass = (stepIndex, score) => {
    console.log('Quiz passed for step', stepIndex, 'with score:', score);
    alert(`Congratulations! You passed the quiz with ${score.percentage}%`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Quiz System Test
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This is a test component to verify the quiz functionality. Click the button below to start a sample quiz.
        </p>

        {!showQuiz ? (
          <button
            onClick={() => setShowQuiz(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Test Quiz
          </button>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => {
                setShowQuiz(false);
                setQuizResults(null);
              }}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Reset Quiz
            </button>
            
            <StepQuiz
              step={testStep}
              stepIndex={0}
              projectId="test-project"
              userId="test-user"
              onQuizComplete={handleQuizComplete}
              onQuizPass={handleQuizPass}
              isVisible={showQuiz}
            />
          </div>
        )}

        {quizResults && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Quiz Results:
            </h3>
            <pre className="text-sm text-gray-600 dark:text-gray-400">
              {JSON.stringify(quizResults, null, 2)}
            </pre>
          </div>
        )}
      </div>

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
  );
};

export default QuizTest;
