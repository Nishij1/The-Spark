import { PROJECT_DOMAINS, SKILL_LEVELS } from '../services/firestore';

// Skill assessment questions organized by domain
export const ASSESSMENT_QUESTIONS = {
  [PROJECT_DOMAINS.CODING]: [
    {
      id: 'coding_experience',
      question: 'How long have you been coding?',
      type: 'single',
      options: [
        { value: 'none', label: 'I\'m completely new to coding', weight: 0 },
        { value: 'beginner', label: 'Less than 6 months', weight: 1 },
        { value: 'some', label: '6 months to 2 years', weight: 2 },
        { value: 'experienced', label: '2-5 years', weight: 3 },
        { value: 'expert', label: 'More than 5 years', weight: 4 },
      ],
    },
    {
      id: 'programming_languages',
      question: 'Which programming languages are you comfortable with?',
      type: 'multiple',
      options: [
        { value: 'javascript', label: 'JavaScript', weight: 1 },
        { value: 'python', label: 'Python', weight: 1 },
        { value: 'java', label: 'Java', weight: 1 },
        { value: 'cpp', label: 'C++', weight: 1 },
        { value: 'csharp', label: 'C#', weight: 1 },
        { value: 'go', label: 'Go', weight: 1 },
        { value: 'rust', label: 'Rust', weight: 1 },
        { value: 'php', label: 'PHP', weight: 1 },
        { value: 'ruby', label: 'Ruby', weight: 1 },
        { value: 'none', label: 'None yet', weight: 0 },
      ],
    },
    {
      id: 'frameworks_libraries',
      question: 'Have you worked with any frameworks or libraries?',
      type: 'multiple',
      options: [
        { value: 'react', label: 'React', weight: 1 },
        { value: 'vue', label: 'Vue.js', weight: 1 },
        { value: 'angular', label: 'Angular', weight: 1 },
        { value: 'nodejs', label: 'Node.js', weight: 1 },
        { value: 'express', label: 'Express.js', weight: 1 },
        { value: 'django', label: 'Django', weight: 1 },
        { value: 'flask', label: 'Flask', weight: 1 },
        { value: 'spring', label: 'Spring', weight: 1 },
        { value: 'none', label: 'None yet', weight: 0 },
      ],
    },
    {
      id: 'project_complexity',
      question: 'What\'s the most complex coding project you\'ve completed?',
      type: 'single',
      options: [
        { value: 'none', label: 'I haven\'t completed any projects yet', weight: 0 },
        { value: 'simple', label: 'Simple scripts or basic exercises', weight: 1 },
        { value: 'small_app', label: 'Small applications (calculator, to-do list)', weight: 2 },
        { value: 'full_app', label: 'Full applications with databases', weight: 3 },
        { value: 'complex', label: 'Complex systems with multiple components', weight: 4 },
      ],
    },
  ],

  [PROJECT_DOMAINS.HARDWARE]: [
    {
      id: 'hardware_experience',
      question: 'How familiar are you with hardware projects?',
      type: 'single',
      options: [
        { value: 'none', label: 'Complete beginner', weight: 0 },
        { value: 'basic', label: 'Basic electronics knowledge', weight: 1 },
        { value: 'some', label: 'Built simple circuits', weight: 2 },
        { value: 'experienced', label: 'Multiple hardware projects', weight: 3 },
        { value: 'expert', label: 'Advanced electronics and PCB design', weight: 4 },
      ],
    },
    {
      id: 'hardware_platforms',
      question: 'Which hardware platforms have you used?',
      type: 'multiple',
      options: [
        { value: 'arduino', label: 'Arduino', weight: 1 },
        { value: 'raspberry_pi', label: 'Raspberry Pi', weight: 1 },
        { value: 'esp32', label: 'ESP32/ESP8266', weight: 1 },
        { value: 'microbit', label: 'micro:bit', weight: 1 },
        { value: 'breadboard', label: 'Breadboard circuits', weight: 1 },
        { value: 'pcb', label: 'Custom PCBs', weight: 2 },
        { value: 'none', label: 'None yet', weight: 0 },
      ],
    },
    {
      id: 'electronics_knowledge',
      question: 'How comfortable are you with electronics concepts?',
      type: 'single',
      options: [
        { value: 'none', label: 'No knowledge of electronics', weight: 0 },
        { value: 'basic', label: 'Basic concepts (voltage, current, resistance)', weight: 1 },
        { value: 'intermediate', label: 'Can read schematics and use components', weight: 2 },
        { value: 'advanced', label: 'Design circuits and troubleshoot', weight: 3 },
        { value: 'expert', label: 'Advanced circuit design and analysis', weight: 4 },
      ],
    },
  ],

  [PROJECT_DOMAINS.DESIGN]: [
    {
      id: 'design_experience',
      question: 'How much design experience do you have?',
      type: 'single',
      options: [
        { value: 'none', label: 'No design experience', weight: 0 },
        { value: 'basic', label: 'Basic understanding of design principles', weight: 1 },
        { value: 'some', label: 'Created simple designs', weight: 2 },
        { value: 'experienced', label: 'Multiple design projects', weight: 3 },
        { value: 'expert', label: 'Professional design experience', weight: 4 },
      ],
    },
    {
      id: 'design_tools',
      question: 'Which design tools have you used?',
      type: 'multiple',
      options: [
        { value: 'figma', label: 'Figma', weight: 1 },
        { value: 'sketch', label: 'Sketch', weight: 1 },
        { value: 'adobe_xd', label: 'Adobe XD', weight: 1 },
        { value: 'photoshop', label: 'Photoshop', weight: 1 },
        { value: 'illustrator', label: 'Illustrator', weight: 1 },
        { value: 'canva', label: 'Canva', weight: 0.5 },
        { value: 'gimp', label: 'GIMP', weight: 1 },
        { value: 'none', label: 'None yet', weight: 0 },
      ],
    },
    {
      id: 'design_areas',
      question: 'Which design areas interest you most?',
      type: 'multiple',
      options: [
        { value: 'ui_ux', label: 'UI/UX Design', weight: 1 },
        { value: 'graphic', label: 'Graphic Design', weight: 1 },
        { value: 'web', label: 'Web Design', weight: 1 },
        { value: 'mobile', label: 'Mobile App Design', weight: 1 },
        { value: 'branding', label: 'Branding & Identity', weight: 1 },
        { value: 'print', label: 'Print Design', weight: 1 },
        { value: '3d', label: '3D Design', weight: 1 },
      ],
    },
  ],

  [PROJECT_DOMAINS.RESEARCH]: [
    {
      id: 'research_experience',
      question: 'How familiar are you with research methods?',
      type: 'single',
      options: [
        { value: 'none', label: 'No research experience', weight: 0 },
        { value: 'basic', label: 'Basic understanding of research', weight: 1 },
        { value: 'some', label: 'Completed simple research projects', weight: 2 },
        { value: 'experienced', label: 'Multiple research projects', weight: 3 },
        { value: 'expert', label: 'Advanced research and analysis', weight: 4 },
      ],
    },
    {
      id: 'research_areas',
      question: 'Which research areas interest you?',
      type: 'multiple',
      options: [
        { value: 'data_analysis', label: 'Data Analysis', weight: 1 },
        { value: 'user_research', label: 'User Research', weight: 1 },
        { value: 'market_research', label: 'Market Research', weight: 1 },
        { value: 'academic', label: 'Academic Research', weight: 1 },
        { value: 'case_studies', label: 'Case Studies', weight: 1 },
        { value: 'experiments', label: 'Experiments', weight: 1 },
        { value: 'surveys', label: 'Surveys & Interviews', weight: 1 },
      ],
    },
    {
      id: 'analysis_tools',
      question: 'Which analysis tools have you used?',
      type: 'multiple',
      options: [
        { value: 'excel', label: 'Excel/Google Sheets', weight: 0.5 },
        { value: 'python_pandas', label: 'Python (Pandas)', weight: 2 },
        { value: 'r', label: 'R', weight: 2 },
        { value: 'sql', label: 'SQL', weight: 1 },
        { value: 'tableau', label: 'Tableau', weight: 1 },
        { value: 'powerbi', label: 'Power BI', weight: 1 },
        { value: 'spss', label: 'SPSS', weight: 1 },
        { value: 'none', label: 'None yet', weight: 0 },
      ],
    },
  ],
};

// General questions that apply to all domains
export const GENERAL_QUESTIONS = [
  {
    id: 'learning_style',
    question: 'How do you prefer to learn new things?',
    type: 'multiple',
    options: [
      { value: 'hands_on', label: 'Hands-on practice', weight: 1 },
      { value: 'tutorials', label: 'Following tutorials', weight: 1 },
      { value: 'documentation', label: 'Reading documentation', weight: 1 },
      { value: 'videos', label: 'Watching videos', weight: 1 },
      { value: 'courses', label: 'Structured courses', weight: 1 },
      { value: 'experimentation', label: 'Trial and error', weight: 1 },
    ],
  },
  {
    id: 'time_commitment',
    question: 'How much time can you typically dedicate to a project?',
    type: 'single',
    options: [
      { value: 'minimal', label: '1-2 hours per week', weight: 1 },
      { value: 'light', label: '3-5 hours per week', weight: 2 },
      { value: 'moderate', label: '6-10 hours per week', weight: 3 },
      { value: 'heavy', label: '10+ hours per week', weight: 4 },
    ],
  },
  {
    id: 'project_goals',
    question: 'What are your main goals for building projects?',
    type: 'multiple',
    options: [
      { value: 'learning', label: 'Learning new skills', weight: 1 },
      { value: 'portfolio', label: 'Building a portfolio', weight: 1 },
      { value: 'career', label: 'Career advancement', weight: 1 },
      { value: 'fun', label: 'Personal enjoyment', weight: 1 },
      { value: 'problem_solving', label: 'Solving real problems', weight: 1 },
      { value: 'creativity', label: 'Creative expression', weight: 1 },
    ],
  },
];

// Skill level calculation logic
export const calculateSkillLevel = (responses, domain) => {
  const domainQuestions = ASSESSMENT_QUESTIONS[domain] || [];
  const generalQuestions = GENERAL_QUESTIONS;
  
  let totalWeight = 0;
  let maxPossibleWeight = 0;
  
  // Calculate domain-specific score
  domainQuestions.forEach(question => {
    const response = responses[question.id];
    if (response) {
      if (question.type === 'single') {
        const option = question.options.find(opt => opt.value === response);
        if (option) {
          totalWeight += option.weight;
        }
        maxPossibleWeight += Math.max(...question.options.map(opt => opt.weight));
      } else if (question.type === 'multiple' && Array.isArray(response)) {
        response.forEach(value => {
          const option = question.options.find(opt => opt.value === value);
          if (option) {
            totalWeight += option.weight;
          }
        });
        maxPossibleWeight += question.options.reduce((sum, opt) => sum + opt.weight, 0);
      }
    }
  });
  
  // Calculate percentage score
  const percentage = maxPossibleWeight > 0 ? (totalWeight / maxPossibleWeight) * 100 : 0;
  
  // Determine skill level based on percentage
  if (percentage < 20) return SKILL_LEVELS.BEGINNER;
  if (percentage < 60) return SKILL_LEVELS.INTERMEDIATE;
  return SKILL_LEVELS.ADVANCED;
};

// Generate skill assessment summary
export const generateSkillSummary = (responses) => {
  const domainLevels = {};
  const strengths = [];
  const recommendations = [];
  
  // Calculate skill level for each domain
  Object.values(PROJECT_DOMAINS).forEach(domain => {
    domainLevels[domain] = calculateSkillLevel(responses, domain);
  });
  
  // Determine overall skill level (average)
  const levels = Object.values(domainLevels);
  const levelValues = levels.map(level => {
    switch (level) {
      case SKILL_LEVELS.BEGINNER: return 1;
      case SKILL_LEVELS.INTERMEDIATE: return 2;
      case SKILL_LEVELS.ADVANCED: return 3;
      default: return 1;
    }
  });
  
  const averageLevel = levelValues.reduce((sum, val) => sum + val, 0) / levelValues.length;
  let overallLevel = SKILL_LEVELS.BEGINNER;
  if (averageLevel >= 2.5) overallLevel = SKILL_LEVELS.ADVANCED;
  else if (averageLevel >= 1.5) overallLevel = SKILL_LEVELS.INTERMEDIATE;
  
  // Identify strengths
  Object.entries(domainLevels).forEach(([domain, level]) => {
    if (level === SKILL_LEVELS.ADVANCED) {
      strengths.push(domain);
    }
  });
  
  // Generate recommendations
  if (overallLevel === SKILL_LEVELS.BEGINNER) {
    recommendations.push('Start with simple projects to build confidence');
    recommendations.push('Focus on learning fundamentals');
    recommendations.push('Follow step-by-step tutorials');
  } else if (overallLevel === SKILL_LEVELS.INTERMEDIATE) {
    recommendations.push('Try projects that combine multiple skills');
    recommendations.push('Experiment with new technologies');
    recommendations.push('Build projects that solve real problems');
  } else {
    recommendations.push('Take on challenging, complex projects');
    recommendations.push('Mentor others and share your knowledge');
    recommendations.push('Contribute to open source projects');
  }
  
  // Suggest domains to explore
  const suggestedDomains = Object.entries(domainLevels)
    .filter(([_, level]) => level !== SKILL_LEVELS.ADVANCED)
    .map(([domain, _]) => domain)
    .slice(0, 2);
  
  return {
    overallLevel,
    domainLevels,
    strengths,
    recommendations,
    suggestedDomains,
    responses,
    assessedAt: new Date(),
  };
};
