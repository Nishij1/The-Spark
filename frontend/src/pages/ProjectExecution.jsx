import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  BookmarkIcon,
  ShareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useProject } from '../hooks/useProjects';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ProjectStepsWithContext from '../components/project/ProjectStepsWithContext';
import LearningProgressTracker from '../components/project/LearningProgressTracker';
import ProblemSolutionMapping from '../components/project/ProblemSolutionMapping';
import LearningObjectives from '../components/project/LearningObjectives';
import ContextualReminder from '../components/project/ContextualReminder';
import ReflectionPrompts from '../components/project/ReflectionPrompts';


const ProjectExecution = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { project, loading, error, updateProject } = useProject(projectId);
  const { showSuccess, showError } = useToast();
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [showContext, setShowContext] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showReminder, setShowReminder] = useState(true);
  const [timeSpent, setTimeSpent] = useState(0);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [isProjectStarted, setIsProjectStarted] = useState(false);

  // Handle project loading errors and setup
  useEffect(() => {
    if (error) {
      console.error('Error loading project:', error);
      showError('Failed to load project. Please try again.');
      // Don't navigate away immediately, give user a chance to retry
      return;
    }

    if (!loading && !project) {
      showError('Project not found');
      setTimeout(() => navigate('/dashboard'), 2000);
      return;
    }

    if (project) {
      // Ensure project has steps array
      if (!project.steps || !Array.isArray(project.steps)) {
        console.warn('Project missing steps array, creating default steps');
        project.steps = [
          {
            title: 'Get Started',
            description: 'Begin working on your project',
            estimatedTime: '30 minutes'
          }
        ];
      }

      // Load saved progress when project is loaded
      if (project.progress) {
        setCompletedSteps(new Set(project.progress.completedSteps || []));
        setCurrentStep(project.progress.currentStep || 0);
        setTimeSpent(project.progress.timeSpent || 0);
        setIsProjectStarted(project.progress.status === 'in_progress' || project.progress.status === 'completed');
      }
    }
  }, [project, loading, error, navigate, showError]);

  // Time tracking effect
  useEffect(() => {
    let interval;
    if (isProjectStarted && sessionStartTime) {
      interval = setInterval(() => {
        const currentTime = Date.now();
        const sessionTime = Math.floor((currentTime - sessionStartTime) / 1000);
        setTimeSpent(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isProjectStarted, sessionStartTime]);

  // Start project function
  const handleStartProject = async () => {
    try {
      setIsProjectStarted(true);
      setSessionStartTime(Date.now());
      setActiveTab('steps');

      // Initialize progress if it doesn't exist
      const currentProgress = project.progress || {};
      const progressUpdate = {
        progress: {
          ...currentProgress,
          status: 'in_progress',
          startedAt: new Date(),
          lastWorkedOn: new Date(),
          completedSteps: currentProgress.completedSteps || [],
          currentStep: currentProgress.currentStep || 0,
          timeSpent: currentProgress.timeSpent || 0,
          progressPercentage: currentProgress.progressPercentage || 0
        }
      };

      await updateProject(progressUpdate);
      showSuccess('Project started! Good luck with your learning journey!');
    } catch (error) {
      console.error('Error starting project:', error);
      showError('Failed to start project. Continuing in local mode...');
      // Continue with local state even if database update fails
    }
  };

  const handleStepCompletion = async (stepIndex, isCompleted) => {
    const newCompleted = new Set(completedSteps);

    if (isCompleted) {
      newCompleted.add(stepIndex);
      if (stepIndex === currentStep) {
        setCurrentStep(Math.min(stepIndex + 1, project.steps.length - 1));
      }
    } else {
      newCompleted.delete(stepIndex);
      if (stepIndex < currentStep) {
        setCurrentStep(stepIndex);
      }
    }

    setCompletedSteps(newCompleted);

    // Save progress to database
    try {
      const currentProgress = project.progress || {};
      const newCurrentStep = stepIndex === currentStep && isCompleted ? currentStep + 1 : currentStep;
      const newProgressPercentage = (newCompleted.size / project.steps.length) * 100;
      const newStatus = newCompleted.size === project.steps.length ? 'completed' : 'in_progress';
      const isProjectCompleted = newCompleted.size === project.steps.length;

      const progressUpdate = {
        progress: {
          ...currentProgress,
          completedSteps: Array.from(newCompleted),
          currentStep: newCurrentStep,
          lastUpdated: new Date(),
          progressPercentage: newProgressPercentage,
          status: newStatus,
          timeSpent: timeSpent
        }
      };

      // If project is completed, also update the main project status
      if (isProjectCompleted) {
        progressUpdate.status = 'completed';
        progressUpdate.completedAt = new Date();
      }

      await updateProject(progressUpdate);

      if (isCompleted) {
        showSuccess(`Step ${stepIndex + 1} completed! Great progress!`);

        // Show special completion message if project is fully completed
        if (isProjectCompleted) {
          setTimeout(() => {
            showSuccess('🎉 Congratulations! You have completed the entire project! All steps with quizzes are finished.');
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      showError('Progress saved locally. Will sync when connection is restored.');
      // Continue with local state even if database update fails
    }
  };

  // Format time helper function
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Project Overview', icon: '🏠' },
    { id: 'steps', label: 'Project Steps', icon: '📋' },
    { id: 'context', label: 'Learning Context', icon: '🎯' },
    { id: 'objectives', label: 'Learning Goals', icon: '🎓' },
    { id: 'reflection', label: 'Reflection', icon: '💭' },
    { id: 'progress', label: 'Progress Tracking', icon: '📈' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Project Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The project you're looking for doesn't exist or couldn't be loaded.
            </p>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {project.title}
                </h1>
                <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-400">
                  <span>{project.domain}</span>
                  <span>•</span>
                  <span>{project.skillLevel}</span>
                  <span>•</span>
                  <span>{project.estimatedTime}</span>
                  <span>•</span>
                  <span className="text-pur[le-600 dark:text-purple-400 font-medium">
                    {completedSteps.size}/{project.steps.length} steps completed
                  </span>
                  <span>•</span>
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {project.steps && project.steps.length > 0
                      ? Math.round((completedSteps.size / project.steps.length) * 100)
                      : 0}% progress
                  </span>
                  {isProjectStarted && (
                    <>
                      <span>•</span>
                      <span className="text-purple-600 dark:text-purple-400 font-medium">
                        ⏱️ {formatTime(timeSpent)} spent
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {!isProjectStarted && (
                <button
                  onClick={handleStartProject}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <PlayCircleIcon className="h-5 w-5" />
                  <span>Start Project</span>
                </button>
              )}

              {isProjectStarted && (
                <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span>In Progress</span>
                </div>
              )}

              <button
                onClick={() => setShowContext(!showContext)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors"
              >
                {showContext ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                <span>Context</span>
              </button>

              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <BookmarkIcon className="h-5 w-5" />
              </button>

              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <ShareIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Context Panel */}
      {showContext && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border-b border-purple-200 dark:border-purple-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <LearningProgressTracker
              project={project}
              completedSteps={Array.from(completedSteps)}
              currentStep={currentStep}
              originalInput={project.originalInput || project.description}
            />
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Contextual Reminder */}
        {showReminder && (
          <ContextualReminder
            project={project}
            currentStep={currentStep}
            completedSteps={Array.from(completedSteps)}
            originalInput={project.originalInput || project.description}
            onDismiss={() => setShowReminder(false)}
            className="mb-8"
          />
        )}

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Project Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {project.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full">
                      {project.domain}
                    </span>
                    <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full">
                      {project.skillLevel}
                    </span>
                  </div>
                </div>

                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {completedSteps.size}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Steps Completed</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                      {project.steps && project.steps.length > 0
                        ? Math.round((completedSteps.size / project.steps.length) * 100)
                        : 0}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {isProjectStarted ? formatTime(timeSpent) : '0m'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Time Spent</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {project.estimatedTime}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Estimated Time</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  {!isProjectStarted ? (
                    <button
                      onClick={handleStartProject}
                      className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      <PlayCircleIcon className="h-5 w-5" />
                      <span>Start Project</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setActiveTab('steps')}
                      className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-lg"
                    >
                      <span>📋</span>
                      <span>Continue Working</span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab('objectives')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span>🎓</span>
                    <span>Learning Goals</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('context')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span>🎯</span>
                    <span>Context</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('progress')}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <span>📈</span>
                    <span>Progress</span>
                  </button>
                </div>
              </motion.div>

              {/* Technologies & Tools */}
              {project.technologies && project.technologies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Technologies & Tools
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Learning Objectives Preview */}
              {project.learningObjectives && project.learningObjectives.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    What You'll Learn
                  </h3>
                  <ul className="space-y-2">
                    {project.learningObjectives.slice(0, 3).map((objective, index) => {
                      // Handle different objective formats safely
                      let objectiveText = '';
                      if (typeof objective === 'string') {
                        objectiveText = objective;
                      } else if (objective && typeof objective === 'object' && objective.objective) {
                        objectiveText = objective.objective;
                      } else {
                        objectiveText = 'Learn new concepts';
                      }

                      return (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span className="text-gray-700 dark:text-gray-300">{objectiveText}</span>
                        </li>
                      );
                    })}
                    {project.learningObjectives.length > 3 && (
                      <li className="text-gray-500 dark:text-gray-400 text-sm">
                        +{project.learningObjectives.length - 3} more objectives
                      </li>
                    )}
                  </ul>
                </motion.div>
              )}
            </div>
          )}

          {activeTab === 'steps' && (
            <div>
              {project.steps && project.steps.length > 0 ? (
                <ProjectStepsWithContext
                  steps={project.steps}
                  inputSource={project.originalInput || project.description}
                  completedSteps={completedSteps}
                  onStepCompletion={handleStepCompletion}
                  projectId={project.id}
                  projectDifficulty={project.difficulty || 5}
                  projectDomain={project.domain || 'coding'}
                />
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Steps Available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    This project doesn't have structured steps yet. You can still work on it using the other tabs.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setActiveTab('context')}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      View Context
                    </button>
                    <button
                      onClick={() => setActiveTab('objectives')}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Learning Goals
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'context' && (
            <ProblemSolutionMapping project={project} />
          )}

          {activeTab === 'objectives' && (
            <LearningObjectives learningObjectives={project.learningObjectives} />
          )}

          {activeTab === 'reflection' && (
            <ReflectionPrompts
              project={project}
              currentStep={currentStep}
              completedSteps={Array.from(completedSteps)}
              originalInput={project.originalInput || project.description}
              onSaveReflection={(reflection) => {
                console.log('Saving reflection:', reflection);
                // TODO: Save to database
                showSuccess('Reflection saved!');
              }}
            />
          )}

          {activeTab === 'progress' && (
            <LearningProgressTracker
              project={project}
              completedSteps={Array.from(completedSteps)}
              currentStep={currentStep}
              originalInput={project.originalInput || project.description}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectExecution;
