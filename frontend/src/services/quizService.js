import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { COLLECTIONS } from './firestore';

// Quiz question types
export const QUIZ_QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  FILL_BLANK: 'fill_blank',
  SHORT_ANSWER: 'short_answer'
};

// Quiz difficulty levels
export const QUIZ_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

// Utility function to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Determine quiz difficulty based on project difficulty
const getQuizDifficulty = (projectDifficulty) => {
  if (projectDifficulty <= 3) return QUIZ_DIFFICULTY.EASY;
  if (projectDifficulty <= 7) return QUIZ_DIFFICULTY.MEDIUM;
  return QUIZ_DIFFICULTY.HARD;
};

// Generate distractor options based on difficulty and domain
const generateDistractors = (correctAnswer, difficulty, domain, questionType) => {
  const distractors = [];

  if (questionType === 'main_focus') {
    const easyDistractors = [
      'Setting up the development environment',
      'Writing documentation',
      'Testing the application'
    ];
    const mediumDistractors = [
      'Implementing error handling mechanisms',
      'Optimizing performance bottlenecks',
      'Configuring deployment pipelines'
    ];
    const hardDistractors = [
      'Architecting scalable microservices',
      'Implementing advanced security protocols',
      'Designing distributed system patterns'
    ];

    switch (difficulty) {
      case QUIZ_DIFFICULTY.EASY:
        distractors.push(...easyDistractors);
        break;
      case QUIZ_DIFFICULTY.MEDIUM:
        distractors.push(...easyDistractors.slice(0, 1), ...mediumDistractors);
        break;
      case QUIZ_DIFFICULTY.HARD:
        distractors.push(...mediumDistractors.slice(0, 1), ...hardDistractors);
        break;
    }
  } else if (questionType === 'best_approach') {
    const easyDistractors = [
      'Rush through without understanding',
      'Skip testing your work',
      'Avoid asking for help when stuck'
    ];
    const mediumDistractors = [
      'Implement without planning the architecture',
      'Ignore code review feedback',
      'Skip version control for small changes'
    ];
    const hardDistractors = [
      'Optimize prematurely without profiling',
      'Implement complex patterns without justification',
      'Ignore scalability considerations'
    ];

    switch (difficulty) {
      case QUIZ_DIFFICULTY.EASY:
        distractors.push(...easyDistractors);
        break;
      case QUIZ_DIFFICULTY.MEDIUM:
        distractors.push(...easyDistractors.slice(0, 1), ...mediumDistractors);
        break;
      case QUIZ_DIFFICULTY.HARD:
        distractors.push(...mediumDistractors.slice(0, 1), ...hardDistractors);
        break;
    }
  }

  return distractors.slice(0, 3); // Return 3 distractors
};

// Generate quiz questions based on step content and project difficulty
export const generateQuizQuestions = (step, stepIndex, projectDomain = 'coding', projectDifficulty = 5) => {
  const questions = [];
  const quizDifficulty = getQuizDifficulty(projectDifficulty);
  const pointsPerQuestion = quizDifficulty === QUIZ_DIFFICULTY.EASY ? 25 :
                           quizDifficulty === QUIZ_DIFFICULTY.MEDIUM ? 25 : 30;

  // Generate questions based on step content
  if (step.title && step.description) {
    // Question 1: Multiple choice about the main concept
    const correctAnswer = step.learningFocus || step.description.substring(0, 50) + '...';
    const distractors = generateDistractors(correctAnswer, quizDifficulty, projectDomain, 'main_focus');

    const options = [
      { id: 'correct', text: correctAnswer, correct: true },
      ...distractors.map((distractor, index) => ({
        id: `distractor_${index}`,
        text: distractor,
        correct: false
      }))
    ];

    // Shuffle options and reassign IDs
    const shuffledOptions = shuffleArray(options).map((option, index) => ({
      ...option,
      id: String.fromCharCode(97 + index) // a, b, c, d
    }));

    questions.push({
      id: `step_${stepIndex}_q1`,
      type: QUIZ_QUESTION_TYPES.MULTIPLE_CHOICE,
      question: `What is the main focus of "${step.title}"?`,
      options: shuffledOptions,
      explanation: `The main focus is ${step.learningFocus || step.description}`,
      difficulty: quizDifficulty,
      points: pointsPerQuestion
    });

    // Question 2: True/False about the step's purpose (difficulty-adjusted)
    let trueFalseQuestion;
    if (quizDifficulty === QUIZ_DIFFICULTY.EASY) {
      trueFalseQuestion = `This step helps you understand ${step.learningFocus || 'the core concepts'}. True or False?`;
    } else if (quizDifficulty === QUIZ_DIFFICULTY.MEDIUM) {
      trueFalseQuestion = `Completing this step is essential for achieving the overall project objectives. True or False?`;
    } else {
      trueFalseQuestion = `This step represents a critical dependency for subsequent implementation phases. True or False?`;
    }

    questions.push({
      id: `step_${stepIndex}_q2`,
      type: QUIZ_QUESTION_TYPES.TRUE_FALSE,
      question: trueFalseQuestion,
      correct: true,
      explanation: step.connectionToGoal || `This step is designed to build understanding of ${step.learningFocus || 'key concepts'}.`,
      difficulty: quizDifficulty,
      points: pointsPerQuestion
    });
  }

  // Question 3: Multiple choice about implementation (difficulty-adjusted)
  let implementationQuestion;
  let correctImplementationAnswer;

  if (step.hints && step.hints.length > 0) {
    correctImplementationAnswer = step.hints[0];
    if (quizDifficulty === QUIZ_DIFFICULTY.EASY) {
      implementationQuestion = 'Which of the following is a helpful approach for this step?';
    } else if (quizDifficulty === QUIZ_DIFFICULTY.MEDIUM) {
      implementationQuestion = 'What is the most effective strategy for implementing this step?';
    } else {
      implementationQuestion = 'Which approach demonstrates best practices for this implementation phase?';
    }
  } else {
    if (quizDifficulty === QUIZ_DIFFICULTY.EASY) {
      correctImplementationAnswer = 'Break it down into smaller tasks';
      implementationQuestion = 'What is the best approach when working on this step?';
    } else if (quizDifficulty === QUIZ_DIFFICULTY.MEDIUM) {
      correctImplementationAnswer = 'Plan the architecture before implementation';
      implementationQuestion = 'What should be prioritized when approaching this step?';
    } else {
      correctImplementationAnswer = 'Consider scalability and maintainability from the start';
      implementationQuestion = 'Which principle should guide the implementation of this step?';
    }
  }

  const implementationDistractors = generateDistractors(correctImplementationAnswer, quizDifficulty, projectDomain, 'best_approach');

  const implementationOptions = [
    { id: 'correct', text: correctImplementationAnswer, correct: true },
    ...implementationDistractors.map((distractor, index) => ({
      id: `distractor_${index}`,
      text: distractor,
      correct: false
    }))
  ];

  // Shuffle options and reassign IDs
  const shuffledImplementationOptions = shuffleArray(implementationOptions).map((option, index) => ({
    ...option,
    id: String.fromCharCode(97 + index) // a, b, c, d
  }));

  questions.push({
    id: `step_${stepIndex}_q3`,
    type: QUIZ_QUESTION_TYPES.MULTIPLE_CHOICE,
    question: implementationQuestion,
    options: shuffledImplementationOptions,
    explanation: step.hints && step.hints.length > 0
      ? `The hint "${step.hints[0]}" provides valuable guidance for completing this step effectively.`
      : 'This approach follows software development best practices and ensures quality implementation.',
    difficulty: quizDifficulty,
    points: pointsPerQuestion
  });

  // Question 4: Reflection question (difficulty-adjusted)
  let reflectionQuestion;
  if (quizDifficulty === QUIZ_DIFFICULTY.EASY) {
    reflectionQuestion = 'Completing this step will contribute to your overall project understanding. True or False?';
  } else if (quizDifficulty === QUIZ_DIFFICULTY.MEDIUM) {
    reflectionQuestion = 'This step establishes foundational knowledge required for advanced project components. True or False?';
  } else {
    reflectionQuestion = 'The concepts learned in this step are critical for system architecture decisions. True or False?';
  }

  questions.push({
    id: `step_${stepIndex}_q4`,
    type: QUIZ_QUESTION_TYPES.TRUE_FALSE,
    question: reflectionQuestion,
    correct: true,
    explanation: step.connectionToGoal || 'Each step builds upon previous knowledge and contributes to the complete understanding of the project.',
    difficulty: quizDifficulty,
    points: pointsPerQuestion
  });

  // Add an additional question for hard difficulty
  if (quizDifficulty === QUIZ_DIFFICULTY.HARD && step.hints && step.hints.length > 1) {
    const advancedDistractors = [
      'Implement without considering edge cases',
      'Focus only on happy path scenarios',
      'Ignore performance implications'
    ];

    const advancedOptions = [
      { id: 'correct', text: step.hints[1] || 'Consider all possible failure scenarios', correct: true },
      ...advancedDistractors.map((distractor, index) => ({
        id: `distractor_${index}`,
        text: distractor,
        correct: false
      }))
    ];

    const shuffledAdvancedOptions = shuffleArray(advancedOptions).map((option, index) => ({
      ...option,
      id: String.fromCharCode(97 + index)
    }));

    questions.push({
      id: `step_${stepIndex}_q5`,
      type: QUIZ_QUESTION_TYPES.MULTIPLE_CHOICE,
      question: 'What advanced consideration should be made during this step?',
      options: shuffledAdvancedOptions,
      explanation: 'Advanced implementations require consideration of edge cases, performance, and maintainability.',
      difficulty: QUIZ_DIFFICULTY.HARD,
      points: 35
    });
  }

  return questions;
};

// Calculate quiz score
export const calculateQuizScore = (answers, questions) => {
  console.log('Calculating quiz score...');
  console.log('Answers received:', answers);
  console.log('Questions received:', questions);

  let totalPoints = 0;
  let earnedPoints = 0;
  let correctAnswers = 0;

  questions.forEach((question, index) => {
    totalPoints += question.points;
    const userAnswer = answers[question.id];

    console.log(`Question ${index + 1} (${question.id}):`, {
      question: question.question,
      userAnswer,
      type: question.type
    });

    if (question.type === QUIZ_QUESTION_TYPES.MULTIPLE_CHOICE) {
      const correctOption = question.options.find(opt => opt.correct);
      console.log(`  Correct option:`, correctOption);
      console.log(`  User selected:`, userAnswer);
      console.log(`  Match:`, userAnswer === correctOption?.id);

      if (userAnswer === correctOption?.id) {
        earnedPoints += question.points;
        correctAnswers++;
        console.log(`  ✓ Correct! +${question.points} points`);
      } else {
        console.log(`  ✗ Incorrect`);
      }
    } else if (question.type === QUIZ_QUESTION_TYPES.TRUE_FALSE) {
      console.log(`  Correct answer:`, question.correct);
      console.log(`  User answer:`, userAnswer);
      console.log(`  Match:`, userAnswer === question.correct);

      if (userAnswer === question.correct) {
        earnedPoints += question.points;
        correctAnswers++;
        console.log(`  ✓ Correct! +${question.points} points`);
      } else {
        console.log(`  ✗ Incorrect`);
      }
    }
  });

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  // Determine if passed based on difficulty
  const passingThreshold = 90; // Standard 90% threshold

  const result = {
    totalQuestions: questions.length,
    correctAnswers,
    totalPoints,
    earnedPoints,
    percentage,
    passed: percentage >= passingThreshold,
    difficulty: questions.length > 0 ? questions[0].difficulty : QUIZ_DIFFICULTY.MEDIUM
  };

  console.log('Final score calculation:', result);
  return result;
};

// Quiz service for Firestore operations
export const quizService = {
  // Save quiz attempt
  async saveQuizAttempt(userId, projectId, stepIndex, answers, score) {
    try {
      const quizAttempt = {
        userId,
        projectId,
        stepIndex,
        answers,
        score,
        timestamp: serverTimestamp(),
        passed: score.passed
      };

      const docRef = await addDoc(collection(db, COLLECTIONS.STEP_QUIZZES), quizAttempt);
      return docRef.id;
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
      throw error;
    }
  },

  // Get quiz attempts for a step
  async getQuizAttempts(userId, projectId, stepIndex) {
    try {
      const q = query(
        collection(db, COLLECTIONS.STEP_QUIZZES),
        where('userId', '==', userId),
        where('projectId', '==', projectId),
        where('stepIndex', '==', stepIndex)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting quiz attempts:', error);
      throw error;
    }
  },

  // Get best quiz score for a step
  async getBestQuizScore(userId, projectId, stepIndex) {
    try {
      const attempts = await this.getQuizAttempts(userId, projectId, stepIndex);
      if (attempts.length === 0) return null;

      return attempts.reduce((best, current) => {
        return current.score.percentage > (best?.score?.percentage || 0) ? current : best;
      }, null);
    } catch (error) {
      console.error('Error getting best quiz score:', error);
      throw error;
    }
  }
};

export default quizService;
