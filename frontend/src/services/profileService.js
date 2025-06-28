import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  updateProfile, 
  updatePassword, 
  updateEmail, 
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { checkUserAchievements } from '../data/achievements';

class ProfileService {
  // Get user profile data
  async getProfile(userId) {
    try {
      const profileRef = doc(db, 'userProfiles', userId);
      const profileSnap = await getDoc(profileRef);
      
      if (profileSnap.exists()) {
        return profileSnap.data();
      } else {
        // Create default profile if it doesn't exist
        const defaultProfile = {
          bio: '',
          location: '',
          website: '',
          skills: [],
          preferences: {
            theme: 'system',
            notifications: true,
            emailUpdates: true,
            publicProfile: false,
            showStats: true,
            language: 'en'
          },
          stats: {
            totalProjects: 0,
            completedProjects: 0,
            totalTimeSpent: 0,
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: null
          },
          achievements: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        await setDoc(profileRef, defaultProfile);
        return defaultProfile;
      }
    } catch (error) {
      console.error('Error getting profile:', error);
      throw new Error('Failed to load profile data');
    }
  }

  // Update user profile
  async updateProfile(userId, profileData) {
    try {
      const profileRef = doc(db, 'userProfiles', userId);
      const updateData = {
        ...profileData,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(profileRef, updateData);
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw new Error('Failed to update profile');
    }
  }

  // Upload and update avatar
  async uploadAvatar(userId, file) {
    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image');
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image size must be less than 5MB');
      }

      // Create storage reference
      const avatarRef = ref(storage, `avatars/${userId}/${Date.now()}_${file.name}`);
      
      // Upload file
      const snapshot = await uploadBytes(avatarRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      // Update profile with new avatar URL
      await this.updateProfile(userId, { avatar: downloadURL });
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw new Error('Failed to upload avatar');
    }
  }

  // Update Firebase Auth profile
  async updateAuthProfile(user, profileData) {
    try {
      await updateProfile(user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });
      return true;
    } catch (error) {
      console.error('Error updating auth profile:', error);
      throw new Error('Failed to update authentication profile');
    }
  }

  // Update email
  async updateUserEmail(user, newEmail, currentPassword) {
    try {
      // Re-authenticate user before email change
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update email
      await updateEmail(user, newEmail);
      return true;
    } catch (error) {
      console.error('Error updating email:', error);
      if (error.code === 'auth/wrong-password') {
        throw new Error('Current password is incorrect');
      } else if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email is already in use by another account');
      }
      throw new Error('Failed to update email');
    }
  }

  // Update password
  async updateUserPassword(user, currentPassword, newPassword) {
    try {
      // Re-authenticate user before password change
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      return true;
    } catch (error) {
      console.error('Error updating password:', error);
      if (error.code === 'auth/wrong-password') {
        throw new Error('Current password is incorrect');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('New password is too weak');
      }
      throw new Error('Failed to update password');
    }
  }

  // Calculate user statistics
  async calculateUserStats(userId, projects) {
    try {
      const totalProjects = projects.length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      
      // Calculate total time spent
      const totalTimeSpent = projects.reduce((total, project) => {
        return total + (project.progress?.timeSpent || 0);
      }, 0);

      // Calculate completion rate
      const completionRate = totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0;

      // Calculate current streak
      const currentStreak = this.calculateCurrentStreak(projects);
      
      // Calculate longest streak
      const longestStreak = this.calculateLongestStreak(projects);

      // Get favorite technologies
      const favoriteSkills = this.getFavoriteSkills(projects);

      // Get recent activity
      const recentActivity = this.getRecentActivity(projects);

      const stats = {
        totalProjects,
        completedProjects,
        totalTimeSpent,
        completionRate: Math.round(completionRate),
        currentStreak,
        longestStreak,
        favoriteSkills,
        recentActivity,
        lastActiveDate: new Date()
      };

      // Update profile with new stats
      await this.updateProfile(userId, { stats });
      
      return stats;
    } catch (error) {
      console.error('Error calculating stats:', error);
      throw new Error('Failed to calculate user statistics');
    }
  }

  // Calculate current streak
  calculateCurrentStreak(projects) {
    const today = new Date();
    let streak = 0;
    let currentDate = new Date(today);

    // Check each day going backwards
    for (let i = 0; i < 365; i++) { // Max 365 days
      const dateStr = currentDate.toDateString();
      const hasActivity = projects.some(project => {
        const lastWorked = project.progress?.lastWorkedOn;
        if (!lastWorked) return false;
        return new Date(lastWorked).toDateString() === dateStr;
      });

      if (hasActivity) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  // Calculate longest streak
  calculateLongestStreak(projects) {
    // Get all unique activity dates
    const activityDates = new Set();
    projects.forEach(project => {
      if (project.progress?.lastWorkedOn) {
        activityDates.add(new Date(project.progress.lastWorkedOn).toDateString());
      }
    });

    const sortedDates = Array.from(activityDates)
      .map(dateStr => new Date(dateStr))
      .sort((a, b) => a - b);

    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = sortedDates[i - 1];
      const currentDate = sortedDates[i];
      const daysDiff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }

    return Math.max(longestStreak, currentStreak);
  }

  // Get favorite skills/technologies
  getFavoriteSkills(projects) {
    const skillCounts = {};
    
    projects.forEach(project => {
      if (project.technologies) {
        project.technologies.forEach(tech => {
          skillCounts[tech] = (skillCounts[tech] || 0) + 1;
        });
      }
      if (project.tags) {
        project.tags.forEach(tag => {
          skillCounts[tag] = (skillCounts[tag] || 0) + 1;
        });
      }
    });

    return Object.entries(skillCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, count]) => ({ skill, count }));
  }

  // Get recent activity
  getRecentActivity(projects) {
    return projects
      .filter(p => p.progress?.lastWorkedOn)
      .sort((a, b) => new Date(b.progress.lastWorkedOn) - new Date(a.progress.lastWorkedOn))
      .slice(0, 10)
      .map(project => ({
        id: project.id,
        name: project.name || project.title,
        action: project.status === 'completed' ? 'completed' : 'worked on',
        date: project.progress.lastWorkedOn,
        type: project.type || 'project'
      }));
  }

  // Check and award achievements
  async checkAchievements(userId, projects, currentAchievements = []) {
    try {
      // Calculate stats needed for achievement checking
      const stats = await this.calculateUserStats(userId, projects);

      // Use the new achievement system
      const newAchievements = checkUserAchievements(stats, projects, currentAchievements);

      // Update profile with new achievements
      if (newAchievements.length > 0) {
        const updatedAchievements = [...currentAchievements, ...newAchievements];
        await this.updateProfile(userId, { achievements: updatedAchievements });
      }

      return newAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  // Export user data
  async exportUserData(userId) {
    try {
      const profile = await this.getProfile(userId);
      
      // Get user projects
      const projectsQuery = query(
        collection(db, 'projects'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const projectsSnap = await getDocs(projectsQuery);
      const projects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Compile export data
      const exportData = {
        profile,
        projects,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw new Error('Failed to export user data');
    }
  }

  // Delete user account and all data
  async deleteAccount(userId, user) {
    try {
      // Delete user profile
      await deleteDoc(doc(db, 'userProfiles', userId));
      
      // Delete user projects
      const projectsQuery = query(
        collection(db, 'projects'),
        where('userId', '==', userId)
      );
      const projectsSnap = await getDocs(projectsQuery);
      
      const deletePromises = projectsSnap.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // Delete user avatar from storage if exists
      try {
        const avatarRef = ref(storage, `avatars/${userId}`);
        await deleteObject(avatarRef);
      } catch (storageError) {
        // Avatar might not exist, continue
        console.log('No avatar to delete or error deleting avatar:', storageError);
      }

      // Finally delete the user account
      await deleteUser(user);
      
      return true;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw new Error('Failed to delete account');
    }
  }
}

export const profileService = new ProfileService();
export default profileService;
