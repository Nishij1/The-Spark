import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  BookmarkIcon,
  ShareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import { useProjects } from '../hooks/useProjects';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import ProjectStepsWithContext from '../components/project/ProjectStepsWithContext';
import LearningProgressTracker from '../components/project/LearningProgressTracker';
import ProblemSolutionMapping from '../components/project/ProblemSolutionMapping';
import LearningObjectives from '../components/project/LearningObjectives';
import ContextualReminder from '../components/project/ContextualReminder';
import ReflectionPrompts from '../components/project/ReflectionPrompts';
import { enhanceProjectWithLearningContext } from '../utils/projectEnhancer';

const ProjectExecution = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProject, updateProject } = useProjects();
  const { showSuccess, showError } = useToast();
  
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const [showContext, setShowContext] = useState(true);
  const [activeTab, setActiveTab] = useState('steps');
  const [showReminder, setShowReminder] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = async () => {
    try {
      setLoading(true);
      const projectData = await getProject(projectId);
      
      if (!projectData) {
        showError('Project not found');
        navigate('/dashboard');
        return;
      }

      // Enhance project with learning context if needed
      const enhancedProject = enhanceProjectWithLearningContext(
        projectData, 
        projectData.originalInput || projectData.description
      );
      
      setProject(enhancedProject);
      
      // Load saved progress
      if (enhancedProject.progress) {
        setCompletedSteps(new Set(enhancedProject.progress.completedSteps || []));
        setCurrentStep(enhancedProject.progress.currentStep || 0);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      showError('Failed to load project');
      navigate('/dashboard');
    } finally {
      setLoading(false);
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
      const updatedProject = {
        ...project,
        progress: {
          completedSteps: Array.from(newCompleted),
          currentStep: stepIndex === currentStep && isCompleted ? currentStep + 1 : currentStep,
          lastUpdated: new Date(),
          progressPercentage: (newCompleted.size / project.steps.length) * 100
        }
      };
      
      await updateProject(projectId, updatedProject);
      setProject(updatedProject);
      
      if (isCompleted) {
        showSuccess(`Step ${stepIndex + 1} completed! Great progress!`);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      showError('Failed to save progress');
    }
  };

  const tabs = [
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Project not found</p>
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
                <p className="text-gray-600 dark:text-gray-400">
                  {project.domain} • {project.skillLevel} • {project.estimatedTime}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowContext(!showContext)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                {showContext ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
                <span>Learning Context</span>
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
          className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border-b border-blue-200 dark:border-blue-800"
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
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
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
          {activeTab === 'steps' && (
            <ProjectStepsWithContext
              steps={project.steps}
              inputSource={project.originalInput || project.description}
              completedSteps={completedSteps}
              onStepCompletion={handleStepCompletion}
            />
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
