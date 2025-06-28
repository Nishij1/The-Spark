import { PROJECT_DOMAINS, SKILL_LEVELS, PROJECT_TYPES } from '../services/firestore';

// Validation schemas for different project types
export const PROJECT_SCHEMAS = {
  // Basic manual project schema
  manual: {
    required: ['name', 'description'],
    optional: ['technology', 'tags', 'status'],
  },
  
  // AI-generated project schema
  generated: {
    required: [
      'name', 'description', 'domain', 'skillLevel', 'difficulty',
      'estimatedTime', 'learningObjectives', 'technologies', 'steps'
    ],
    optional: [
      'requirements', 'extensions', 'resources', 'inputSource',
      'tags', 'status'
    ],
  },
  
  // Template project schema
  template: {
    required: [
      'name', 'description', 'domain', 'skillLevel', 'steps',
      'learningObjectives', 'technologies'
    ],
    optional: [
      'requirements', 'extensions', 'resources', 'tags', 'difficulty',
      'estimatedTime'
    ],
  },
};

// Validation functions
export const validateProject = (projectData, type = PROJECT_TYPES.MANUAL) => {
  const errors = [];
  const warnings = [];
  
  const schema = PROJECT_SCHEMAS[type];
  if (!schema) {
    errors.push(`Unknown project type: ${type}`);
    return { isValid: false, errors, warnings };
  }
  
  // Check required fields
  schema.required.forEach(field => {
    if (!projectData[field] || (Array.isArray(projectData[field]) && projectData[field].length === 0)) {
      errors.push(`Required field missing: ${field}`);
    }
  });
  
  // Validate specific fields
  if (projectData.domain && !Object.values(PROJECT_DOMAINS).includes(projectData.domain)) {
    errors.push(`Invalid domain: ${projectData.domain}`);
  }
  
  if (projectData.skillLevel && !Object.values(SKILL_LEVELS).includes(projectData.skillLevel)) {
    errors.push(`Invalid skill level: ${projectData.skillLevel}`);
  }
  
  if (projectData.difficulty && (projectData.difficulty < 1 || projectData.difficulty > 10)) {
    errors.push('Difficulty must be between 1 and 10');
  }
  
  // Validate steps structure for generated projects
  if (type === PROJECT_TYPES.GENERATED && projectData.steps) {
    projectData.steps.forEach((step, index) => {
      if (!step.title) {
        errors.push(`Step ${index + 1} missing title`);
      }
      if (!step.description) {
        errors.push(`Step ${index + 1} missing description`);
      }
    });
  }
  
  // Validate learning objectives
  if (projectData.learningObjectives && projectData.learningObjectives.length === 0) {
    warnings.push('No learning objectives specified');
  }
  
  // Validate technologies
  if (projectData.technologies && projectData.technologies.length === 0) {
    warnings.push('No technologies specified');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

// Sanitize project data
export const sanitizeProject = (projectData) => {
  const sanitized = { ...projectData };
  
  // Trim strings
  if (sanitized.name) sanitized.name = sanitized.name.trim();
  if (sanitized.description) sanitized.description = sanitized.description.trim();
  if (sanitized.technology) sanitized.technology = sanitized.technology.trim();
  
  // Ensure arrays
  if (!Array.isArray(sanitized.tags)) sanitized.tags = [];
  if (!Array.isArray(sanitized.learningObjectives)) sanitized.learningObjectives = [];
  if (!Array.isArray(sanitized.technologies)) sanitized.technologies = [];
  if (!Array.isArray(sanitized.steps)) sanitized.steps = [];
  if (!Array.isArray(sanitized.extensions)) sanitized.extensions = [];
  if (!Array.isArray(sanitized.resources)) sanitized.resources = [];
  
  // Ensure objects
  if (!sanitized.requirements || typeof sanitized.requirements !== 'object') {
    sanitized.requirements = { tools: [], materials: [], prerequisites: [] };
  }
  
  // Ensure progress object
  if (!sanitized.progress || typeof sanitized.progress !== 'object') {
    sanitized.progress = {
      currentStep: 0,
      completedSteps: [],
      totalSteps: sanitized.steps.length,
      percentComplete: 0,
      timeSpent: 0,
      lastWorkedOn: null,
    };
  }
  
  // Set defaults
  if (!sanitized.status) sanitized.status = 'active';
  if (!sanitized.type) sanitized.type = PROJECT_TYPES.MANUAL;
  if (!sanitized.domain) sanitized.domain = PROJECT_DOMAINS.CODING;
  if (!sanitized.skillLevel) sanitized.skillLevel = SKILL_LEVELS.INTERMEDIATE;
  if (!sanitized.difficulty) sanitized.difficulty = 5;
  if (!sanitized.estimatedTime) sanitized.estimatedTime = 'Unknown';
  
  // Community defaults
  if (sanitized.isPublic === undefined) sanitized.isPublic = false;
  if (!sanitized.likes) sanitized.likes = 0;
  if (!sanitized.views) sanitized.views = 0;
  if (!sanitized.forks) sanitized.forks = 0;
  if (!Array.isArray(sanitized.ratings)) sanitized.ratings = [];
  if (!sanitized.averageRating) sanitized.averageRating = 0;
  
  return sanitized;
};

// Convert legacy projects to new schema
export const migrateProject = (projectData) => {
  const migrated = { ...projectData };
  
  // Add schema version if missing
  if (!migrated.schemaVersion) {
    migrated.schemaVersion = 1;
  }
  
  // Migrate from v1 to v2
  if (migrated.schemaVersion === 1) {
    // Add new fields with defaults
    migrated.type = migrated.isGenerated ? PROJECT_TYPES.GENERATED : PROJECT_TYPES.MANUAL;
    migrated.domain = migrated.domain || PROJECT_DOMAINS.CODING;
    migrated.skillLevel = migrated.skillLevel || SKILL_LEVELS.INTERMEDIATE;
    migrated.difficulty = migrated.difficulty || 5;
    migrated.estimatedTime = migrated.estimatedTime || 'Unknown';
    
    // Initialize arrays if missing
    if (!migrated.learningObjectives) migrated.learningObjectives = [];
    if (!migrated.technologies) migrated.technologies = [];
    if (!migrated.steps) migrated.steps = [];
    if (!migrated.extensions) migrated.extensions = [];
    if (!migrated.resources) migrated.resources = [];
    
    // Initialize requirements object
    if (!migrated.requirements) {
      migrated.requirements = { tools: [], materials: [], prerequisites: [] };
    }
    
    // Initialize progress tracking
    if (!migrated.progress) {
      migrated.progress = {
        currentStep: 0,
        completedSteps: [],
        totalSteps: migrated.steps.length,
        percentComplete: 0,
        timeSpent: 0,
        lastWorkedOn: null,
      };
    }
    
    // Initialize community features
    if (migrated.isPublic === undefined) migrated.isPublic = false;
    if (!migrated.likes) migrated.likes = 0;
    if (!migrated.views) migrated.views = 0;
    if (!migrated.forks) migrated.forks = 0;
    if (!migrated.ratings) migrated.ratings = [];
    if (!migrated.averageRating) migrated.averageRating = 0;
    
    migrated.schemaVersion = 2;
    migrated.version = '2.0';
  }
  
  return migrated;
};

// Generate project summary for display
export const generateProjectSummary = (project) => {
  const summary = {
    id: project.id,
    name: project.name,
    description: project.description,
    domain: project.domain,
    skillLevel: project.skillLevel,
    difficulty: project.difficulty,
    estimatedTime: project.estimatedTime,
    type: project.type,
    isGenerated: project.isGenerated,
    progress: project.progress?.percentComplete || 0,
    technologies: project.technologies?.slice(0, 3) || [],
    tags: project.tags?.slice(0, 5) || [],
    status: project.status,
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    isPublic: project.isPublic,
    likes: project.likes || 0,
    averageRating: project.averageRating || 0,
  };
  
  return summary;
};

// Export validation constants
export const VALIDATION_RULES = {
  NAME_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 1000,
  TAG_MAX_LENGTH: 30,
  MAX_TAGS: 10,
  MAX_TECHNOLOGIES: 15,
  MAX_STEPS: 50,
  MIN_DIFFICULTY: 1,
  MAX_DIFFICULTY: 10,
};
