import { motion } from 'framer-motion';
import {
  AcademicCapIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

const LearningObjectives = ({ learningObjectives, className = '' }) => {
  if (!learningObjectives || learningObjectives.length === 0) {
    return null;
  }

  // Handle both old format (array of strings) and new format (array of objects)
  const objectives = learningObjectives.map((obj, index) => {
    if (typeof obj === 'string') {
      return {
        objective: obj,
        connectionToInput: `This objective directly addresses your learning goal by providing hands-on experience with the concepts you wanted to understand.`,
        measurableOutcome: `After completing this objective, you'll be able to confidently apply these concepts in real-world scenarios and explain how they work.`
      };
    }
    if (typeof obj === 'object' && obj !== null) {
      return {
        objective: obj.objective || 'Learn new concepts',
        connectionToInput: obj.connectionToInput || 'This objective relates to your learning goal',
        measurableOutcome: obj.measurableOutcome || 'You will gain practical understanding'
      };
    }
    // Fallback for any unexpected format
    return {
      objective: 'Learn new concepts',
      connectionToInput: 'This objective relates to your learning goal',
      measurableOutcome: 'You will gain practical understanding'
    };
  });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 px-4 py-2 rounded-full mb-4">
          <TrophyIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
          <span className="text-sm font-medium text-green-700 dark:text-green-300">
            What You'll Learn & Why It Matters
          </span>
        </div>
      </div>

      {/* Learning Objectives */}
      <div className="space-y-4">
        {objectives.map((objective, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-start space-x-4">
              {/* Objective Number */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
              </div>

              {/* Objective Content */}
              <div className="flex-1 space-y-4">
                {/* Main Objective */}
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <AcademicCapIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">Learning Objective</h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {objective.objective}
                  </p>
                </div>

                {/* Connection to Input */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <ArrowRightIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm">
                      Connection to Your Learning Goal
                    </h4>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm leading-relaxed">
                    {objective.connectionToInput}
                  </p>
                </div>

                {/* Measurable Outcome */}
                <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl border border-green-200 dark:border-green-800">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <h4 className="font-medium text-green-800 dark:text-green-200 text-sm">
                      What You'll Be Able to Do
                    </h4>
                  </div>
                  <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
                    {objective.measurableOutcome}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: objectives.length * 0.1 + 0.2 }}
        className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 p-6 rounded-2xl border border-purple-200 dark:border-purple-800"
      >
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 mb-3">
            <TrophyIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-purple-800 dark:text-purple-200">
              Learning Success
            </h3>
          </div>
          <p className="text-purple-700 dark:text-purple-300 text-sm leading-relaxed">
            By completing this project, you'll have transformed your initial learning question into 
            practical, hands-on knowledge that you can apply immediately. Each objective builds upon 
            the previous one, creating a comprehensive understanding of your chosen topic.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LearningObjectives;
