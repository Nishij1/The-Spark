import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpenIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// Domain icons mapping
const getDomainIcon = (domain) => {
  switch (domain?.toLowerCase()) {
    case 'coding':
      return '💻';
    case 'hardware':
      return '🔧';
    case 'design':
      return '🎨';
    case 'research':
      return '🔬';
    default:
      return '💻';
  }
};

export default function ProjectCard({ project, onEdit, onDelete, onView, onStart, onNavigate }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setIsDeleting(true);
      try {
        await onDelete(project.id);
      } catch (error) {
        console.error('Failed to delete project:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleStartProject = async () => {
    if (!onStart) return;

    // Validate project data
    if (!project) {
      console.error('Project data is missing');
      return;
    }

    if (!project.id) {
      console.error('Project ID is missing');
      return;
    }

    setIsStarting(true);
    try {
      await onStart(project);
    } catch (error) {
      console.error('Failed to start project:', error);
    } finally {
      setIsStarting(false);
    }
  };

  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons or interactive elements
    if (e.target.closest('button') || e.target.closest('[role="button"]') || e.target.closest('.menu-button')) {
      return;
    }

    // Navigate to project execution page
    if (onNavigate) {
      onNavigate(project);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onDoubleClick={()=>onView(project)}
      className="card hover:shadow-xl hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">
            {getDomainIcon(project.domain)}
          </span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
              {project.title || project.name}
            </h3>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
              {project.status || 'active'}
            </span>
          </div>
        </div>

        <Menu as="div" className="relative">
          <Menu.Button className="menu-button p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <EllipsisVerticalIcon className="h-5 w-5" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none z-10">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onView(project)}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                    >
                      <EyeIcon className="h-4 w-4 mr-3" />
                      View Details
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={() => onEdit(project)}
                      className={`${
                        active ? 'bg-gray-100 dark:bg-gray-700' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300`}
                    >
                      <PencilIcon className="h-4 w-4 mr-3" />
                      Edit Project
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className={`${
                        active ? 'bg-red-50 dark:bg-red-900/20' : ''
                      } flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 disabled:opacity-50`}
                    >
                      <TrashIcon className="h-4 w-4 mr-3" />
                      {isDeleting ? 'Deleting...' : 'Delete Project'}
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
          {project.description || 'No description provided'}
        </p>
      </div>

      {/* Project Metadata */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.domain && (
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full">
            {project.domain}
          </span>
        )}
        {project.skillLevel && (
          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm rounded-full">
            {project.skillLevel}
          </span>
        )}
        {project.estimatedTime && (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-full">
            {project.estimatedTime}
          </span>
        )}
        {project.difficulty && (
          <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm rounded-full">
            Difficulty: {project.difficulty}/10
          </span>
        )}
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

      {/* Legacy support for existing projects */}
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
        <div className="flex items-center space-x-1">
          <CalendarIcon className="h-4 w-4" />
          <span>Created {formatDate(project.createdAt)}</span>
        </div>

        {project.technology && (
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">
            {project.technology}
          </span>
        )}
      </div>

      {project.tags && project.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
              +{project.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Click to view indicator */}
      <div className="mt-3 text-center">
        <span className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors duration-200">
          Click anywhere to view project details
        </span>
      </div>

      {/* Enhanced Start Project Button */}
      {onStart && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleStartProject}
            disabled={isStarting || isDeleting}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none disabled:shadow-md"
          >
            {isStarting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Starting...</span>
              </>
            ) : (
              <>
                <PlayCircleIcon className="h-4 w-4" />
                <span>Start Project</span>
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}
