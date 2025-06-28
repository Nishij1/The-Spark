import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function EditProjectModal({ isOpen, onClose, onSubmit, loading, project }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technology: '',
    status: 'active',
    tags: '',
  });

  const modalRef = useRef();

  // Populate form when modal opens
  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        description: project.description || '',
        technology: project.technology || '',
        status: project.status || 'active',
        tags: project.tags ? project.tags.join(', ') : '',
      });
    }
  }, [project]);

  // Handle backdrop clicks
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  // ESC key closes modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const projectData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
    };

    try {
      await onSubmit(project.id, projectData);
      onClose();
    } catch (error) {
      console.error('Failed to update project:', error);
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
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Edit Project
                  </h3>
                  <button
                      onClick={onClose}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="input-field"
                    >
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="paused">Paused</option>
                    </select>
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
                            Updating...
                          </div>
                      ) : (
                          'Update Project'
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
