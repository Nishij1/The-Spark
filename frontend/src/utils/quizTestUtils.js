import { generateQuizQuestions, calculateQuizScore } from '../services/quizService';

// Test utility to verify quiz functionality
export const testQuizGeneration = () => {
  const testStep = {
    title: "Setting Up Your Development Environment",
    description: "Learn how to configure your development environment for optimal productivity.",
    learningFocus: "Development environment setup and configuration",
    connectionToGoal: "A properly configured development environment is essential for efficient coding.",
    hints: [
      "Start by installing the latest version of your chosen IDE",
      "Configure your IDE with useful extensions and plugins",
      "Set up version control (Git) early in the process"
    ]
  };

  console.log('=== Testing Quiz Generation ===');
  
  // Test different difficulty levels
  const difficulties = [1, 3, 5, 7, 10];
  
  difficulties.forEach(difficulty => {
    console.log(`\n--- Testing Difficulty Level ${difficulty} ---`);
    const questions = generateQuizQuestions(testStep, 0, 'coding', difficulty);
    
    console.log(`Generated ${questions.length} questions`);
    console.log(`Difficulty: ${questions[0]?.difficulty || 'unknown'}`);
    console.log(`Total possible points: ${questions.reduce((sum, q) => sum + q.points, 0)}`);
    
    // Test option randomization
    const mcQuestions = questions.filter(q => q.type === 'multiple_choice');
    if (mcQuestions.length > 0) {
      console.log('First MC question options order:', mcQuestions[0].options.map(opt => opt.id));
    }
    
    // Test perfect score
    const perfectAnswers = {};
    questions.forEach(question => {
      if (question.type === 'multiple_choice') {
        const correctOption = question.options.find(opt => opt.correct);
        perfectAnswers[question.id] = correctOption.id;
      } else if (question.type === 'true_false') {
        perfectAnswers[question.id] = question.correct;
      }
    });
    
    const perfectScore = calculateQuizScore(perfectAnswers, questions);
    console.log(`Perfect score: ${perfectScore.percentage}% (${perfectScore.correctAnswers}/${perfectScore.totalQuestions})`);
    console.log(`Passed: ${perfectScore.passed}`);
  });
  
  console.log('\n=== Quiz Generation Test Complete ===');
};

// Test option randomization
export const testOptionRandomization = () => {
  const testStep = {
    title: "Test Step",
    description: "Test description",
    learningFocus: "Test focus",
    hints: ["Test hint"]
  };
  
  console.log('=== Testing Option Randomization ===');
  
  // Generate the same quiz multiple times to check randomization
  const generations = [];
  for (let i = 0; i < 5; i++) {
    const questions = generateQuizQuestions(testStep, 0, 'coding', 5);
    const mcQuestion = questions.find(q => q.type === 'multiple_choice');
    if (mcQuestion) {
      generations.push(mcQuestion.options.map(opt => opt.id));
    }
  }
  
  console.log('Option orders across 5 generations:');
  generations.forEach((order, index) => {
    console.log(`Generation ${index + 1}: [${order.join(', ')}]`);
  });
  
  // Check if we got different orders
  const uniqueOrders = new Set(generations.map(order => order.join(',')));
  console.log(`Unique orders: ${uniqueOrders.size} out of ${generations.length}`);
  console.log('Randomization working:', uniqueOrders.size > 1 ? 'YES' : 'NO');
  
  console.log('\n=== Option Randomization Test Complete ===');
};

// Test scoring with different answer combinations
export const testScoring = () => {
  const testStep = {
    title: "Test Step",
    description: "Test description",
    learningFocus: "Test focus",
    hints: ["Test hint 1", "Test hint 2"]
  };
  
  console.log('=== Testing Scoring ===');
  
  const questions = generateQuizQuestions(testStep, 0, 'coding', 7); // Hard difficulty
  console.log(`Testing with ${questions.length} questions`);
  
  // Test scenarios
  const scenarios = [
    { name: 'Perfect Score', getAnswers: (qs) => {
      const answers = {};
      qs.forEach(q => {
        if (q.type === 'multiple_choice') {
          const correct = q.options.find(opt => opt.correct);
          answers[q.id] = correct.id;
        } else {
          answers[q.id] = q.correct;
        }
      });
      return answers;
    }},
    { name: 'All Wrong', getAnswers: (qs) => {
      const answers = {};
      qs.forEach(q => {
        if (q.type === 'multiple_choice') {
          const wrong = q.options.find(opt => !opt.correct);
          answers[q.id] = wrong?.id || 'wrong';
        } else {
          answers[q.id] = !q.correct;
        }
      });
      return answers;
    }},
    { name: 'Half Right', getAnswers: (qs) => {
      const answers = {};
      qs.forEach((q, index) => {
        if (index % 2 === 0) {
          // Correct answer
          if (q.type === 'multiple_choice') {
            const correct = q.options.find(opt => opt.correct);
            answers[q.id] = correct.id;
          } else {
            answers[q.id] = q.correct;
          }
        } else {
          // Wrong answer
          if (q.type === 'multiple_choice') {
            const wrong = q.options.find(opt => !opt.correct);
            answers[q.id] = wrong?.id || 'wrong';
          } else {
            answers[q.id] = !q.correct;
          }
        }
      });
      return answers;
    }}
  ];
  
  scenarios.forEach(scenario => {
    const answers = scenario.getAnswers(questions);
    const score = calculateQuizScore(answers, questions);
    console.log(`\n${scenario.name}:`);
    console.log(`  Score: ${score.percentage}%`);
    console.log(`  Correct: ${score.correctAnswers}/${score.totalQuestions}`);
    console.log(`  Points: ${score.earnedPoints}/${score.totalPoints}`);
    console.log(`  Passed: ${score.passed}`);
  });
  
  console.log('\n=== Scoring Test Complete ===');
};

// Run all tests
export const runAllQuizTests = () => {
  console.log('🧪 Starting Quiz System Tests...\n');
  
  try {
    testQuizGeneration();
    testOptionRandomization();
    testScoring();
    
    console.log('✅ All quiz tests completed successfully!');
  } catch (error) {
    console.error('❌ Quiz test failed:', error);
  }
};

export default {
  testQuizGeneration,
  testOptionRandomization,
  testScoring,
  runAllQuizTests
};
