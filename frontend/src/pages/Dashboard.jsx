import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Plus,
  Zap,
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  FileText,
  Upload
} from 'lucide-react';
import {
  SparklesIcon,
  CodeBracketIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { useProjects } from '../hooks/useProjects';
import { useGemini } from '../hooks/useGemini';
import { geminiApi } from '../services/geminiApi';
import CodeGenerator from '../components/ai/CodeGenerator';
import ProjectCard from '../components/projects/ProjectCard';
import { useToast, ToastContainer } from '../components/Toast';
import FileUpload from '../components/FileUpload';
import { testProjectQuery } from '../utils/testFirebase';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { projects, loading: projectsLoading, createProject } = useProjects();
  const { generateProjectStructure, loading: aiLoading } = useGemini();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  const [concept, setConcept] = useState('');
  const [transcript, setTranscript] = useState('');
  const [activeTab, setActiveTab] = useState('concept');
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  const [generationError, setGenerationError] = useState(null);
  const [generationSuccess, setGenerationSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');

  // Prevent navigation during generation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isGenerating) {
        e.preventDefault();
        e.returnValue = 'Project generation is in progress. Are you sure you want to leave?';
        return e.returnValue;
      }
    };

    if (isGenerating) {
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [isGenerating]);

  const stats = [
    {
      label: 'Total Projects',
      value: projectsLoading ? '...' : projects.length.toString(),
      icon: Zap,
      color: 'text-blue-600'
    },
    {
      label: 'Active Projects',
      value: projectsLoading ? '...' : projects.filter(p => p.status === 'active').length.toString(),
      icon: Star,
      color: 'text-green-600'
    },
    {
      label: 'Completed',
      value: projectsLoading ? '...' : projects.filter(p => p.status === 'completed').length.toString(),
      icon: Clock,
      color: 'text-purple-600'
    },
    {
      label: 'This Month',
      value: projectsLoading ? '...' : projects.filter(p => {
        const created = p.createdAt?.toDate ? p.createdAt.toDate() : new Date(p.createdAt);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length.toString(),
      icon: TrendingUp,
      color: 'text-orange-600'
    },
  ];

  const recentProjects = projects.slice(0, 3);

  const handleGenerateProject = async () => {
    const input = activeTab === 'concept' ? concept : transcript;
    if (!input.trim()) {
      showError('Please enter some text to generate a project');
      return;
    }

    console.log('Starting project generation...', { input, activeTab, currentUser: currentUser?.uid });

    try {
      setIsGenerating(true);
      setGenerationError(null);
      setGenerationSuccess(false);
      setGenerationProgress('Initializing project generation...');

      // Check if user is authenticated
      if (!currentUser) {
        throw new Error('You must be logged in to generate projects');
      }

      // Check if Gemini API key is available
      const hasGeminiKey = import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here';

      if (hasGeminiKey) {
        console.log('Generating AI-powered project...');
        setGenerationProgress('Analyzing your input with AI...');
        try {
          // Use the proper API that generates structured projects with steps
          const generatedProject = await geminiApi.generateProject(
            input,
            'intermediate', // Default skill level
            'coding' // Default domain
          );

          setGenerationProgress('Creating project structure...');

          console.log('Structured project generated:', generatedProject);

          // Create a new project with the generated structure
          const projectData = {
            ...generatedProject,
            // Override some fields for consistency
            name: generatedProject.title || `Project: ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}`,
            status: 'active',
            tags: ['AI Generated', activeTab === 'concept' ? 'Concept' : 'Transcript'],
            originalInput: input, // Store the original input
            type: 'generated', // Use correct project type
            isGenerated: true,
            generatedAt: new Date(),
          };

          setGenerationProgress('Saving project to database...');
          console.log('Creating project with structured data:', projectData);
          const projectId = await createProject(projectData);
          console.log('Project created successfully with ID:', projectId);

          setGenerationProgress('Project created successfully!');

          // Clear the input and show success
          if (activeTab === 'concept') {
            setConcept('');
          } else {
            setTranscript('');
          }

          setGenerationSuccess(true);
          setTimeout(() => setGenerationSuccess(false), 3000);
          showSuccess('Project generated successfully with AI-powered structured steps! Check your projects page.');
          return;
        } catch (aiError) {
          console.warn('AI generation failed, falling back to manual project:', aiError);
          showError('AI generation failed, creating a basic project instead...');
        }
      } else {
        console.log('No Gemini API key found, creating manual project...');
      }

      // Fallback: Create a manual project with basic structure
      console.log('Creating manual project with basic structure...');
      setGenerationProgress('Creating basic project structure...');

      const fallbackProjectData = {
        title: `Project: ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}`,
        name: `Project: ${input.substring(0, 50)}${input.length > 50 ? '...' : ''}`,
        description: input,
        domain: 'coding',
        skillLevel: 'intermediate',
        difficulty: 5,
        estimatedTime: '2-4 hours',
        technology: 'Manual',
        status: 'active',
        tags: ['Manual', activeTab === 'concept' ? 'Concept' : 'Transcript'],
        originalInput: input,
        type: 'manual',
        learningObjectives: [
          'Understand the project requirements',
          'Plan and structure the implementation',
          'Apply problem-solving skills',
          'Test and refine the solution'
        ],
        technologies: ['General'],
        steps: [
          {
            title: 'Project Analysis & Planning',
            description: 'Analyze the requirements and create a detailed implementation plan',
            estimatedTime: '30 minutes',
            learningFocus: 'Project planning and requirement analysis',
            resources: ['Project description', 'Research materials'],
            deliverables: ['Project plan', 'Requirements list']
          },
          {
            title: 'Research & Design',
            description: 'Research best practices and design your solution approach',
            estimatedTime: '1 hour',
            learningFocus: 'Research skills and solution design',
            resources: ['Online documentation', 'Best practices guides'],
            deliverables: ['Design document', 'Architecture plan']
          },
          {
            title: 'Implementation',
            description: 'Start implementing your project based on the plan',
            estimatedTime: '2-3 hours',
            learningFocus: 'Hands-on development and problem-solving',
            resources: ['Development tools', 'Documentation'],
            deliverables: ['Working implementation', 'Code/artifacts']
          },
          {
            title: 'Testing & Refinement',
            description: 'Test your implementation and make necessary improvements',
            estimatedTime: '1 hour',
            learningFocus: 'Testing, debugging, and quality assurance',
            resources: ['Testing tools', 'Debugging guides'],
            deliverables: ['Test results', 'Refined solution']
          },
          {
            title: 'Documentation & Reflection',
            description: 'Document your solution and reflect on the learning experience',
            estimatedTime: '30 minutes',
            learningFocus: 'Documentation skills and self-reflection',
            resources: ['Documentation templates'],
            deliverables: ['Project documentation', 'Learning reflection']
          }
        ],
        problemSolutionMapping: {
          originalProblem: input,
          howProjectSolves: 'This project provides a structured approach to tackle your learning goal through hands-on implementation.',
          whyThisApproach: 'Breaking down complex problems into manageable steps helps build understanding progressively.',
          keyConnections: [
            'Each step builds upon previous knowledge',
            'Hands-on practice reinforces theoretical concepts',
            'Reflection helps consolidate learning'
          ]
        }
      };

      const projectId = await createProject(fallbackProjectData);
      console.log('Manual project created successfully with ID:', projectId);

      // Clear the input and show success
      if (activeTab === 'concept') {
        setConcept('');
      } else {
        setTranscript('');
      }

      setGenerationSuccess(true);
      setTimeout(() => setGenerationSuccess(false), 3000);
      showSuccess('Project created successfully with structured steps! Check your projects page.');

    } catch (error) {
      console.error('Failed to create project:', error);
      const errorMessage = error.message || 'Failed to create project. Please try again.';
      setGenerationError(errorMessage);
      showError(errorMessage);
    } finally {
      setIsGenerating(false);
      setGenerationProgress('');
    }
  };

  const handleFileProcessed = (extractedText, file) => {
    if (extractedText && extractedText.trim()) {
      setTranscript(prev => {
        const newText = prev ? `${prev}\n\n--- Extracted from ${file?.name || 'uploaded file'} ---\n${extractedText}` : extractedText;
        return newText;
      });
      setUploadError(null);
      showSuccess(`Text extracted from ${file?.name || 'file'} successfully!`);
    }
  };

  const handleFileError = (error) => {
    setUploadError(error);
    showError(error);
  };

  const handleTestProjectQuery = async () => {
    if (!currentUser) {
      showError('No user logged in');
      return;
    }

    console.log('🧪 Testing project query...');
    try {
      const result = await testProjectQuery(currentUser.uid);
      if (result.success) {
        showSuccess(`Query successful! Found ${result.projectCount} projects`);
        console.log('🎉 Test result:', result);
      } else {
        showError(`Query failed: ${result.error}`);
      }
    } catch (error) {
      showError(`Test failed: ${error.message}`);
      console.error('🚨 Test error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {currentUser?.displayName || currentUser?.email || 'Developer'}! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Ready to turn your learning into action? Let's create something amazing today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className={`card ${isGenerating ? 'opacity-75' : ''}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color} ${isGenerating ? 'animate-pulse' : ''}`} />
                </div>
                {isGenerating && stat.label === 'Total Projects' && (
                  <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-purple-600 mr-1"></div>
                    Generating new project...
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* AI Project Generator CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-800 to-zinc-50 rounded-3xl p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <SparklesIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">DIY Mission Engine</h2>
                      <p className="text-white/80">Transform your learning into hands-on projects</p>
                    </div>
                  </div>
                  <p className="text-white/90 mb-6 max-w-2xl">
                    Never wonder "what should I build?" again. Our AI analyzes your learning materials
                    and generates personalized project ideas tailored to your skill level.
                  </p>
                  <Link
                    to="/generate"
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
                  >
                    <SparklesIcon className="h-5 w-5" />
                    <span>Generate AI Project</span>
                  </Link>
                </div>
                <div className="hidden lg:block">
                  <div className="text-6xl opacity-20">🚀</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-100 rounded-lg">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  AI-Powered Tools
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowCodeGenerator(!showCodeGenerator)}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <CodeBracketIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Code Generator</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Generate code with AI assistance</p>
                  </div>
                </div>
              </button>

              <Link
                to="/projects"
                className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Zap className="h-8 w-8 text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Project Manager</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Manage and organize your projects</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Code Generator Modal */}
        {showCodeGenerator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <CodeGenerator />
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Project Generator */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className={`card relative ${isGenerating ? 'overflow-hidden' : ''}`}>
              <div className="flex items-center space-x-2 mb-6">
                <Zap className="h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Generate New Project
                </h2>
              </div>

              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mb-6">
                <button
                  onClick={() => !isGenerating && setActiveTab('concept')}
                  disabled={isGenerating}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'concept'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Concept</span>
                </button>
                <button
                  onClick={() => !isGenerating && setActiveTab('transcript')}
                  disabled={isGenerating}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 ${
                    activeTab === 'transcript'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Transcript</span>
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'concept' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      What concept would you like to explore?
                    </label>
                    <input
                      type="text"
                      value={concept}
                      onChange={(e) => !isGenerating && setConcept(e.target.value)}
                      disabled={isGenerating}
                      placeholder="e.g., Machine Learning, React Hooks, Quantum Computing..."
                      className={`input-field ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Paste your lecture transcript or notes
                    </label>
                    <textarea
                      value={transcript}
                      onChange={(e) => !isGenerating && setTranscript(e.target.value)}
                      disabled={isGenerating}
                      placeholder="Paste your lecture transcript, notes, or any learning material here..."
                      rows={6}
                      className={`input-field resize-none ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <FileUpload
                    onFileProcessed={handleFileProcessed}
                    onError={handleFileError}
                    disabled={isGenerating || aiLoading}
                  />
                </div>
              )}

              {/* Error Message */}
              {generationError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4"
                >
                  <p className="text-red-600 dark:text-red-400 text-sm">{generationError}</p>
                </motion.div>
              )}

              {/* Success Message */}
              {generationSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4"
                >
                  <p className="text-green-600 dark:text-green-400 text-sm">
                    ✅ Project generated successfully! Check your projects page.
                  </p>
                </motion.div>
              )}

              {/* Progress Message */}
              {isGenerating && generationProgress && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg mb-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      {generationProgress}
                    </p>
                  </div>
                </motion.div>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleGenerateProject}
                  disabled={(!concept.trim() && !transcript.trim()) || isGenerating || aiLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {isGenerating || aiLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      <span>
                        {isGenerating ? 'Generating Project...' : 'Processing...'}
                      </span>
                    </div>
                  ) : (
                    <>
                      <SparklesIcon className="h-5 w-5 mr-2" />
                      Generate Project Ideas
                    </>
                  )}

                  {/* Loading overlay */}
                  {isGenerating && (
                    <div className="absolute inset-0 bg-purple-600 bg-opacity-20 animate-pulse"></div>
                  )}
                </button>

                {/* Debug button - remove in production */}
                <button
                  onClick={handleTestProjectQuery}
                  disabled={isGenerating}
                  className={`w-full btn-secondary text-sm ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  🧪 Test Project Query (Debug)
                </button>
              </div>

              {/* Loading Overlay */}
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-10"
                >
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Generating Your Project
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                      {generationProgress || 'Please wait while we create your project...'}
                    </p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Recent Projects
              </h2>
              <div className="space-y-4">
                {projectsLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">Loading projects...</p>
                  </div>
                ) : recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                    >
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {project.name}
                      </h3>
                      <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span>{project.technology || 'General'}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          project.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : project.status === 'active'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {project.status || 'active'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {project.description || 'No description available'}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Zap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No projects yet</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">Create your first project above!</p>
                  </div>
                )}
              </div>

              {recentProjects.length > 0 && (
                <div className="mt-4">
                  <Link
                    to="/projects"
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 text-sm font-medium"
                  >
                    View all projects →
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default Dashboard;
