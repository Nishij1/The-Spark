import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function CreateProjectModal({ isOpen, onClose, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technology: '',
    tags: '',
    domain: 'coding',
    skillLevel: 'intermediate',
  });

  const modalRef = useRef();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) =>{
    e.preventDefault();

    // Create a structured project similar to AI-generated ones
    const projectData = {
      title: formData.name,
      name: formData.name,
      description: formData.description,
      domain: formData.domain,
      skillLevel: formData.skillLevel,
      difficulty: 5, // Default difficulty
      estimatedTime: '2-4 hours', // Default estimated time
      technology: formData.technology || 'General',
      status: 'active',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      type: 'manual',
      learningObjectives: [
        'Understand the project requirements',
        'Apply relevant skills and knowledge',
        'Complete the project successfully',
        'Reflect on the learning experience'
      ],
      technologies: formData.technology ? [formData.technology] : ['General'],
      steps: [
        {
          title: 'Project Setup & Planning',
          description: 'Set up your development environment and plan your approach',
          estimatedTime: '30 minutes',
          learningFocus: 'Project planning and environment setup',
          resources: ['Development tools', 'Project requirements'],
          deliverables: ['Development environment', 'Project plan']
        },
        {
          title: 'Research & Design',
          description: 'Research the requirements and design your solution',
          estimatedTime: '1 hour',
          learningFocus: 'Research skills and solution design',
          resources: ['Documentation', 'Best practices'],
          deliverables: ['Design document', 'Implementation plan']
        },
        {
          title: 'Core Implementation',
          description: 'Implement the main functionality of your project',
          estimatedTime: '2-3 hours',
          learningFocus: 'Hands-on development and problem-solving',
          resources: ['Code examples', 'Documentation'],
          deliverables: ['Working implementation', 'Core features']
        },
        {
          title: 'Testing & Debugging',
          description: 'Test your implementation and fix any issues',
          estimatedTime: '45 minutes',
          learningFocus: 'Testing and debugging skills',
          resources: ['Testing tools', 'Debugging guides'],
          deliverables: ['Test results', 'Bug fixes']
        },
        {
          title: 'Finalization & Documentation',
          description: 'Finalize your project and create documentation',
          estimatedTime: '30 minutes',
          learningFocus: 'Documentation and project completion',
          resources: ['Documentation templates'],
          deliverables: ['Final project', 'Documentation']
        }
      ],
      problemSolutionMapping: {
        originalProblem: formData.description || 'Complete this project to learn new skills',
        howProjectSolves: 'This project provides hands-on experience with structured learning steps.',
        whyThisApproach: 'Step-by-step implementation helps build understanding progressively.',
        keyConnections: [
          'Each step builds upon previous knowledge',
          'Practical implementation reinforces learning',
          'Documentation helps consolidate understanding'
        ]
      }
    };

    try {
      await onSubmit(projectData);
      setFormData({ name: '', description: '', technology: '', tags: '', domain: 'coding', skillLevel: 'intermediate' });
      onClose();
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  return (
      <AnimatePresence>
        {isOpen && (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4"
                onMouseDown={handleBackdropClick}
            >
              <motion.div
                  ref={modalRef}
                  onMouseDown={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Create New Project
                  </h3>
                  <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    ✨ Your project will be created with structured learning steps, objectives, and resources to guide your learning journey.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Project Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field"
                        placeholder="Enter project name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="input-field resize-none"
                        placeholder="Describe your project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Technology/Framework
                    </label>
                    <input
                        type="text"
                        name="technology"
                        value={formData.technology}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g., React, Python, Arduino"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Domain
                      </label>
                      <select
                          name="domain"
                          value={formData.domain}
                          onChange={handleChange}
                          className="input-field"
                      >
                        <option value="coding">Coding</option>
                        <option value="hardware">Hardware</option>
                        <option value="design">Design</option>
                        <option value="research">Research</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Skill Level
                      </label>
                      <select
                          name="skillLevel"
                          value={formData.skillLevel}
                          onChange={handleChange}
                          className="input-field"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g., web, frontend, api"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 btn-secondary"
                    >
                      Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !formData.name.trim()}
                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Creating...
                          </div>
                      ) : (
                          'Create Project'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
        )}
      </AnimatePresence>
  );
}
