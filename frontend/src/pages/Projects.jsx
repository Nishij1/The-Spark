import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  Plus
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import ProjectCard from '../components/projects/ProjectCard';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import EditProjectModal from '../components/projects/EditProjectModal';
import ProjectDetailModal from '../components/project/ProjectDetailModal';
import { useToast, ToastContainer } from '../components/Toast';

const Projects = () => {
  const navigate = useNavigate();
  const { projects, loading, createProject, updateProject, deleteProject } = useProjects();
  const { toasts, removeToast, showSuccess, showError } = useToast();

  // Debug logging for projects data
  useEffect(() => {
    console.log('🎯 Projects page - projects data changed:', {
      projectsCount: projects.length,
      loading,
      projects: projects
    });
  }, [projects, loading]);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedTechnology, setSelectedTechnology] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [viewingProject, setViewingProject] = useState(null);

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'paused', label: 'Paused' },
  ];

  const technologies = [
    { value: 'all', label: 'All Technologies' },
    ...Array.from(new Set(projects.map(p => p.technology).filter(Boolean))).map(tech => ({
      value: tech,
      label: tech
    }))
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesTechnology = selectedTechnology === 'all' || project.technology === selectedTechnology;

    return matchesSearch && matchesStatus && matchesTechnology;
  });

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData);
      showSuccess('Project created successfully!');
    } catch (error) {
      showError('Failed to create project. Please try again.');
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowEditModal(true);
  };

  const handleUpdateProject = async (projectId, projectData) => {
    try {
      await updateProject(projectId, projectData);
      setShowEditModal(false);
      setEditingProject(null);
      showSuccess('Project updated successfully!');
    } catch (error) {
      showError('Failed to update project. Please try again.');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      showSuccess('Project deleted successfully!');
    } catch (error) {
      console.error('Failed to delete project:', error);
      showError('Failed to delete project. Please try again.');
    }
  };

  const handleViewProject = (project) => {
    setViewingProject(project);
    setShowDetailsModal(true);
  };

  const handleStartProject = async (project) => {
    try {
      // Validate project data
      if (!project) {
        showError('Project data is missing');
        return;
      }

      if (!project.id) {
        showError('Project ID is missing. Cannot start project.');
        return;
      }

      // Show loading state
      showSuccess('Starting project...');

      // Update project status to in-progress if it's not already started
      if (project.status === 'active' && (!project.progress || project.progress.status === 'not_started')) {
        try {
          await updateProject(project.id, {
            status: 'in-progress',
            'progress.status': 'in_progress',
            'progress.startedAt': new Date(),
            'progress.lastWorkedOn': new Date(),
          });
        } catch (updateError) {
          // If update fails, still allow navigation but show warning
          console.warn('Failed to update project status:', updateError);
          showError('Project status update failed, but continuing...');
        }
      }

      // Navigate to project execution page
      navigate(`/project/${project.id}`);

    } catch (error) {
      console.error('Error starting project:', error);
      showError('Failed to start project: ' + (error.message || 'Unknown error'));
    }
  };

  const handleNavigateToProject = (project) => {
    // Navigate directly to project execution page when clicking on the card
    navigate(`/project/${project.id}`);
  };



  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Your Projects
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Manage and track your projects ({projects.length} total)
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center space-x-2  bg-gradient-to-r from-violet-800 to-purple-300 hover:from-purple-900 hover:to-purple-300 text-white f rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl "
            >
              <Plus className="h-5 w-5" />
              <span>New Project</span>
            </button>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search projects..."
                className="input-field pl-10"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* View Mode */}
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="input-field"
                  >
                    {statuses.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Technology Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Technology
                  </label>
                  <select
                    value={selectedTechnology}
                    onChange={(e) => setSelectedTechnology(e.target.value)}
                    className="input-field"
                  >
                    {technologies.map((tech) => (
                      <option key={tech.value} value={tech.value}>
                        {tech.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Projects Grid/List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading projects...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                  onView={handleViewProject}
                  onStart={handleStartProject}
                  onNavigate={handleNavigateToProject}
                />
              </motion.div>
            ))}
          </motion.div>
        )}


        {filteredProjects.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {projects.length === 0 ? 'No projects yet' : 'No projects found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 ">
              {projects.length === 0
                ? 'Create your first project to get started'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="btn-primary mt-4  bg-gradient-to-r from-violet-800 to-purple-300 hover:from-purple-900 hover:to-purple-300 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                
                Create Your First Project
              </button>
            )}
          </motion.div>
        )}

        {/* Create Project Modal */}
        <CreateProjectModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateProject}
          loading={loading}
        />

        {/* Edit Project Modal */}
        <EditProjectModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingProject(null);
          }}
          onSubmit={handleUpdateProject}
          loading={loading}
          project={editingProject}
        />

        {/* Project Details Modal */}
        <ProjectDetailModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setViewingProject(null);
          }}
          project={viewingProject}
          onStartProject={handleStartProject}
          onSaveForLater={null}
          onEdit={(project) => {
            setEditingProject(project);
            setShowEditModal(true);
            setShowDetailsModal(false);
            setViewingProject(null);
          }}
          onDelete={async (projectId) => {
            try {
              await deleteProject(projectId);
              showSuccess('Project deleted successfully!');
              setShowDetailsModal(false);
              setViewingProject(null);
            } catch (error) {
              showError('Failed to delete project');
            }
          }}
          inputSource={viewingProject?.originalInput || viewingProject?.description}
        />

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  );
};

export default Projects;
