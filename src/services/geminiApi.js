import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Rate limiting configuration
const RATE_LIMIT = {
  maxRequests: 10,
  timeWindow: 60000, // 1 minute
  requests: [],
};

// Check rate limit
const checkRateLimit = () => {
  const now = Date.now();
  RATE_LIMIT.requests = RATE_LIMIT.requests.filter(
    timestamp => now - timestamp < RATE_LIMIT.timeWindow
  );
  
  if (RATE_LIMIT.requests.length >= RATE_LIMIT.maxRequests) {
    throw new Error('Rate limit exceeded. Please wait before making more requests.');
  }
  
  RATE_LIMIT.requests.push(now);
};

// Project generation prompts
const PROMPTS = {
  projectGeneration: (input, skillLevel, domain, preferences) => `
You are an expert educational project designer. Your goal is to create a project that clearly solves the student's learning problem.

STUDENT'S LEARNING INPUT: "${input}"
SKILL LEVEL: ${skillLevel}
DOMAIN: ${domain}
PREFERENCES: ${JSON.stringify(preferences)}

CRITICAL: You must create a clear narrative from "I want to learn X" → "Here's a project that teaches X" → "Here's how each step builds understanding of X"

Generate a comprehensive project with detailed problem-solution mapping:

{
  "title": "Engaging project title",
  "description": "2-3 sentence project overview",
  "domain": "${domain}",
  "skillLevel": "${skillLevel}",
  "estimatedTime": "X hours/days/weeks",
  "difficulty": 1-10,
  "problemSolutionMapping": {
    "originalProblem": "Clearly restate what the student wants to learn from their input",
    "howProjectSolves": "Detailed explanation of how this specific project addresses their learning need",
    "whyThisApproach": "Why this hands-on approach is effective for learning this concept",
    "keyConnections": [
      "Connection 1: How project element X teaches concept Y from the input",
      "Connection 2: How project element A reinforces concept B from the input"
    ]
  },
  "learningObjectives": [
    {
      "objective": "Primary learning objective directly related to input",
      "connectionToInput": "How this objective directly relates to the student's input",
      "measurableOutcome": "What the student will be able to do after achieving this objective"
    }
  ],
  "technologies": ["Technology 1", "Technology 2"],
  "requirements": {
    "tools": ["Tool 1", "Tool 2"],
    "materials": ["Material 1", "Material 2"],
    "prerequisites": ["Prerequisite 1", "Prerequisite 2"]
  },
  "steps": [
    {
      "title": "Step 1 Title",
      "description": "Detailed step description",
      "estimatedTime": "X minutes/hours",
      "learningFocus": "What specific concept from the input this step teaches",
      "connectionToGoal": "How this step helps solve the original learning problem",
      "hints": ["Helpful hint 1", "Helpful hint 2"],
      "reflectionPrompts": [
        "What did you learn in this step?",
        "How does this relate to your original question about [concept from input]?"
      ]
    }
  ],
  "extensions": ["Advanced feature 1", "Advanced feature 2"],
  "resources": [
    {
      "title": "Resource title",
      "url": "https://example.com",
      "type": "tutorial/documentation/video"
    }
  ],
  "learningJourney": {
    "beforeProject": "What the student knows/understands before starting",
    "duringProject": "Key insights they'll gain while building",
    "afterProject": "How their understanding will have evolved",
    "realWorldApplication": "How this knowledge applies beyond the project"
  }
}

Make the project:
- Practical and engaging
- Appropriate for the skill level
- Achievable within the estimated time
- Educational and skill-building
- Creative and inspiring
- CLEARLY connected to the original learning input
- Include explicit problem-solution mapping
- Provide step-by-step learning connections
- Include reflection prompts for deeper understanding

Respond ONLY with valid JSON.
`,

  skillAssessment: (responses) => `
Based on these skill assessment responses, determine the user's skill level:

${JSON.stringify(responses)}

Analyze their experience across different domains and provide a skill assessment with this structure:

{
  "overallLevel": "beginner|intermediate|advanced",
  "domainLevels": {
    "coding": "beginner|intermediate|advanced",
    "hardware": "beginner|intermediate|advanced",
    "design": "beginner|intermediate|advanced",
    "research": "beginner|intermediate|advanced"
  },
  "strengths": ["Strength 1", "Strength 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "suggestedDomains": ["Domain 1", "Domain 2"]
}

Respond ONLY with valid JSON.
`,

  projectRefinement: (project, feedback) => `
Refine this project based on user feedback:

PROJECT: ${JSON.stringify(project)}
FEEDBACK: ${feedback}

Provide an updated project with the same JSON structure, incorporating the feedback while maintaining educational value.

Respond ONLY with valid JSON.
`
};

class GeminiApiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateProject(input, skillLevel = 'intermediate', domain = 'coding', preferences = {}) {
    try {
      checkRateLimit();
      
      console.log('🤖 Generating project with Gemini API...', { input, skillLevel, domain });
      
      const prompt = PROMPTS.projectGeneration(input, skillLevel, domain, preferences);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('📝 Raw Gemini response:', text);
      
      // Parse JSON response
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const projectData = JSON.parse(cleanedText);
      
      // Add metadata
      projectData.id = `generated_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      projectData.isGenerated = true;
      projectData.generatedAt = new Date();
      projectData.inputSource = input;
      
      console.log('✅ Generated project:', projectData);
      return projectData;
      
    } catch (error) {
      console.error('❌ Error generating project:', error);
      
      if (error.message.includes('Rate limit')) {
        throw error;
      }
      
      if (error.message.includes('JSON')) {
        throw new Error('Failed to parse AI response. Please try again.');
      }
      
      throw new Error('Failed to generate project. Please check your internet connection and try again.');
    }
  }

  async assessSkillLevel(responses) {
    try {
      checkRateLimit();
      
      console.log('🧠 Assessing skill level with Gemini API...', responses);
      
      const prompt = PROMPTS.skillAssessment(responses);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('📊 Raw skill assessment response:', text);
      
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const assessment = JSON.parse(cleanedText);
      
      console.log('✅ Skill assessment:', assessment);
      return assessment;
      
    } catch (error) {
      console.error('❌ Error assessing skill level:', error);
      throw new Error('Failed to assess skill level. Please try again.');
    }
  }

  async refineProject(project, feedback) {
    try {
      checkRateLimit();
      
      console.log('🔧 Refining project with feedback...', { project: project.title, feedback });
      
      const prompt = PROMPTS.projectRefinement(project, feedback);
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      const refinedProject = JSON.parse(cleanedText);
      
      // Preserve original metadata
      refinedProject.id = project.id;
      refinedProject.isGenerated = true;
      refinedProject.generatedAt = project.generatedAt;
      refinedProject.refinedAt = new Date();
      refinedProject.inputSource = project.inputSource;
      
      console.log('✅ Refined project:', refinedProject);
      return refinedProject;
      
    } catch (error) {
      console.error('❌ Error refining project:', error);
      throw new Error('Failed to refine project. Please try again.');
    }
  }

  async generateMultipleProjects(input, skillLevel, count = 3) {
    try {
      const domains = ['coding', 'hardware', 'design', 'research'];
      const projects = [];
      
      for (let i = 0; i < Math.min(count, domains.length); i++) {
        const domain = domains[i];
        try {
          const project = await this.generateProject(input, skillLevel, domain);
          projects.push(project);
          
          // Add delay between requests to respect rate limits
          if (i < count - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.warn(`Failed to generate ${domain} project:`, error.message);
        }
      }
      
      return projects;
    } catch (error) {
      console.error('❌ Error generating multiple projects:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const geminiApi = new GeminiApiService();
export default geminiApi;
