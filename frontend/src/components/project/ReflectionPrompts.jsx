import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { generateReflectionPrompts } from '../../utils/projectEnhancer';

const ReflectionPrompts = ({ 
  project, 
  currentStep, 
  completedSteps = [], 
  originalInput,
  onSaveReflection,
  className = '' 
}) => {
  const [activePrompt, setActivePrompt] = useState(0);
  const [responses, setResponses] = useState({});
  const [showSummary, setShowSummary] = useState(false);
  const [reflectionType, setReflectionType] = useState('step');

  const currentStepData = project.steps?.[currentStep];
  const progressPercentage = (completedSteps.length / (project.steps?.length || 1)) * 100;

  // Generate different types of reflection prompts
  const getReflectionPrompts = () => {
    const stepPrompts = currentStepData?.reflectionPrompts || 
      generateReflectionPrompts(project, currentStepData?.title || '', currentStep);

    const progressPrompts = [
      `Looking back at your original goal "${originalInput || 'to learn new concepts'}", how has your understanding evolved?`,
      `What connections are you starting to see between different concepts in this project?`,
      `If you had to explain what you've learned so far to a friend, what would you say?`,
      `What has surprised you most about this learning journey?`
    ];

    const completionPrompts = [
      `How has completing this project changed your understanding of "${originalInput || 'your learning goal'}"?`,
      `What specific skills do you now have that you didn't have before?`,
      `How would you approach a similar challenge in the future?`,
      `What advice would you give to someone starting this same learning journey?`,
      `How can you apply what you've learned to other areas of your life or work?`
    ];

    switch (reflectionType) {
      case 'step':
        return stepPrompts;
      case 'progress':
        return progressPrompts;
      case 'completion':
        return completionPrompts;
      default:
        return stepPrompts;
    }
  };

  const prompts = getReflectionPrompts();

  useEffect(() => {
    // Automatically switch reflection type based on progress
    if (progressPercentage === 100) {
      setReflectionType('completion');
    } else if (progressPercentage >= 50) {
      setReflectionType('progress');
    } else {
      setReflectionType('step');
    }
  }, [progressPercentage]);

  const handleResponseChange = (promptIndex, response) => {
    setResponses(prev => ({
      ...prev,
      [promptIndex]: response
    }));
  };

  const handleSaveResponse = (promptIndex) => {
    const response = responses[promptIndex];
    if (response && onSaveReflection) {
      onSaveReflection({
        stepIndex: currentStep,
        promptIndex,
        prompt: prompts[promptIndex],
        response,
        timestamp: new Date(),
        reflectionType
      });
    }
  };

  const getReflectionTypeInfo = () => {
    switch (reflectionType) {
      case 'step':
        return {
          title: '🎯 Step Reflection',
          description: 'Reflect on what you learned in this specific step',
          color: 'blue'
        };
      case 'progress':
        return {
          title: '📈 Progress Reflection',
          description: 'Think about your overall learning journey so far',
          color: 'purple'
        };
      case 'completion':
        return {
          title: '🏆 Completion Reflection',
          description: 'Celebrate and consolidate your learning achievements',
          color: 'green'
        };
      default:
        return {
          title: '💭 Reflection',
          description: 'Take a moment to think about your learning',
          color: 'blue'
        };
    }
  };

  const typeInfo = getReflectionTypeInfo();

  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10',
      border: 'border-blue-200 dark:border-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      text: 'text-blue-800 dark:text-blue-200'
    },
    purple: {
      bg: 'from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10',
      border: 'border-purple-200 dark:border-purple-800',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      text: 'text-purple-800 dark:text-purple-200'
    },
    green: {
      bg: 'from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10',
      border: 'border-green-200 dark:border-green-800',
      button: 'bg-green-600 hover:bg-green-700 text-white',
      text: 'text-green-800 dark:text-green-200'
    }
  };

  const colors = colorClasses[typeInfo.color] || colorClasses.blue;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl p-6`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <ChatBubbleLeftRightIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <div>
              <h2 className={`text-lg font-semibold ${colors.text}`}>
                {typeInfo.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeInfo.description}
              </p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setReflectionType('step')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                reflectionType === 'step' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Step
            </button>
            <button
              onClick={() => setReflectionType('progress')}
              className={`px-3 py-1 text-xs rounded-full transition-colors ${
                reflectionType === 'progress' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Progress
            </button>
            {progressPercentage === 100 && (
              <button
                onClick={() => setReflectionType('completion')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  reflectionType === 'completion' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Complete
              </button>
            )}
          </div>
        </div>

        {/* Connection to Original Goal */}
        {originalInput && (
          <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <strong>Remember your goal:</strong> "{originalInput}"
            </p>
          </div>
        )}
      </div>

      {/* Reflection Prompts */}
      <div className="space-y-4">
        {prompts.map((prompt, index) => (
          <motion.div
            key={`${reflectionType}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start space-x-3 mb-4">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex-shrink-0">
                <LightBulbIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Reflection Question {index + 1}
                </h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                  {prompt}
                </p>
              </div>
            </div>

            {/* Response Area */}
            <div className="space-y-3">
              <textarea
                value={responses[index] || ''}
                onChange={(e) => handleResponseChange(index, e.target.value)}
                placeholder="Take your time to reflect and write your thoughts..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                rows={4}
              />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {responses[index]?.length || 0} characters
                </span>
                
                <button
                  onClick={() => handleSaveResponse(index)}
                  disabled={!responses[index]?.trim()}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    responses[index]?.trim()
                      ? colors.button
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <PencilIcon className="h-4 w-4" />
                  <span>Save Reflection</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Learning Summary */}
      {Object.keys(responses).length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <SparklesIcon className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
              Your Learning Insights
            </h3>
          </div>
          
          <p className="text-amber-700 dark:text-amber-300 text-sm mb-4">
            Your reflections show real growth! You're not just completing steps - you're building deep understanding 
            and connecting new knowledge to your original goal.
          </p>
          
          <div className="text-xs text-amber-600 dark:text-amber-400">
            💡 Tip: Review your reflections later to see how much you've learned!
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ReflectionPrompts;
