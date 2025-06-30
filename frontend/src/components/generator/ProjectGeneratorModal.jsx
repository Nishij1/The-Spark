import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  SparklesIcon,
  DocumentTextIcon,
  LinkIcon,
  LightBulbIcon,
  CogIcon,
  PlayIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
import { PROJECT_DOMAINS, SKILL_LEVELS } from '../../services/firestore';
import { geminiApi } from '../../services/geminiApi';
import ProjectDetailModal from '../project/ProjectDetailModal';
import { enhanceProjectWithLearningContext } from '../../utils/projectEnhancer';
import { runFullDiagnostic, formatDiagnosticResults } from '../../utils/debugUtils';

const INPUT_TYPES = {
  CONCEPT: 'concept',
  TRANSCRIPT: 'transcript',
  URL: 'url',
  TOPIC: 'topic',
};

// Fallback project creation function
const createFallbackProject = (input, skillLevel, domain) => {
  const difficultyMap = {
    [SKILL_LEVELS.BEGINNER]: 3,
    [SKILL_LEVELS.INTERMEDIATE]: 5,
    [SKILL_LEVELS.ADVANCED]: 8
  };

  return {
    title: `Learn ${input}`,
    name: `Learn ${input}`,
    description: `A hands-on project to help you learn and practice ${input}. This project will guide you through the fundamentals and help you build practical skills.`,
    domain: domain,
    skillLevel: skillLevel,
    difficulty: difficultyMap[skillLevel] || 5,
    estimatedTime: skillLevel === SKILL_LEVELS.BEGINNER ? '2-4 hours' : skillLevel === SKILL_LEVELS.INTERMEDIATE ? '4-8 hours' : '8-16 hours',
    learningObjectives: [
      `Understand the core concepts of ${input}`,
      `Apply ${input} in a practical context`,
      `Build a working project using ${input}`,
      `Gain confidence with ${input} fundamentals`
    ],
    technologies: [input],
    steps: [
      {
        title: 'Research and Planning',
        description: `Research the fundamentals of ${input} and plan your learning approach.`,
        estimatedTime: '30-60 minutes',
        learningFocus: 'Understanding requirements and planning'
      },
      {
        title: 'Setup and Environment',
        description: `Set up your development environment and tools needed for ${input}.`,
        estimatedTime: '30-45 minutes',
        learningFocus: 'Environment configuration'
      },
      {
        title: 'Core Implementation',
        description: `Implement the main features and functionality related to ${input}.`,
        estimatedTime: '2-4 hours',
        learningFocus: 'Hands-on development'
      },
      {
        title: 'Testing and Refinement',
        description: `Test your implementation and make improvements.`,
        estimatedTime: '1-2 hours',
        learningFocus: 'Quality assurance and optimization'
      },
      {
        title: 'Documentation and Reflection',
        description: `Document your work and reflect on what you learned.`,
        estimatedTime: '30 minutes',
        learningFocus: 'Documentation and self-assessment'
      }
    ],
    type: 'generated',
    isGenerated: true,
    generatedAt: new Date(),
    inputSource: input,
    isFallback: true
  };
};

export default function ProjectGeneratorModal({ isOpen, onClose, onProjectGenerated, userSkillLevel }) {
  const [step, setStep] = useState(1);
  const [inputType, setInputType] = useState(INPUT_TYPES.CONCEPT);
  const [inputData, setInputData] = useState('');
  const [selectedDomains, setSelectedDomains] = useState([PROJECT_DOMAINS.CODING]);
  const [skillLevel, setSkillLevel] = useState(userSkillLevel || SKILL_LEVELS.INTERMEDIATE);
  const [preferences, setPreferences] = useState({
    timeCommitment: 'moderate',
    complexity: 'balanced',
    learningGoals: [],
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProjects, setGeneratedProjects] = useState([]);
  const [error, setError] = useState('');
  const [selectedProjectForDetail, setSelectedProjectForDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const inputTypeOptions = [
    {
      type: INPUT_TYPES.CONCEPT,
      icon: LightBulbIcon,
      title: 'Learning Concept',
      description: 'Enter a concept or skill you want to practice',
      placeholder: 'e.g., React hooks, machine learning, 3D printing...',
    },
    {
      type: INPUT_TYPES.TRANSCRIPT,
      icon: DocumentTextIcon,
      title: 'Video Transcript',
      description: 'Paste a transcript from a lecture or tutorial',
      placeholder: 'Paste the transcript content here...',
    },
    {
      type: INPUT_TYPES.URL,
      icon: LinkIcon,
      title: 'Learning Resource URL',
      description: 'Provide a URL to a tutorial, course, or article',
      placeholder: 'https://example.com/tutorial...',
    },
    {
      type: INPUT_TYPES.TOPIC,
      icon: SparklesIcon,
      title: 'General Topic',
      description: 'Describe what you want to learn or build',
      placeholder: 'e.g., Build a mobile app, Learn data visualization...',
    },
  ];

  const domainOptions = [
    { value: PROJECT_DOMAINS.CODING, label: 'Coding', icon: '💻', color: 'blue' },
    { value: PROJECT_DOMAINS.HARDWARE, label: 'Hardware', icon: '🔧', color: 'orange' },
    { value: PROJECT_DOMAINS.DESIGN, label: 'Design', icon: '🎨', color: 'purple' },
    { value: PROJECT_DOMAINS.RESEARCH, label: 'Research', icon: '🔬', color: 'green' },
  ];

  const timeCommitmentOptions = [
    { value: 'light', label: '1-3 hours', description: 'Quick projects' },
    { value: 'moderate', label: '4-8 hours', description: 'Weekend projects' },
    { value: 'heavy', label: '1-2 weeks', description: 'Comprehensive projects' },
    { value: 'extensive', label: '1+ months', description: 'Long-term projects' },
  ];

  const handleDomainToggle = (domain) => {
    setSelectedDomains(prev => 
      prev.includes(domain)
        ? prev.filter(d => d !== domain)
        : [...prev, domain]
    );
  };

  const handleGenerate = async () => {
    console.log('🚀 Starting project generation...', {
      inputData: inputData.trim(),
      selectedDomains,
      skillLevel,
      preferences
    });

    if (!inputData.trim()) {
      setError('Please provide input for project generation');
      return;
    }

    if (selectedDomains.length === 0) {
      setError('Please select at least one domain');
      return;
    }

    // Check if API key is available
    const hasApiKey = import.meta.env.VITE_GEMINI_API_KEY &&
                     import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
                     import.meta.env.VITE_GEMINI_API_KEY !== '';

    if (!hasApiKey) {
      setError('Gemini API key is not configured. Please check your environment variables.');
      console.error('❌ Missing or invalid Gemini API key');
      return;
    }

    setIsGenerating(true);
    setError('');
    setGeneratedProjects([]);

    try {
      const projects = [];

      console.log(`📝 Generating projects for ${selectedDomains.length} domain(s)...`);

      // Generate projects for each selected domain
      for (const domain of selectedDomains) {
        try {
          console.log(`🎯 Generating project for domain: ${domain}`);

          const rawProject = await geminiApi.generateProject(
            inputData,
            skillLevel,
            domain,
            preferences
          );

          console.log(`✅ Successfully generated ${domain} project:`, rawProject);

          // Enhance project with learning context if needed
          const enhancedProject = enhanceProjectWithLearningContext(rawProject, inputData);
          projects.push(enhancedProject);

          console.log(`🔧 Enhanced project:`, enhancedProject);
        } catch (domainError) {
          console.error(`❌ Failed to generate ${domain} project:`, domainError);
          // Add domain-specific error to show user which domains failed
          setError(prev => prev ? `${prev}\n• ${domain}: ${domainError.message}` : `• ${domain}: ${domainError.message}`);
        }
      }

      console.log(`📊 Generation complete. Generated ${projects.length} projects out of ${selectedDomains.length} domains.`);

      if (projects.length === 0) {
        console.log('⚠️ No projects generated via AI, creating fallback project...');

        // Create a fallback project if AI generation completely fails
        const fallbackProject = createFallbackProject(inputData, skillLevel, selectedDomains[0]);
        projects.push(fallbackProject);

        setError('AI generation failed, but we created a basic project structure for you. You can customize it further.');
      }

      setGeneratedProjects(projects);
      setStep(3);
      console.log('🎉 Project generation successful!');
    } catch (error) {
      console.error('💥 Error in project generation:', error);
      const errorMessage = error.message || 'Failed to generate projects. Please try again.';
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectProject = (project) => {
    onProjectGenerated(project);
    onClose();
  };

  const handleSaveForLater = async (project) => {
    try {
      // Add a "saved" status to the project
      const savedProject = {
        ...project,
        status: 'saved',
        savedAt: new Date(),
      };
      await onProjectGenerated(savedProject);
      // Don't close the modal, let user continue browsing
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project. Please try again.');
    }
  };

  const handleViewDetails = (project) => {
    setSelectedProjectForDetail(project);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedProjectForDetail(null);
  };

  const handleRetryGeneration = () => {
    setError('');
    handleGenerate();
  };

  const resetGenerator = () => {
    setStep(1);
    setInputData('');
    setGeneratedProjects([]);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-purple-500  to-purple-200 px-8 py-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">AI Project Generator</h1>
                  <p className="text-white/80">Transform your learning into hands-on projects</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Step Indicator */}
            <div className="relative mt-6 flex items-center justify-center space-x-4">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum 
                      ? 'bg-white text-purple-600' 
                      : 'bg-white/20 text-white/60'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-12 h-0.5 mx-2 ${
                      step > stepNum ? 'bg-white' : 'bg-white/20'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      What would you like to turn into a project?
                    </h2>
                    
                    {/* Input Type Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {inputTypeOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.type}
                            onClick={() => setInputType(option.type)}
                            className={`p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                              inputType === option.type
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-primary-300'
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <Icon className="h-6 w-6 text-purple-500 mt-1" />
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                  {option.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {option.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Input Field */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {inputTypeOptions.find(opt => opt.type === inputType)?.title}
                      </label>
                      <textarea
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        placeholder={inputTypeOptions.find(opt => opt.type === inputType)?.placeholder}
                        rows={inputType === INPUT_TYPES.TRANSCRIPT ? 8 : 4}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      disabled={!inputData.trim()}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        !inputData.trim()
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-purple-300 to-purple-600 hover:from-purple-600 hover:to-purple-400 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                      }`}
                    >
                      Next: Configure Settings
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Customize Your Project Generation
                  </h2>

                  {/* Domain Selection */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Project Domains
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {domainOptions.map((domain) => (
                        <button
                          key={domain.value}
                          onClick={() => handleDomainToggle(domain.value)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                            selectedDomains.includes(domain.value)
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-purple-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{domain.icon}</div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {domain.label}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skill Level */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Skill Level
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.values(SKILL_LEVELS).map((level) => (
                        <button
                          key={level}
                          onClick={() => setSkillLevel(level)}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            skillLevel === level
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-primary-300'
                          }`}
                        >
                          <div className="text-center font-medium text-gray-900 dark:text-white capitalize">
                            {level}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Commitment */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      Time Commitment
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {timeCommitmentOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setPreferences(prev => ({ ...prev, timeCommitment: option.value }))}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                            preferences.timeCommitment === option.value
                              ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:border-primary-300'
                          }`}
                        >
                          <div className="text-center">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {option.label}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {option.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className={`p-4 border rounded-xl ${
                      error.includes('✅')
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : error.includes('Running diagnostic')
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                      <p className={`text-sm whitespace-pre-line ${
                        error.includes('✅')
                          ? 'text-green-700 dark:text-green-400'
                          : error.includes('Running diagnostic')
                          ? 'text-blue-700 dark:text-blue-400'
                          : 'text-red-700 dark:text-red-400'
                      }`}>
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Help Message */}
                  <div className="p-4 bg-blue-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                      💡 Troubleshooting Tips
                    </h4>
                    <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                      <li>• Click "🏥 Diagnose" to check your setup</li>
                      <li>• Make sure your Gemini API key is configured</li>
                      <li>• Check your internet connection</li>
                      <li>• Try different input text if generation fails</li>
                    </ul>
                  </div>

                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Previous
                    </button>
                    <div className="flex space-x-3">
                      {/* Diagnostic Button */}
                      <button
                        onClick={async () => {
                          console.log('🏥 Running full diagnostic...');
                          setError('Running diagnostic...');
                          try {
                            const results = await runFullDiagnostic();
                            const message = formatDiagnosticResults(results);
                            setError(message);

                            // Also show in alert for immediate visibility
                            alert(message);
                          } catch (diagError) {
                            console.error('❌ Diagnostic failed:', diagError);
                            setError(`❌ Diagnostic failed: ${diagError.message}`);
                          }
                        }}
                        disabled={isGenerating}
                        className="px-4 py-3 border border-purple-300 dark:border-purple-600 text-purple-700 dark:text-purple-300 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors text-sm disabled:opacity-50"
                      >
                        🏥 Diagnose
                      </button>
                      <button
                        onClick={handleGenerate}
                        disabled={isGenerating || selectedDomains.length === 0}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                          isGenerating || selectedDomains.length === 0
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        }`}
                      >
                        {isGenerating ? (
                          <>
                            <CogIcon className="h-5 w-5 animate-spin" />
                            <span>Generating Projects...</span>
                          </>
                        ) : (
                          <>
                            <PlayIcon className="h-5 w-5" />
                            <span>Generate Projects</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Generated Projects
                    </h2>
                    <button
                      onClick={resetGenerator}
                      className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Generate New
                    </button>
                  </div>

                  {error && generatedProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-red-400 mb-4">
                        <XMarkIcon className="h-12 w-12 mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Generation Failed
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error}
                      </p>
                      <div className="flex justify-center space-x-4">
                        <button
                          onClick={handleRetryGeneration}
                          disabled={isGenerating}
                          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                        >
                          {isGenerating ? 'Retrying...' : 'Try Again'}
                        </button>
                        <button
                          onClick={() => setStep(2)}
                          className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          Change Settings
                        </button>
                      </div>
                    </div>
                  ) : generatedProjects.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <CogIcon className="h-12 w-12 mx-auto animate-spin" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        Generating your personalized projects...
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {generatedProjects.map((project, index) => (
                        <motion.div
                          key={project.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <span className="text-2xl">
                                  {domainOptions.find(d => d.value === project.domain)?.icon || '💻'}
                                </span>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  {project.title}
                                </h3>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 mb-3">
                                {project.description}
                              </p>

                              {/* Project Metadata */}
                              <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">
                                  {project.domain}
                                </span>
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full">
                                  {project.skillLevel}
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full">
                                  {project.estimatedTime}
                                </span>
                                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm rounded-full">
                                  Difficulty: {project.difficulty}/10
                                </span>
                              </div>

                              {/* Learning Objectives */}
                              {project.learningObjectives && project.learningObjectives.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Learning Objectives:
                                  </h4>
                                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                    {project.learningObjectives.slice(0, 3).map((objective, idx) => {
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
                                        <li key={idx} className="flex items-center space-x-2">
                                          <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                                          <span>{objectiveText}</span>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </div>
                              )}

                              {/* Technologies */}
                              {project.technologies && project.technologies.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Technologies:
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {project.technologies.slice(0, 5).map((tech, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs rounded"
                                      >
                                        {tech}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Steps Preview */}
                              {project.steps && project.steps.length > 0 && (
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Project Steps ({project.steps.length} total):
                                  </h4>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {project.steps.slice(0, 2).map((step, idx) => (
                                      <div key={idx} className="flex items-start space-x-2 mb-1">
                                        <span className="text-purple-500 font-medium">{idx + 1}.</span>
                                        <span>{step.title}</span>
                                      </div>
                                    ))}
                                    {project.steps.length > 2 && (
                                      <div className="text-gray-500 dark:text-gray-500 ml-4">
                                        ... and {project.steps.length - 2} more steps
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => handleSaveForLater(project)}
                                className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                              >
                                Save for Later
                              </button>
                              <button
                                onClick={() => handleViewDetails(project)}
                                className="flex items-center space-x-2 px-4 py-2 text-sm bg-urple-100 dark:bg-urple-900/30 text-urple-700 dark:text-urple-300 rounded-lg hover:bg-urple-200 dark:hover:bg-urple-900/50 transition-colors"
                              >
                                <EyeIcon className="h-4 w-4" />
                                <span>View Details</span>
                              </button>
                            </div>
                            <button
                              onClick={() => handleSelectProject(project)}
                              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              Start This Project
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        project={selectedProjectForDetail}
        onStartProject={handleSelectProject}
        onSaveForLater={handleSaveForLater}
        inputSource={inputData}
      />
    </div>
  );
}
