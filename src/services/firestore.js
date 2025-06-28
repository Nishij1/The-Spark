import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  PROJECTS: 'projects',
  TEMPLATES: 'templates',
  GENERATIONS: 'generations',
  SKILL_ASSESSMENTS: 'skillAssessments',
  PROJECT_PROGRESS: 'projectProgress',
  COMMUNITY_PROJECTS: 'communityProjects',
};

// Project domains and types
export const PROJECT_DOMAINS = {
  CODING: 'coding',
  HARDWARE: 'hardware',
  DESIGN: 'design',
  RESEARCH: 'research',
};

export const SKILL_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

export const PROJECT_TYPES = {
  MANUAL: 'manual',
  GENERATED: 'generated',
  TEMPLATE: 'template',
  COMMUNITY: 'community',
};

// User operations
export const userService = {
  // Get user profile
  async getProfile(userId) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      const userSnap = await getDoc(userRef);
      return userSnap.exists() ? { id: userSnap.id, ...userSnap.data() } : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(userId, updates) {
    try {
      const userRef = doc(db, COLLECTIONS.USERS, userId);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  },
};

// Project operations
export const projectService = {
  // Create new project (enhanced for AI-generated projects)
  async create(userId, projectData) {
    console.log('Firestore create called with:', { userId, projectData });
    try {
      const dataToSave = {
        ...projectData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: projectData.status || 'active',

        // Enhanced fields for AI-generated projects
        type: projectData.type || PROJECT_TYPES.MANUAL,
        domain: projectData.domain || PROJECT_DOMAINS.CODING,
        skillLevel: projectData.skillLevel || SKILL_LEVELS.INTERMEDIATE,
        difficulty: projectData.difficulty || 5,
        estimatedTime: projectData.estimatedTime || 'Unknown',

        // AI-generated project specific fields
        isGenerated: projectData.isGenerated || false,
        generatedAt: projectData.generatedAt || null,
        inputSource: projectData.inputSource || null,
        learningObjectives: projectData.learningObjectives || [],
        technologies: projectData.technologies || [],
        requirements: projectData.requirements || {},
        steps: projectData.steps || [],
        extensions: projectData.extensions || [],
        resources: projectData.resources || [],

        // Progress tracking
        progress: {
          currentStep: 0,
          completedSteps: [],
          totalSteps: projectData.steps?.length || 0,
          percentComplete: 0,
          timeSpent: 0,
          lastWorkedOn: null,
        },

        // Community features
        isPublic: projectData.isPublic || false,
        likes: 0,
        views: 0,
        forks: 0,
        ratings: [],
        averageRating: 0,

        // Metadata
        version: '2.0',
        schemaVersion: 2,
      };
      console.log('Enhanced data to save to Firestore:', dataToSave);

      const projectRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), dataToSave);
      console.log('Project saved to Firestore with ID:', projectRef.id);
      return projectRef.id;
    } catch (error) {
      console.error('Error creating project in Firestore:', error);
      throw error;
    }
  },

  // Get user projects
  async getUserProjects(userId) {
    console.log('🔍 getUserProjects called for userId:', userId);
    try {
      // Use simple query without orderBy to avoid index requirement
      const q = query(
        collection(db, COLLECTIONS.PROJECTS),
        where('userId', '==', userId)
      );
      console.log('📡 Executing Firestore query (simple where clause)...');

      const querySnapshot = await getDocs(q);
      console.log('📊 Query completed. Documents found:', querySnapshot.size);

      const projects = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('📄 Project document:', { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data,
        };
      });

      // Sort on client side by updatedAt (newest first)
      const sortedProjects = projects.sort((a, b) => {
        // Handle different timestamp formats
        const getTime = (timestamp) => {
          if (!timestamp) return 0;
          if (timestamp.toDate) return timestamp.toDate().getTime();
          if (timestamp instanceof Date) return timestamp.getTime();
          if (typeof timestamp === 'string') return new Date(timestamp).getTime();
          return 0;
        };

        return getTime(b.updatedAt) - getTime(a.updatedAt);
      });

      console.log('✅ Returning sorted projects:', sortedProjects);
      return sortedProjects;
    } catch (error) {
      console.error('❌ Error getting user projects:', error);
      console.error('Error details:', error.code, error.message);
      throw error;
    }
  },

  // Get project by ID
  async getById(projectId) {
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      const projectSnap = await getDoc(projectRef);
      return projectSnap.exists() ? { id: projectSnap.id, ...projectSnap.data() } : null;
    } catch (error) {
      console.error('Error getting project:', error);
      throw error;
    }
  },

  // Update project
  async update(projectId, updates) {
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      await updateDoc(projectRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  async delete(projectId) {
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      await deleteDoc(projectRef);
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Subscribe to project changes
  subscribeToProject(projectId, callback) {
    const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
    return onSnapshot(projectRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  },

  // Subscribe to user projects changes
  subscribeToUserProjects(userId, callback) {
    console.log('🔔 Setting up real-time subscription for user:', userId);
    try {
      // Temporary fix: Use simple query without orderBy to avoid index requirement
      const q = query(
        collection(db, COLLECTIONS.PROJECTS),
        where('userId', '==', userId)
      );

      return onSnapshot(q, (querySnapshot) => {
        console.log('🔔 Real-time update received, documents:', querySnapshot.size);
        const projects = querySnapshot.docs.map(doc => {
          const data = doc.data();
          console.log('📄 Real-time project:', { id: doc.id, ...data });
          return {
            id: doc.id,
            ...data,
          };
        });

        // Sort on client side instead of server side
        const sortedProjects = projects.sort((a, b) => {
          const aTime = a.updatedAt?.toDate?.() || a.updatedAt || new Date(0);
          const bTime = b.updatedAt?.toDate?.() || b.updatedAt || new Date(0);
          return bTime - aTime; // Descending order (newest first)
        });

        console.log('🔔 Calling callback with sorted projects:', sortedProjects);
        callback(sortedProjects);
      }, (error) => {
        console.error('❌ Real-time subscription error:', error);
        console.error('❌ Error details:', error.code, error.message);
        // Fallback: call callback with empty array to prevent infinite loading
        callback([]);
      });
    } catch (error) {
      console.error('❌ Error setting up subscription:', error);
      throw error;
    }
  },
};

// Template operations
export const templateService = {
  // Get all templates
  async getAll() {
    try {
      const q = query(
        collection(db, COLLECTIONS.TEMPLATES),
        orderBy('name', 'asc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting templates:', error);
      throw error;
    }
  },

  // Get template by ID
  async getById(templateId) {
    try {
      const templateRef = doc(db, COLLECTIONS.TEMPLATES, templateId);
      const templateSnap = await getDoc(templateRef);
      return templateSnap.exists() ? { id: templateSnap.id, ...templateSnap.data() } : null;
    } catch (error) {
      console.error('Error getting template:', error);
      throw error;
    }
  },
};

// Generation history operations
export const generationService = {
  // Save generation
  async save(userId, generationData) {
    try {
      const generationRef = await addDoc(collection(db, COLLECTIONS.GENERATIONS), {
        ...generationData,
        userId,
        createdAt: serverTimestamp(),
      });
      return generationRef.id;
    } catch (error) {
      console.error('Error saving generation:', error);
      throw error;
    }
  },

  // Get user generations
  async getUserGenerations(userId, limitCount = 50) {
    try {
      const q = query(
        collection(db, COLLECTIONS.GENERATIONS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting user generations:', error);
      throw error;
    }
  },

  // Delete generation
  async delete(generationId) {
    try {
      const generationRef = doc(db, COLLECTIONS.GENERATIONS, generationId);
      await deleteDoc(generationRef);
    } catch (error) {
      console.error('Error deleting generation:', error);
      throw error;
    }
  },
};

// Skill Assessment operations
export const skillAssessmentService = {
  // Save skill assessment
  async save(userId, assessmentData) {
    try {
      const assessmentRef = await addDoc(collection(db, COLLECTIONS.SKILL_ASSESSMENTS), {
        ...assessmentData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return assessmentRef.id;
    } catch (error) {
      console.error('Error saving skill assessment:', error);
      throw error;
    }
  },

  // Get latest user assessment
  async getLatest(userId) {
    try {
      const q = query(
        collection(db, COLLECTIONS.SKILL_ASSESSMENTS),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const querySnapshot = await getDocs(q);
      const docs = querySnapshot.docs;
      return docs.length > 0 ? { id: docs[0].id, ...docs[0].data() } : null;
    } catch (error) {
      console.error('Error getting latest skill assessment:', error);
      throw error;
    }
  },

  // Update assessment
  async update(assessmentId, updates) {
    try {
      const assessmentRef = doc(db, COLLECTIONS.SKILL_ASSESSMENTS, assessmentId);
      await updateDoc(assessmentRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating skill assessment:', error);
      throw error;
    }
  },
};

// Project Progress operations
export const progressService = {
  // Update project progress
  async updateProgress(projectId, progressData) {
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      await updateDoc(projectRef, {
        'progress.currentStep': progressData.currentStep,
        'progress.completedSteps': progressData.completedSteps,
        'progress.percentComplete': progressData.percentComplete,
        'progress.timeSpent': progressData.timeSpent,
        'progress.lastWorkedOn': serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating project progress:', error);
      throw error;
    }
  },

  // Complete a step
  async completeStep(projectId, stepIndex, timeSpent = 0) {
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        throw new Error('Project not found');
      }

      const project = projectSnap.data();
      const progress = project.progress || {};
      const completedSteps = [...(progress.completedSteps || [])];

      if (!completedSteps.includes(stepIndex)) {
        completedSteps.push(stepIndex);
      }

      const totalSteps = project.steps?.length || 0;
      const percentComplete = totalSteps > 0 ? (completedSteps.length / totalSteps) * 100 : 0;

      await updateDoc(projectRef, {
        'progress.currentStep': Math.max(progress.currentStep || 0, stepIndex + 1),
        'progress.completedSteps': completedSteps,
        'progress.percentComplete': percentComplete,
        'progress.timeSpent': (progress.timeSpent || 0) + timeSpent,
        'progress.lastWorkedOn': serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return { completedSteps, percentComplete };
    } catch (error) {
      console.error('Error completing step:', error);
      throw error;
    }
  },

  // Get project progress
  async getProgress(projectId) {
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        return null;
      }

      const project = projectSnap.data();
      return project.progress || {};
    } catch (error) {
      console.error('Error getting project progress:', error);
      throw error;
    }
  },
};

// Community Projects operations
export const communityService = {
  // Publish project to community
  async publishProject(projectId, userId) {
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      await updateDoc(projectRef, {
        isPublic: true,
        publishedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Create community project entry
      const communityRef = await addDoc(collection(db, COLLECTIONS.COMMUNITY_PROJECTS), {
        projectId,
        userId,
        publishedAt: serverTimestamp(),
        featured: false,
        moderationStatus: 'pending',
      });

      return communityRef.id;
    } catch (error) {
      console.error('Error publishing project:', error);
      throw error;
    }
  },

  // Get public projects
  async getPublicProjects(limitCount = 20, domain = null) {
    try {
      let q = query(
        collection(db, COLLECTIONS.PROJECTS),
        where('isPublic', '==', true),
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );

      if (domain) {
        q = query(
          collection(db, COLLECTIONS.PROJECTS),
          where('isPublic', '==', true),
          where('domain', '==', domain),
          orderBy('publishedAt', 'desc'),
          limit(limitCount)
        );
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error('Error getting public projects:', error);
      throw error;
    }
  },

  // Like project
  async likeProject(projectId, userId) {
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        throw new Error('Project not found');
      }

      const project = projectSnap.data();
      const likes = project.likes || 0;

      await updateDoc(projectRef, {
        likes: likes + 1,
        updatedAt: serverTimestamp(),
      });

      return likes + 1;
    } catch (error) {
      console.error('Error liking project:', error);
      throw error;
    }
  },

  // Rate project
  async rateProject(projectId, userId, rating) {
    try {
      const projectRef = doc(db, COLLECTIONS.PROJECTS, projectId);
      const projectSnap = await getDoc(projectRef);

      if (!projectSnap.exists()) {
        throw new Error('Project not found');
      }

      const project = projectSnap.data();
      const ratings = project.ratings || [];

      // Remove existing rating from this user
      const filteredRatings = ratings.filter(r => r.userId !== userId);

      // Add new rating
      filteredRatings.push({ userId, rating, createdAt: new Date() });

      // Calculate average
      const averageRating = filteredRatings.reduce((sum, r) => sum + r.rating, 0) / filteredRatings.length;

      await updateDoc(projectRef, {
        ratings: filteredRatings,
        averageRating,
        updatedAt: serverTimestamp(),
      });

      return averageRating;
    } catch (error) {
      console.error('Error rating project:', error);
      throw error;
    }
  },
};
