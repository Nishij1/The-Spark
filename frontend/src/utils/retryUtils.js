/**
 * Retry utility for handling intermittent network failures
 */

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.baseDelay - Base delay in milliseconds (default: 1000)
 * @param {number} options.maxDelay - Maximum delay in milliseconds (default: 10000)
 * @param {Function} options.shouldRetry - Function to determine if error should trigger retry
 * @returns {Promise} - Promise that resolves with the result or rejects with the final error
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error) => isRetryableError(error)
  } = options;

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt + 1}/${maxRetries + 1}`);
      const result = await fn();
      console.log(`✅ Operation succeeded on attempt ${attempt + 1}`);
      return result;
    } catch (error) {
      lastError = error;
      console.warn(`❌ Attempt ${attempt + 1} failed:`, error.message);
      
      // Don't retry on the last attempt or if error is not retryable
      if (attempt === maxRetries || !shouldRetry(error)) {
        break;
      }
      
      // Calculate delay with exponential backoff
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      console.log(`⏳ Retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  console.error(`❌ All ${maxRetries + 1} attempts failed. Final error:`, lastError);
  throw lastError;
}

/**
 * Determine if an error is retryable
 * @param {Error} error - The error to check
 * @returns {boolean} - True if the error is retryable
 */
export function isRetryableError(error) {
  // Network errors that are worth retrying
  const retryableErrors = [
    'unavailable',
    'deadline-exceeded',
    'resource-exhausted',
    'internal',
    'cancelled'
  ];
  
  // Don't retry permission or authentication errors
  const nonRetryableErrors = [
    'permission-denied',
    'unauthenticated',
    'invalid-argument',
    'not-found'
  ];
  
  const errorCode = error.code?.toLowerCase();
  const errorMessage = error.message?.toLowerCase();
  
  // Check Firebase error codes
  if (errorCode) {
    if (nonRetryableErrors.includes(errorCode)) {
      return false;
    }
    if (retryableErrors.includes(errorCode)) {
      return true;
    }
  }
  
  // Check for network-related error messages
  if (errorMessage) {
    const networkErrorPatterns = [
      'network error',
      'connection error',
      'timeout',
      'temporarily unavailable',
      'service unavailable',
      'no internet connection'
    ];
    
    return networkErrorPatterns.some(pattern => 
      errorMessage.includes(pattern)
    );
  }
  
  // Default to not retrying unknown errors
  return false;
}

/**
 * Check if the user is currently online
 * @returns {boolean} - True if online
 */
export function isOnline() {
  return navigator.onLine;
}

/**
 * Wait for the user to come back online
 * @param {number} timeout - Maximum time to wait in milliseconds (default: 30000)
 * @returns {Promise<boolean>} - Promise that resolves when online or times out
 */
export function waitForOnline(timeout = 30000) {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve(true);
      return;
    }
    
    const timeoutId = setTimeout(() => {
      window.removeEventListener('online', onlineHandler);
      resolve(false);
    }, timeout);
    
    const onlineHandler = () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', onlineHandler);
      resolve(true);
    };
    
    window.addEventListener('online', onlineHandler);
  });
}