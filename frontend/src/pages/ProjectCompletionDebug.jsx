import React, { useState } from 'react';
import { runProjectCompletionTests } from '../utils/projectCompletionTest';

/**
 * Debug page for testing project completion functionality
 * This page allows developers to test the automatic project completion logic
 */
const ProjectCompletionDebug = () => {
  const [testResults, setTestResults] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    setTestResults('Running tests...\n');

    // Capture console output
    const originalLog = console.log;
    const originalError = console.error;
    let output = '';

    console.log = (...args) => {
      output += args.join(' ') + '\n';
      originalLog(...args);
    };

    console.error = (...args) => {
      output += 'ERROR: ' + args.join(' ') + '\n';
      originalError(...args);
    };

    try {
      await runProjectCompletionTests();
    } catch (error) {
      output += `\nTest execution failed: ${error.message}\n`;
    }

    // Restore console
    console.log = originalLog;
    console.error = originalError;

    setTestResults(output);
    setIsRunning(false);
  };

  const clearResults = () => {
    setTestResults('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Project Completion Debug
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Test the automatic project completion functionality when all steps with quizzes are finished.
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Test Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900 dark:text-blue-300 mb-2">
                  ✅ Quiz Score Validation
                </h3>
                <p className="text-blue-700 dark:text-blue-400 text-sm">
                  Tests that quiz scores must be 90% or higher to complete steps
                </p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-green-900 dark:text-green-300 mb-2">
                  🎯 Project Completion
                </h3>
                <p className="text-green-700 dark:text-green-400 text-sm">
                  Tests automatic status update to "completed" when all steps are done
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900 dark:text-purple-300 mb-2">
                  📊 Progress Tracking
                </h3>
                <p className="text-purple-700 dark:text-purple-400 text-sm">
                  Verifies progress percentage and completion timestamps
                </p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                <h3 className="font-medium text-orange-900 dark:text-orange-300 mb-2">
                  🚫 Error Handling
                </h3>
                <p className="text-orange-700 dark:text-orange-400 text-sm">
                  Tests rejection of failing quiz scores and invalid states
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex gap-4">
              <button
                onClick={runTests}
                disabled={isRunning}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  isRunning
                    ? 'bg-gray-400 cursor-not-allowed text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isRunning ? 'Running Tests...' : 'Run Completion Tests'}
              </button>
              
              <button
                onClick={clearResults}
                disabled={isRunning}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          {testResults && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Test Results
              </h2>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-auto max-h-96">
                <pre>{testResults}</pre>
              </div>
            </div>
          )}

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Implementation Details
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Automatic Completion Logic
                </h3>
                <p className="text-sm">
                  When a student completes the last step of a project by passing its quiz (90% or higher), 
                  the system automatically updates the project status from "active" to "completed" and 
                  records a completion timestamp.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Quiz Requirements
                </h3>
                <p className="text-sm">
                  Each step requires a quiz score of 90% or higher to be marked as complete. 
                  Students can retake quizzes until they achieve the passing score.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Status Updates
                </h3>
                <p className="text-sm">
                  The system updates both the progress.status and the main project status fields, 
                  ensuring consistency across the application and proper display in project lists.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCompletionDebug;
