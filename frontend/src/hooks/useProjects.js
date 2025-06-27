import { useState, useEffect } from 'react';
import { projectService } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchProjects = async () => {
    console.log('🔍 fetchProjects called, currentUser:', currentUser?.uid);

    if (!currentUser) {
      console.log('❌ No current user, clearing projects');
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('📡 Fetching projects for user:', currentUser.uid);

      const userProjects = await projectService.getUserProjects(currentUser.uid);
      console.log('✅ Projects fetched successfully:', userProjects);
      console.log('📊 Number of projects:', userProjects.length);

      setProjects(userProjects);
    } catch (err) {
      console.error('❌ Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
      console.log('🏁 fetchProjects completed');
    }
  };

  useEffect(() => {
    console.log('🔄 useProjects useEffect triggered, currentUser:', currentUser?.uid);

    if (!currentUser) {
      console.log('❌ No current user, clearing projects');
      setProjects([]);
      setLoading(false);
      return;
    }

    // Set up real-time subscription
    console.log('🔔 Setting up real-time subscription for projects');
    setLoading(true);

    const unsubscribe = projectService.subscribeToUserProjects(
      currentUser.uid,
      (projects) => {
        console.log('🔔 Real-time projects update received:', projects);
        setProjects(projects);
        setLoading(false);
        setError(null);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      console.log('🧹 Cleaning up projects subscription');
      unsubscribe();
    };
  }, [currentUser]);

  const createProject = async (projectData) => {
    if (!currentUser) {
      console.error('❌ No current user found');
      throw new Error('User not authenticated');
    }

    console.log('🚀 Creating project with data:', projectData);
    console.log('👤 Current user:', currentUser.uid);

    try {
      setError(null);
      const projectId = await projectService.create(currentUser.uid, projectData);
      console.log('✅ Project created successfully with ID:', projectId);
      // No need to manually refresh - real-time subscription will handle it
      return projectId;
    } catch (err) {
      console.error('❌ Error in createProject:', err);
      setError(err.message);
      throw err;
    }
  };

  const updateProject = async (projectId, updates) => {
    try {
      setError(null);
      await projectService.update(projectId, updates);
      // No need to manually refresh - real-time subscription will handle it
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteProject = async (projectId) => {
    try {
      setError(null);
      await projectService.delete(projectId);
      // No need to manually refresh - real-time subscription will handle it
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects,
  };
}

export function useProject(projectId) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const projectData = await projectService.getById(projectId);
        setProject(projectData);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();

    // Subscribe to real-time updates
    const unsubscribe = projectService.subscribeToProject(projectId, (projectData) => {
      setProject(projectData);
      setLoading(false);
    });

    return unsubscribe;
  }, [projectId]);

  const updateProject = async (updates) => {
    if (!projectId) throw new Error('No project ID provided');

    try {
      setError(null);
      await projectService.update(projectId, updates);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    project,
    loading,
    error,
    updateProject,
  };
}
