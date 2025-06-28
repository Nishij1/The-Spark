import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProjects } from './useProjects';
import { profileService } from '../services/profileService';
import { useToast } from '../components/Toast';

export function useProfile() {
  const { currentUser } = useAuth();
  const { projects } = useProjects();
  const { showSuccess, showError } = useToast();

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load profile data
  const loadProfile = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      setError(null);
      
      const profileData = await profileService.getProfile(currentUser.uid);
      setProfile(profileData);
      setAchievements(profileData.achievements || []);
      
      // Calculate fresh stats
      const freshStats = await profileService.calculateUserStats(currentUser.uid, projects);
      setStats(freshStats);
      
    } catch (err) {
      console.error('Error loading profile:', err);
      setError(err.message);
      showError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [currentUser, projects, showError]);

  // Update profile
  const updateProfile = useCallback(async (updates) => {
    if (!currentUser) return false;

    try {
      setLoading(true);
      setError(null);

      await profileService.updateProfile(currentUser.uid, updates);
      
      // Update local state
      setProfile(prev => ({ ...prev, ...updates }));
      
      showSuccess('Profile updated successfully!');
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message);
      showError('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser, showSuccess, showError]);

  // Update auth profile (display name, photo)
  const updateAuthProfile = useCallback(async (authUpdates) => {
    if (!currentUser) return false;

    try {
      setLoading(true);
      await profileService.updateAuthProfile(currentUser, authUpdates);
      showSuccess('Profile updated successfully!');
      return true;
    } catch (err) {
      console.error('Error updating auth profile:', err);
      setError(err.message);
      showError('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser, showSuccess, showError]);

  // Upload avatar
  const uploadAvatar = useCallback(async (file) => {
    if (!currentUser) return null;

    try {
      setLoading(true);
      setError(null);

      const avatarUrl = await profileService.uploadAvatar(currentUser.uid, file);
      
      // Update local profile state
      setProfile(prev => ({ ...prev, avatar: avatarUrl }));
      
      showSuccess('Avatar updated successfully!');
      return avatarUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err.message);
      showError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser, showSuccess, showError]);

  // Update email
  const updateEmail = useCallback(async (newEmail, currentPassword) => {
    if (!currentUser) return false;

    try {
      setLoading(true);
      setError(null);

      await profileService.updateUserEmail(currentUser, newEmail, currentPassword);
      showSuccess('Email updated successfully!');
      return true;
    } catch (err) {
      console.error('Error updating email:', err);
      setError(err.message);
      showError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser, showSuccess, showError]);

  // Update password
  const updatePassword = useCallback(async (currentPassword, newPassword) => {
    if (!currentUser) return false;

    try {
      setLoading(true);
      setError(null);

      await profileService.updateUserPassword(currentUser, currentPassword, newPassword);
      showSuccess('Password updated successfully!');
      return true;
    } catch (err) {
      console.error('Error updating password:', err);
      setError(err.message);
      showError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser, showSuccess, showError]);

  // Check for new achievements
  const checkAchievements = useCallback(async () => {
    if (!currentUser || !projects.length) return;

    try {
      const newAchievements = await profileService.checkAchievements(
        currentUser.uid,
        projects,
        achievements
      );

      if (newAchievements.length > 0) {
        setAchievements(prev => [...prev, ...newAchievements]);

        // Show achievement notifications
        newAchievements.forEach(achievement => {
          showSuccess(`🎉 Achievement Unlocked: ${achievement.title}!`);
        });
      }
    } catch (err) {
      console.error('Error checking achievements:', err);
    }
  }, [currentUser, projects, achievements, showSuccess]);

  // Export user data
  const exportData = useCallback(async () => {
    if (!currentUser) return null;

    try {
      setLoading(true);
      const exportData = await profileService.exportUserData(currentUser.uid);
      
      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `project-spark-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccess('Data exported successfully!');
      return exportData;
    } catch (err) {
      console.error('Error exporting data:', err);
      setError(err.message);
      showError('Failed to export data');
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser, showSuccess, showError]);

  // Delete account
  const deleteAccount = useCallback(async () => {
    if (!currentUser) return false;

    try {
      setLoading(true);
      await profileService.deleteAccount(currentUser.uid, currentUser);
      showSuccess('Account deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting account:', err);
      setError(err.message);
      showError('Failed to delete account');
      return false;
    } finally {
      setLoading(false);
    }
  }, [currentUser, showSuccess, showError]);

  // Calculate profile completion percentage
  const getProfileCompletion = useCallback(() => {
    if (!profile) return 0;

    const fields = [
      profile.bio,
      profile.location,
      profile.website,
      profile.avatar,
      profile.skills?.length > 0,
      currentUser?.displayName,
      currentUser?.email
    ];

    const completedFields = fields.filter(Boolean).length;
    return Math.round((completedFields / fields.length) * 100);
  }, [profile, currentUser]);

  // Get user level based on stats
  const getUserLevel = useCallback(() => {
    if (!stats) return { level: 1, title: 'Beginner', progress: 0 };

    const { totalProjects, completedProjects } = stats;
    
    // Define level thresholds
    const levels = [
      { min: 0, max: 2, title: 'Beginner', color: 'gray' },
      { min: 3, max: 9, title: 'Explorer', color: 'blue' },
      { min: 10, max: 24, title: 'Builder', color: 'green' },
      { min: 25, max: 49, title: 'Creator', color: 'purple' },
      { min: 50, max: 99, title: 'Expert', color: 'orange' },
      { min: 100, max: Infinity, title: 'Master', color: 'red' }
    ];

    const currentLevel = levels.findIndex(level => 
      completedProjects >= level.min && completedProjects <= level.max
    ) + 1;

    const levelInfo = levels[currentLevel - 1];
    const nextLevel = levels[currentLevel];
    
    let progress = 0;
    if (nextLevel) {
      const currentLevelProgress = completedProjects - levelInfo.min;
      const levelRange = nextLevel.min - levelInfo.min;
      progress = Math.round((currentLevelProgress / levelRange) * 100);
    } else {
      progress = 100; // Max level reached
    }

    return {
      level: currentLevel,
      title: levelInfo.title,
      color: levelInfo.color,
      progress,
      nextLevelAt: nextLevel?.min || null,
      projectsToNext: nextLevel ? nextLevel.min - completedProjects : 0
    };
  }, [stats]);

  // Load profile on mount and when dependencies change
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Check achievements when projects change
  useEffect(() => {
    if (projects.length > 0 && currentUser) {
      checkAchievements();
    }
  }, [projects.length, currentUser?.uid]); // Only trigger when project count or user changes

  return {
    // Data
    profile,
    stats,
    achievements,
    loading,
    error,
    
    // Computed values
    profileCompletion: getProfileCompletion(),
    userLevel: getUserLevel(),
    
    // Actions
    loadProfile,
    updateProfile,
    updateAuthProfile,
    uploadAvatar,
    updateEmail,
    updatePassword,
    checkAchievements,
    exportData,
    deleteAccount,
    
    // Utilities
    setError
  };
}

export default useProfile;
