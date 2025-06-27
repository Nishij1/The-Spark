import { motion } from 'framer-motion';
import {
  LightBulbIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  SparklesIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

const ProblemSolutionMapping = ({ project, className = '' }) => {
  const { problemSolutionMapping, learningJourney } = project;

  if (!problemSolutionMapping) {
    return null;
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Problem-Solution Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 px-4 py-2 rounded-full mb-4">
          <LightBulbIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            How This Project Solves Your Learning Challenge
          </span>
        </div>
      </div>

      {/* Problem → Solution Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Original Problem */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/10 dark:to-orange-900/10 p-6 rounded-2xl border border-red-200 dark:border-red-800"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
              <BookOpenIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-red-800 dark:text-red-200">Your Learning Challenge</h3>
          </div>
          <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
            {problemSolutionMapping.originalProblem}
          </p>
        </motion.div>

        {/* Arrow */}
        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          >
            <ArrowRightIcon className="h-6 w-6 text-white" />
          </motion.div>
        </div>

        {/* Solution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-6 rounded-2xl border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">Our Project Solution</h3>
          </div>
          <p className="text-green-700 dark:text-green-300 text-sm leading-relaxed">
            {problemSolutionMapping.howProjectSolves}
          </p>
        </motion.div>
      </div>

      {/* Why This Approach */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 p-6 rounded-2xl border border-purple-200 dark:border-purple-800"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <AcademicCapIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="font-semibold text-purple-800 dark:text-purple-200">Why This Approach Works</h3>
        </div>
        <p className="text-purple-700 dark:text-purple-300 text-sm leading-relaxed">
          {problemSolutionMapping.whyThisApproach}
        </p>
      </motion.div>

      {/* Key Connections */}
      {problemSolutionMapping.keyConnections && problemSolutionMapping.keyConnections.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <SparklesIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">Key Learning Connections</h3>
          </div>
          <div className="space-y-3">
            {problemSolutionMapping.keyConnections.map((connection, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-start space-x-3"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {connection}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Learning Journey */}
      {learningJourney && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/10 dark:to-yellow-900/10 p-6 rounded-2xl border border-amber-200 dark:border-amber-800"
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <AcademicCapIcon className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">Your Learning Journey</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-amber-700 dark:text-amber-300 text-sm">Before Project</h4>
              <p className="text-amber-600 dark:text-amber-400 text-xs leading-relaxed">
                {learningJourney.beforeProject}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-amber-700 dark:text-amber-300 text-sm">During Project</h4>
              <p className="text-amber-600 dark:text-amber-400 text-xs leading-relaxed">
                {learningJourney.duringProject}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-amber-700 dark:text-amber-300 text-sm">After Project</h4>
              <p className="text-amber-600 dark:text-amber-400 text-xs leading-relaxed">
                {learningJourney.afterProject}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-amber-700 dark:text-amber-300 text-sm">Real World</h4>
              <p className="text-amber-600 dark:text-amber-400 text-xs leading-relaxed">
                {learningJourney.realWorldApplication}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProblemSolutionMapping;
