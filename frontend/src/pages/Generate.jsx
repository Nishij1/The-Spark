import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  SparklesIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  AcademicCapIcon,
  CogIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useUserJourney } from '../context/UserJourneyContext';
import { useProjects } from '../hooks/useProjects';
import ProjectGeneratorModal from '../components/generator/ProjectGeneratorModal';
import SkillAssessmentModal from '../components/assessment/SkillAssessmentModal';
import ProgressIndicator from '../components/common/ProgressIndicator';
import { useToast } from '../components/Toast';

const Generate = () => {
  const { user } = useAuth();
  const { createProject } = useProjects();
  const { showSuccess, showError } = useToast();
  const {
    currentStep,
    hasCompletedAssessment,
    skillLevel,
    isLoading,
    completeAssessment,
    completeGeneration,
    navigateToStep,
    getProgress,
  } = useUserJourney();

  const [showGeneratorModal, setShowGeneratorModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);

  const handleSkillAssessmentComplete = async (assessment) => {
    try {
      const success = await completeAssessment(assessment);
      if (success) {
        showSuccess('Skill assessment completed! Now you can generate personalized projects.');
      } else {
        showError('Failed to save skill assessment');
      }
    } catch (error) {
      console.error('Error saving skill assessment:', error);
      showError('Failed to save skill assessment');
    }
  };

  const handleNavigateToGenerate = () => {
    setShowAssessmentModal(false);
    navigateToStep('generation');
    setTimeout(() => {
      setShowGeneratorModal(true);
    }, 300); // Small delay for smooth transition
  };

  const handleProjectGenerated = async (generatedProject) => {
    try {
      await createProject(generatedProject);
      completeGeneration([generatedProject]);
      showSuccess(`Project "${generatedProject.title}" created successfully!`);

      // Navigate to the new project or projects page
      // You can add navigation logic here
    } catch (error) {
      console.error('Error creating generated project:', error);
      showError('Failed to create project');
    }
  };

  const features = [
    {
      icon: LightBulbIcon,
      title: 'Concept to Project',
      description: 'Turn any learning concept into a hands-on project',
      color: 'yellow',
    },
    {
      icon: AcademicCapIcon,
      title: 'Transcript Analysis',
      description: 'Upload lecture transcripts and get project suggestions',
      color: 'blue',
    },
    {
      icon: RocketLaunchIcon,
      title: 'Multi-Domain Support',
      description: 'Generate projects for coding, hardware, design, and research',
      color: 'purple',
    },
    {
      icon: CogIcon,
      title: 'Adaptive Difficulty',
      description: 'Projects tailored to your skill level and experience',
      color: 'green',
    },
  ];

  const quickStartOptions = [
    {
      title: 'Web Development',
      description: 'Build modern web applications',
      example: 'React, Vue, Angular projects',
      icon: '💻',
      prompt: 'web development, modern frontend frameworks',
    },
    {
      title: 'Machine Learning',
      description: 'Explore AI and data science',
      example: 'Classification, prediction models',
      icon: '🤖',
      prompt: 'machine learning, data science, AI projects',
    },
    {
      title: 'IoT & Hardware',
      description: 'Build connected devices',
      example: 'Arduino, Raspberry Pi projects',
      icon: '🔧',
      prompt: 'IoT, Arduino, hardware projects, sensors',
    },
    {
      title: 'Mobile Apps',
      description: 'Create mobile applications',
      example: 'React Native, Flutter apps',
      icon: '📱',
      prompt: 'mobile app development, React Native, Flutter',
    },
    {
      title: 'Game Development',
      description: 'Build interactive games',
      example: 'Unity, web games, puzzles',
      icon: '🎮',
      prompt: 'game development, Unity, interactive games',
    },
    {
      title: 'Data Visualization',
      description: 'Create compelling data stories',
      example: 'Charts, dashboards, analytics',
      icon: '📊',
      prompt: 'data visualization, charts, dashboards, analytics',
    },
  ];

  const handleQuickStart = (prompt) => {
    // Pre-fill the generator with the quick start prompt
    setShowGeneratorModal(true);
    // You can pass the prompt to the modal if needed
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <CogIcon className="h-12 w-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl">
              <SparklesIcon className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            DIY Mission Engine
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Transform your learning into hands-on projects with AI-powered project generation.
            Never wonder "what should I build?" again.
          </p>

          {/* Progress Indicator */}
          {!isLoading && (
            <div className="mb-8 max-w-4xl mx-auto">
              <ProgressIndicator currentStep={currentStep} />
            </div>
          )}

          {/* Main CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {hasCompletedAssessment ? (
              <button
                onClick={() => setShowGeneratorModal(true)}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <SparklesIcon className="h-6 w-6" />
                <span>Generate AI Project</span>
              </button>
            ) : (
              <button
                onClick={() => setShowAssessmentModal(true)}
                className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <AcademicCapIcon className="h-6 w-6" />
                <span>Start with Skill Assessment</span>
              </button>
            )}
            
            {hasCompletedAssessment && (
              <button
                onClick={() => setShowAssessmentModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <CogIcon className="h-5 w-5" />
                <span>Retake Assessment</span>
              </button>
            )}
          </div>

          {skillLevel && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Current skill level: <span className="font-medium text-primary-600 dark:text-primary-400 capitalize">{skillLevel}</span>
            </div>
          )}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
              >
                <div className={`p-3 bg-${feature.color}-100 dark:bg-${feature.color}-900/20 rounded-xl w-fit mb-4`}>
                  <Icon className={`h-6 w-6 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick Start Section */}
        {hasCompletedAssessment && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Quick Start Templates
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Get started quickly with these popular project categories
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickStartOptions.map((option, index) => (
                <motion.button
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  onClick={() => handleQuickStart(option.prompt)}
                  className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-200 text-left group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{option.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {option.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        {option.description}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        {option.example}
                      </p>
                    </div>
                    <PlusIcon className="h-5 w-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Share Your Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Input concepts, transcripts, or topics you want to explore
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                AI Generates Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our AI creates personalized projects based on your skill level
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Build & Learn
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Follow step-by-step guidance and track your progress
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <ProjectGeneratorModal
        isOpen={showGeneratorModal}
        onClose={() => setShowGeneratorModal(false)}
        onProjectGenerated={handleProjectGenerated}
        userSkillLevel={skillLevel}
      />

      <SkillAssessmentModal
        isOpen={showAssessmentModal}
        onClose={() => setShowAssessmentModal(false)}
        onComplete={handleSkillAssessmentComplete}
        onNavigateToGenerate={handleNavigateToGenerate}
      />
    </div>
  );
};

export default Generate;
