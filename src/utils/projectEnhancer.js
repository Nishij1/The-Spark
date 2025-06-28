/**
 * Utility functions to enhance projects with learning context and problem-solution mapping
 */

/**
 * Enhances a project with missing learning context fields
 * @param {Object} project - The project to enhance
 * @param {string} originalInput - The original user input that generated this project
 * @returns {Object} Enhanced project with learning context
 */
export const enhanceProjectWithLearningContext = (project, originalInput = '') => {
  const enhanced = { ...project };

  // Add problem-solution mapping if missing
  if (!enhanced.problemSolutionMapping) {
    enhanced.problemSolutionMapping = {
      originalProblem: originalInput || "Learn and practice new concepts through hands-on project building",
      howProjectSolves: `This ${enhanced.domain} project provides practical experience by building a real ${enhanced.title.toLowerCase()}. You'll learn by doing, which is the most effective way to understand complex concepts.`,
      whyThisApproach: "Hands-on project building is proven to be more effective than passive learning because it engages multiple learning pathways, provides immediate feedback, and creates lasting memories through practical application.",
      keyConnections: [
        `Building this project will teach you the fundamental concepts through practical implementation`,
        `Each step in the project reinforces theoretical knowledge with real-world application`,
        `The project's complexity is matched to your skill level for optimal learning progression`
      ]
    };
  }

  // Enhance learning objectives if they're just strings
  if (enhanced.learningObjectives && Array.isArray(enhanced.learningObjectives)) {
    enhanced.learningObjectives = enhanced.learningObjectives.map((obj, index) => {
      if (typeof obj === 'string') {
        return {
          objective: obj,
          connectionToInput: `This objective directly relates to your learning goal by providing hands-on experience with ${obj.toLowerCase()}`,
          measurableOutcome: `You'll be able to demonstrate understanding of ${obj.toLowerCase()} through practical implementation and be able to explain the concepts to others`
        };
      }
      // Ensure the object has all required properties
      if (typeof obj === 'object' && obj !== null) {
        return {
          objective: obj.objective || 'Learn new concepts',
          connectionToInput: obj.connectionToInput || 'This objective relates to your learning goal',
          measurableOutcome: obj.measurableOutcome || 'You will gain practical understanding'
        };
      }
      // Fallback for any other type
      return {
        objective: 'Learn new concepts',
        connectionToInput: 'This objective relates to your learning goal',
        measurableOutcome: 'You will gain practical understanding'
      };
    });
  } else if (!enhanced.learningObjectives) {
    // Add default learning objectives if none exist
    enhanced.learningObjectives = [
      {
        objective: 'Gain practical experience with the concepts you want to learn',
        connectionToInput: `This objective directly addresses your learning goal: "${originalInput || 'learn new concepts'}"`,
        measurableOutcome: 'You will be able to apply these concepts in real-world scenarios'
      }
    ];
  }

  // Add learning journey if missing
  if (!enhanced.learningJourney) {
    enhanced.learningJourney = {
      beforeProject: `You have a basic understanding of ${enhanced.domain} concepts but want to gain practical experience`,
      duringProject: `You'll discover how theoretical concepts apply in practice and gain confidence through hands-on building`,
      afterProject: `You'll have solid practical knowledge and the ability to tackle similar challenges independently`,
      realWorldApplication: `These skills are directly applicable to professional ${enhanced.domain} work and personal projects`
    };
  }

  // Enhance project steps with learning context
  if (enhanced.steps && Array.isArray(enhanced.steps)) {
    enhanced.steps = enhanced.steps.map((step, index) => {
      const enhancedStep = { ...step };
      
      if (!enhancedStep.learningFocus) {
        enhancedStep.learningFocus = `Core ${enhanced.domain} concepts and practical implementation`;
      }
      
      if (!enhancedStep.connectionToGoal) {
        enhancedStep.connectionToGoal = `This step builds toward your learning goal by providing hands-on experience with the concepts you wanted to understand`;
      }
      
      if (!enhancedStep.reflectionPrompts) {
        enhancedStep.reflectionPrompts = [
          `What new concepts did you learn in this step?`,
          `How does this step connect to your original learning goal?`,
          `What challenges did you face and how did you overcome them?`,
          `How can you apply what you learned here to other projects?`
        ];
      }
      
      return enhancedStep;
    });
  }

  return enhanced;
};

/**
 * Generates contextual reflection prompts based on project content
 * @param {Object} project - The project object
 * @param {string} stepTitle - The current step title
 * @param {number} stepIndex - The current step index
 * @returns {Array} Array of reflection prompts
 */
export const generateReflectionPrompts = (project, stepTitle, stepIndex) => {
  const basePrompts = [
    `What specific skills did you develop while completing "${stepTitle}"?`,
    `How does this step help you understand your original learning goal better?`,
    `What was the most challenging part of this step and how did you solve it?`,
    `How can you apply what you learned in this step to future projects?`
  ];

  const domainSpecificPrompts = {
    coding: [
      `What programming concepts became clearer through this implementation?`,
      `How would you explain the code you wrote to someone else?`,
      `What debugging strategies did you use when things didn't work?`
    ],
    hardware: [
      `How do the physical components relate to the theoretical concepts?`,
      `What would happen if you modified the circuit or components?`,
      `How does this hardware solution solve real-world problems?`
    ],
    design: [
      `What design principles did you apply and why?`,
      `How does your design solution address user needs?`,
      `What would you change if you were designing for a different audience?`
    ],
    research: [
      `What patterns or insights emerged from your analysis?`,
      `How do your findings relate to existing knowledge in this field?`,
      `What questions arose that could lead to further research?`
    ]
  };

  const domain = project.domain?.toLowerCase() || 'coding';
  const specificPrompts = domainSpecificPrompts[domain] || domainSpecificPrompts.coding;

  // Combine base prompts with domain-specific ones
  const allPrompts = [...basePrompts, ...specificPrompts];
  
  // Return a selection of prompts (3-4 prompts per step)
  return allPrompts.slice(0, 4);
};

/**
 * Creates a learning progress summary
 * @param {Object} project - The project object
 * @param {Array} completedSteps - Array of completed step indices
 * @returns {Object} Learning progress summary
 */
export const generateLearningProgressSummary = (project, completedSteps = []) => {
  const totalSteps = project.steps?.length || 0;
  const completedCount = completedSteps.length;
  const progressPercentage = totalSteps > 0 ? (completedCount / totalSteps) * 100 : 0;

  const summary = {
    progressPercentage,
    completedSteps: completedCount,
    totalSteps,
    skillsLearned: [],
    conceptsMastered: [],
    nextMilestone: null,
    learningInsights: []
  };

  // Extract skills learned from completed steps
  if (project.steps && completedSteps.length > 0) {
    completedSteps.forEach(stepIndex => {
      const step = project.steps[stepIndex];
      if (step?.learningFocus) {
        summary.skillsLearned.push(step.learningFocus);
      }
    });
  }

  // Determine next milestone
  if (completedCount < totalSteps) {
    const nextStep = project.steps?.[completedCount];
    if (nextStep) {
      summary.nextMilestone = {
        stepTitle: nextStep.title,
        learningFocus: nextStep.learningFocus,
        connectionToGoal: nextStep.connectionToGoal
      };
    }
  }

  // Generate learning insights based on progress
  if (progressPercentage >= 75) {
    summary.learningInsights.push("You're almost there! You've mastered most of the core concepts.");
  } else if (progressPercentage >= 50) {
    summary.learningInsights.push("Great progress! You're building solid understanding of the fundamentals.");
  } else if (progressPercentage >= 25) {
    summary.learningInsights.push("Good start! You're beginning to see how the concepts connect.");
  } else {
    summary.learningInsights.push("Welcome to your learning journey! Each step will build your understanding.");
  }

  return summary;
};

/**
 * Validates if a project has all required learning context fields
 * @param {Object} project - The project to validate
 * @returns {Object} Validation result with missing fields
 */
export const validateProjectLearningContext = (project) => {
  const requiredFields = [
    'problemSolutionMapping',
    'learningObjectives',
    'learningJourney'
  ];

  const missingFields = [];
  const warnings = [];

  requiredFields.forEach(field => {
    if (!project[field]) {
      missingFields.push(field);
    }
  });

  // Check if learning objectives are properly structured
  if (project.learningObjectives && Array.isArray(project.learningObjectives)) {
    const hasStringObjectives = project.learningObjectives.some(obj => typeof obj === 'string');
    if (hasStringObjectives) {
      warnings.push('Learning objectives should include connection to input and measurable outcomes');
    }
  }

  // Check if steps have learning context
  if (project.steps && Array.isArray(project.steps)) {
    const stepsWithoutContext = project.steps.filter(step => 
      !step.learningFocus || !step.connectionToGoal || !step.reflectionPrompts
    );
    if (stepsWithoutContext.length > 0) {
      warnings.push(`${stepsWithoutContext.length} steps missing learning context`);
    }
  }

  return {
    isValid: missingFields.length === 0,
    missingFields,
    warnings,
    needsEnhancement: missingFields.length > 0 || warnings.length > 0
  };
};
