// Debug utilities for troubleshooting project generation issues

export const checkEnvironmentSetup = () => {
  console.log('🔍 Environment Setup Check');
  console.log('========================');
  
  // Check API Key
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log('API Key Status:', {
    exists: !!apiKey,
    isDefault: apiKey === 'your_gemini_api_key_here',
    length: apiKey ? apiKey.length : 0,
    preview: apiKey ? `${apiKey.substring(0, 10)}...` : 'Not set'
  });
  
  // Check Environment Variables
  console.log('Environment Variables:', {
    NODE_ENV: import.meta.env.NODE_ENV,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  });
  
  // Check Network
  console.log('Network Status:', {
    online: navigator.onLine,
    userAgent: navigator.userAgent.substring(0, 50) + '...'
  });
  
  // Check Local Storage
  try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log('Local Storage: ✅ Working');
  } catch (e) {
    console.log('Local Storage: ❌ Not working', e.message);
  }
  
  // Check Console for errors
  console.log('Check the console above for any errors or warnings.');
  
  return {
    apiKeyConfigured: !!apiKey && apiKey !== 'your_gemini_api_key_here',
    networkOnline: navigator.onLine,
    localStorageWorking: true
  };
};

export const testGeminiConnection = async () => {
  console.log('🧪 Testing Gemini API Connection');
  console.log('================================');
  
  try {
    // Import the API service
    const { geminiApi } = await import('../services/geminiApi.js');
    
    console.log('📡 Sending test request to Gemini API...');
    
    const testResult = await geminiApi.generateProject(
      'Create a simple hello world app',
      'beginner',
      'coding',
      {}
    );
    
    console.log('✅ Gemini API test successful!');
    console.log('Response:', testResult);
    
    return {
      success: true,
      result: testResult
    };
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error);
    
    // Analyze the error
    let errorType = 'unknown';
    let suggestion = 'Check your internet connection and try again.';
    
    if (error.message.includes('API key')) {
      errorType = 'api_key';
      suggestion = 'Check that your VITE_GEMINI_API_KEY is correctly set in your .env file.';
    } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
      errorType = 'rate_limit';
      suggestion = 'You have exceeded the API rate limit. Wait a moment and try again.';
    } else if (error.message.includes('network') || error.message.includes('fetch')) {
      errorType = 'network';
      suggestion = 'Check your internet connection and firewall settings.';
    } else if (error.message.includes('JSON') || error.message.includes('parse')) {
      errorType = 'parsing';
      suggestion = 'The API response format was unexpected. This might be a temporary issue.';
    }
    
    console.log('Error Analysis:', {
      type: errorType,
      suggestion: suggestion
    });
    
    return {
      success: false,
      error: error.message,
      errorType,
      suggestion
    };
  }
};

export const runFullDiagnostic = async () => {
  console.log('🏥 Running Full Diagnostic');
  console.log('==========================');
  
  const envCheck = checkEnvironmentSetup();
  console.log('Environment Check:', envCheck);
  
  if (!envCheck.apiKeyConfigured) {
    console.log('❌ Cannot proceed with API test - API key not configured');
    return {
      environmentOk: false,
      apiTestOk: false,
      issues: ['API key not configured']
    };
  }
  
  if (!envCheck.networkOnline) {
    console.log('❌ Cannot proceed with API test - network offline');
    return {
      environmentOk: false,
      apiTestOk: false,
      issues: ['Network offline']
    };
  }
  
  const apiTest = await testGeminiConnection();
  console.log('API Test:', apiTest);
  
  const issues = [];
  if (!envCheck.apiKeyConfigured) issues.push('API key not configured');
  if (!envCheck.networkOnline) issues.push('Network offline');
  if (!apiTest.success) issues.push(`API test failed: ${apiTest.error}`);
  
  const result = {
    environmentOk: envCheck.apiKeyConfigured && envCheck.networkOnline,
    apiTestOk: apiTest.success,
    issues: issues,
    recommendations: []
  };
  
  if (issues.length === 0) {
    result.recommendations.push('✅ Everything looks good! Project generation should work.');
  } else {
    if (!envCheck.apiKeyConfigured) {
      result.recommendations.push('1. Set up your Gemini API key in the .env file');
    }
    if (!envCheck.networkOnline) {
      result.recommendations.push('2. Check your internet connection');
    }
    if (!apiTest.success && apiTest.suggestion) {
      result.recommendations.push(`3. ${apiTest.suggestion}`);
    }
  }
  
  console.log('🏁 Diagnostic Complete:', result);
  return result;
};

// Helper function to display diagnostic results in UI
export const formatDiagnosticResults = (results) => {
  let message = 'Diagnostic Results:\n\n';
  
  if (results.environmentOk && results.apiTestOk) {
    message += '✅ All systems operational!\n';
    message += 'Project generation should work normally.';
  } else {
    message += '❌ Issues detected:\n\n';
    results.issues.forEach((issue, index) => {
      message += `${index + 1}. ${issue}\n`;
    });
    
    if (results.recommendations.length > 0) {
      message += '\n📋 Recommendations:\n';
      results.recommendations.forEach(rec => {
        message += `${rec}\n`;
      });
    }
  }
  
  return message;
};

export default {
  checkEnvironmentSetup,
  testGeminiConnection,
  runFullDiagnostic,
  formatDiagnosticResults
};
