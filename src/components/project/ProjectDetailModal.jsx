import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  PlayCircleIcon,
  BookmarkIcon,
  ShareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import ProblemSolutionMapping from './ProblemSolutionMapping';
import LearningObjectives from './LearningObjectives';
import ProjectStepsWithContext from './ProjectStepsWithContext';

const ProjectDetailModal = ({
  isOpen,
  onClose,
  project,
  onStartProject,
  onSaveForLater,
  onEdit,
  onDelete,
  inputSource
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !project) return null;

  const tabs = [
    { id: 'overview', label: 'Problem & Solution', icon: '🎯' },
    { id: 'objectives', label: 'Learning Goals', icon: '🎓' },
    { id: 'steps', label: 'Project Steps', icon: '📋' },
    { id: 'details', label: 'Project Details', icon: '📊' },
  ];

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
          className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600 px-8 py-6">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">
                  {project.domain === 'coding' && '💻'}
                  {project.domain === 'hardware' && '🔧'}
                  {project.domain === 'design' && '🎨'}
                  {project.domain === 'research' && '🔬'}
                  {!project.domain && '💻'}
                  {project.domain && !['coding', 'hardware', 'design', 'research'].includes(project.domain) && '💻'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{project.title || project.name}</h1>
                  <p className="text-white/80">{project.description}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
              >
                <XMarkIcon className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Project Metadata */}
            <div className="relative mt-4 flex flex-wrap gap-2">
              {project.skillLevel && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                  {project.skillLevel}
                </span>
              )}
              {project.estimatedTime && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                  {project.estimatedTime}
                </span>
              )}
              {project.difficulty && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                  Difficulty: {project.difficulty}/10
                </span>
              )}
              {project.domain && (
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm rounded-full">
                  {project.domain}
                </span>
              )}
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="px-8">
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
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProblemSolutionMapping project={project} />
                </motion.div>
              )}

              {activeTab === 'objectives' && (
                <motion.div
                  key="objectives"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <LearningObjectives learningObjectives={project.learningObjectives} />
                </motion.div>
              )}

              {activeTab === 'steps' && (
                <motion.div
                  key="steps"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProjectStepsWithContext 
                    steps={project.steps} 
                    inputSource={inputSource}
                  />
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Technologies */}
                  {project.technologies && project.technologies.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Technologies & Tools
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Prerequisites */}
                  {project.requirements?.prerequisites && project.requirements.prerequisites.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Prerequisites
                      </h3>
                      <ul className="space-y-2">
                        {project.requirements.prerequisites.map((prereq, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                            <span className="text-gray-700 dark:text-gray-300">{prereq}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Extensions */}
                  {project.extensions && project.extensions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Extension Ideas
                      </h3>
                      <ul className="space-y-2">
                        {project.extensions.map((extension, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                            <span className="text-gray-700 dark:text-gray-300">{extension}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Resources */}
                  {project.resources && project.resources.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Helpful Resources
                      </h3>
                      <div className="space-y-3">
                        {project.resources.map((resource, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-medium text-gray-900 dark:text-white">
                                  {resource.title}
                                </h4>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {resource.type}
                                </span>
                              </div>
                              {resource.url && (
                                <a
                                  href={resource.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-primary-600 hover:text-primary-700 dark:text-primary-400"
                                >
                                  <ShareIcon className="h-5 w-5" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-3">
                {onSaveForLater && (
                  <button
                    onClick={() => onSaveForLater(project)}
                    className="flex items-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <BookmarkIcon className="h-5 w-5" />
                    <span>Save for Later</span>
                  </button>
                )}

                {onEdit && (
                  <button
                    onClick={() => onEdit(project)}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    <PencilIcon className="h-5 w-5" />
                    <span>Edit Project</span>
                  </button>
                )}

                {onDelete && (
                  <button
                    onClick={() => onDelete(project.id)}
                    className="flex items-center space-x-2 px-6 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span>Delete Project</span>
                  </button>
                )}
              </div>

              {onStartProject && (
                <button
                  onClick={() => onStartProject(project)}
                  className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <PlayCircleIcon className="h-5 w-5" />
                  <span>Start This Project</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetailModal;
