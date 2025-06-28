import Dashboard from "../../pages/Dashboard.jsx";
import {XMarkIcon} from "@heroicons/react/24/outline";

const SimpleProjectModal = ({ project, isOpen, onClose }) => {
    if (!isOpen || !project) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-purple-100 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">{project.name}</h2>
                            <button
                                onClick={onClose}
                                className="p-1 rounded-full hover:bg-white/20"
                            >
                                <XMarkIcon className="h-5 w-5 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Description</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {project.description || 'No description available'}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Technology</h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {project.technology || 'Not specified'}
                            </p>
                        </div>

                        <div>
                            <h3 className="font-medium text-gray-900 dark:text-white mb-1">Status</h3>
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

                        {project.createdAt && (
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white mb-1">Created</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {project.createdAt.toDate ?
                                        project.createdAt.toDate().toLocaleDateString() :
                                        new Date(project.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimpleProjectModal;