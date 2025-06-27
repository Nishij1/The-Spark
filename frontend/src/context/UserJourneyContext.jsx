import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { skillAssessmentService } from '../services/firestore';

const UserJourneyContext = createContext();

export const useUserJourney = () => {
  const context = useContext(UserJourneyContext);
  if (!context) {
    throw new Error('useUserJourney must be used within a UserJourneyProvider');
  }
  return context;
};

export const UserJourneyProvider = ({ children }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState('assessment');
  const [hasCompletedAssessment, setHasCompletedAssessment] = useState(false);
  const [skillLevel, setSkillLevel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [journeyData, setJourneyData] = useState({
    assessment: null,
    generatedProjects: [],
    selectedProject: null,
    currentProject: null,
  });

  // Journey steps configuration
  const journeySteps = [
    {
      id: 'assessment',
      title: 'Skill Assessment',
      description: 'Evaluate your experience level',
      completed: false,
    },
    {
      id: 'generation',
      title: 'AI Generation',
      description: 'Generate personalized projects',
      completed: false,
    },
    {
      id: 'selection',
      title: 'Project Selection',
      description: 'Choose your ideal project',
      completed: false,
    },
    {
      id: 'creation',
      title: 'Start Building',
      description: 'Begin your project journey',
      completed: false,
    },
  ];

  // Load user's journey state on mount
  useEffect(() => {
    const loadUserJourney = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user has completed skill assessment
        const assessment = await skillAssessmentService.getLatest(user.uid);
        if (assessment) {
          setHasCompletedAssessment(true);
          setSkillLevel(assessment.overallLevel);
          setJourneyData(prev => ({ ...prev, assessment }));
          
          // If assessment is complete, move to generation step
          setCurrentStep('generation');
        } else {
          setCurrentStep('assessment');
        }
      } catch (error) {
        console.error('Error loading user journey:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserJourney();
  }, [user]);

  // Complete assessment step
  const completeAssessment = async (assessment) => {
    try {
      await skillAssessmentService.save(user.uid, assessment);
      setHasCompletedAssessment(true);
      setSkillLevel(assessment.overallLevel);
      setJourneyData(prev => ({ ...prev, assessment }));
      setCurrentStep('generation');
      return true;
    } catch (error) {
      console.error('Error completing assessment:', error);
      return false;
    }
  };

  // Complete generation step
  const completeGeneration = (projects) => {
    setJourneyData(prev => ({ ...prev, generatedProjects: projects }));
    setCurrentStep('selection');
  };

  // Complete selection step
  const completeSelection = (project) => {
    setJourneyData(prev => ({ ...prev, selectedProject: project }));
    setCurrentStep('creation');
  };

  // Complete creation step (project started)
  const completeCreation = (project) => {
    setJourneyData(prev => ({ ...prev, currentProject: project }));
    // Journey complete - could reset or track ongoing projects
  };

  // Navigate to specific step (with validation)
  const navigateToStep = (stepId) => {
    const stepIndex = journeySteps.findIndex(step => step.id === stepId);
    const currentStepIndex = journeySteps.findIndex(step => step.id === currentStep);
    
    // Only allow navigation to current step or previous steps
    if (stepIndex <= currentStepIndex || stepIndex === currentStepIndex + 1) {
      setCurrentStep(stepId);
      return true;
    }
    return false;
  };

  // Reset journey (for retaking assessment, etc.)
  const resetJourney = () => {
    setCurrentStep('assessment');
    setHasCompletedAssessment(false);
    setSkillLevel(null);
    setJourneyData({
      assessment: null,
      generatedProjects: [],
      selectedProject: null,
      currentProject: null,
    });
  };

  // Get journey progress percentage
  const getProgress = () => {
    const currentStepIndex = journeySteps.findIndex(step => step.id === currentStep);
    return ((currentStepIndex + 1) / journeySteps.length) * 100;
  };

  // Get next step
  const getNextStep = () => {
    const currentStepIndex = journeySteps.findIndex(step => step.id === currentStep);
    if (currentStepIndex < journeySteps.length - 1) {
      return journeySteps[currentStepIndex + 1];
    }
    return null;
  };

  // Get previous step
  const getPreviousStep = () => {
    const currentStepIndex = journeySteps.findIndex(step => step.id === currentStep);
    if (currentStepIndex > 0) {
      return journeySteps[currentStepIndex - 1];
    }
    return null;
  };

  // Check if user can proceed to next step
  const canProceedToNext = () => {
    switch (currentStep) {
      case 'assessment':
        return hasCompletedAssessment;
      case 'generation':
        return journeyData.generatedProjects.length > 0;
      case 'selection':
        return journeyData.selectedProject !== null;
      case 'creation':
        return true; // Always can proceed from creation
      default:
        return false;
    }
  };

  // Get step status
  const getStepStatus = (stepId) => {
    const stepIndex = journeySteps.findIndex(step => step.id === stepId);
    const currentStepIndex = journeySteps.findIndex(step => step.id === currentStep);
    
    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'upcoming';
  };

  const value = {
    // State
    currentStep,
    hasCompletedAssessment,
    skillLevel,
    isLoading,
    journeyData,
    journeySteps,
    
    // Actions
    completeAssessment,
    completeGeneration,
    completeSelection,
    completeCreation,
    navigateToStep,
    resetJourney,
    
    // Helpers
    getProgress,
    getNextStep,
    getPreviousStep,
    canProceedToNext,
    getStepStatus,
  };

  return (
    <UserJourneyContext.Provider value={value}>
      {children}
    </UserJourneyContext.Provider>
  );
};
