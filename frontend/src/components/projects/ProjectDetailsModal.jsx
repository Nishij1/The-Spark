import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  CalendarIcon,
  TagIcon,
  ClockIcon,
  FolderIcon,
  DocumentTextIcon,
  PencilSquareIcon,
  TrashIcon,
  ShareIcon,
  StarIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';
import {
  StarIcon as StarIconSolid,
  HeartIcon as HeartIconSolid
} from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function ProjectDetailsModal({ isOpen, onClose, project, onEdit, onDelete, onStart }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isStarred, setIsStarred] = useState(false);

  if (!isOpen || !project) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Unknown';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return {
          color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400',
          icon: '🚀',
          label: 'Active'
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
          icon: '✅',
          label: 'Completed'
        };
      case 'paused':
        return {
          color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400',
          icon: '⏸️',
          label: 'Paused'
        };
      case 'archived':
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
          icon: '📦',
          label: 'Archived'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
          icon: '📋',
          label: 'Draft'
        };
    }
  };

  const getTechnologyIcon = (tech) => {
    const techLower = tech?.toLowerCase() || '';
    if (techLower.includes('react')) return '⚛️';
    if (techLower.includes('vue')) return '💚';
    if (techLower.includes('angular')) return '🅰️';
    if (techLower.includes('node')) return '🟢';
    if (techLower.includes('python')) return '🐍';
    if (techLower.includes('java')) return '☕';
    if (techLower.includes('php')) return '🐘';
    if (techLower.includes('ruby')) return '💎';
    if (techLower.includes('go')) return '🐹';
    if (techLower.includes('rust')) return '🦀';
    return '💻';
  };

  const statusConfig = getStatusConfig(project.status);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Container */}
        <div className="flex items-center justify-center min-h-screen px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header with Gradient */}
            <div className="relative bg-gradient-to-br from-purple-600  to-purple-100 px-8 py-6">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                      <FolderIcon className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white truncate">
                      {project.name}
                    </h1>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-white/20 text-white backdrop-blur-sm`}>
                      <span className="mr-1">{statusConfig.icon}</span>
                      {statusConfig.label}
                    </span>

                    {project.technology && (
                      <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-white/20 text-white backdrop-blur-sm">
                        <span className="mr-1">{getTechnologyIcon(project.technology)}</span>
                        {project.technology}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => setIsStarred(!isStarred)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
                  >
                    {isStarred ? (
                      <StarIconSolid className="h-5 w-5 text-yellow-300" />
                    ) : (
                      <StarIcon className="h-5 w-5 text-white" />
                    )}
                  </button>

                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
                  >
                    {isLiked ? (
                      <HeartIconSolid className="h-5 w-5 text-red-400" />
                    ) : (
                      <HeartIconSolid className="h-5 w-5 text-white/70" />
                    )}
                  </button>

                  <button
                    onClick={onClose}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-sm transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Description Section */}
              {project.description && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <DocumentTextIcon className="h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Description
                    </h3>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Tags Section */}
              {project.tags && project.tags.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <TagIcon className="h-5 w-5 text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Tags
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="px-4 py-2 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium rounded-xl border border-primary-200 dark:border-primary-700"
                      >
                        #{tag}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Project Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Created Date */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 bg-blue-100 dark:bg-purple-800 rounded-xl">
                      <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-purple-700 dark:text-purple-300">Created</h4>
                      <p className="text-lg font-semibold text-purple-900 dark:tepurple-100">
                        {getRelativeTime(project.createdAt)}
                      </p>
                      <p className="text-xs text-purple-600 dark:text-purple-400">
                        {formatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Last Updated */}
                {project.updatedAt && (
                  <div className="p-6 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-800 rounded-xl">
                        <ClockIcon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Last Updated</h4>
                        <p className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                          {getRelativeTime(project.updatedAt)}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          {formatDate(project.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                {onStart && (
                  <button
                    onClick={() => {
                      onStart(project);
                      onClose();
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <PlayCircleIcon className="h-5 w-5" />
                    <span>Start Project</span>
                  </button>
                )}

                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(project);
                      onClose();
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                    <span>Edit Project</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    navigator.share?.({
                      title: project.name,
                      text: project.description,
                      url: window.location.href
                    }).catch(() => {
                      // Fallback: copy to clipboard
                      navigator.clipboard.writeText(`${project.name}: ${project.description}`);
                    });
                  }}
                  className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <ShareIcon className="h-5 w-5" />
                  <span>Share</span>
                </button>

                {onDelete && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this project?')) {
                        onDelete(project.id);
                        onClose();
                      }
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span>Delete</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl transition-all duration-200"
                >
                  <span>Close</span>
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
