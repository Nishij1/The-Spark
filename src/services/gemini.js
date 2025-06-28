// Google Gemini API Service
class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
    this.model = 'gemini-1.5-flash-latest';
    
    // Rate limiting
    this.requestQueue = [];
    this.isProcessing = false;
    this.lastRequestTime = 0;
    this.minRequestInterval = 1000; // 1 second between requests
  }

  // Rate limiting helper
  async processQueue() {
    if (this.isProcessing || this.requestQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.requestQueue.length > 0) {
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      
      if (timeSinceLastRequest < this.minRequestInterval) {
        await new Promise(resolve => 
          setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
        );
      }
      
      const { resolve, reject, requestFn } = this.requestQueue.shift();
      
      try {
        this.lastRequestTime = Date.now();
        const result = await requestFn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
    
    this.isProcessing = false;
  }

  // Add request to queue
  queueRequest(requestFn) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ resolve, reject, requestFn });
      this.processQueue();
    });
  }

  // Make API request
  async makeRequest(endpoint, data) {
    if (!this.apiKey || this.apiKey === 'demo_gemini_key') {
      // Return mock response for demo
      return this.getMockResponse(data);
    }

    const response = await fetch(`${this.baseUrl}/${endpoint}?key=${this.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'API request failed');
    }

    return response.json();
  }

  // Mock response for demo purposes
  getMockResponse(data) {
    const prompt = data.contents?.[0]?.parts?.[0]?.text || '';
    
    if (prompt.includes('generate code') || prompt.includes('create a')) {
      return {
        candidates: [{
          content: {
            parts: [{
              text: `// Generated code based on your request
function exampleFunction() {
  console.log('This is a mock response for demo purposes');
  // TODO: Replace with actual Gemini API key
  return 'Generated code would appear here';
}

// Example usage
exampleFunction();`
            }]
          }
        }]
      };
    }
    
    if (prompt.includes('analyze') || prompt.includes('review')) {
      return {
        candidates: [{
          content: {
            parts: [{
              text: `## Code Analysis (Demo Mode)

**Summary:** This is a mock analysis response. To get real AI-powered code analysis, please configure your Google Gemini API key.

**Suggestions:**
- Add proper error handling
- Consider performance optimizations
- Implement input validation
- Add comprehensive documentation

**Note:** This is a demo response. Configure your Gemini API key for actual AI analysis.`
            }]
          }
        }]
      };
    }
    
    return {
      candidates: [{
        content: {
          parts: [{
            text: `This is a mock response for demo purposes. To get real AI-powered responses, please configure your Google Gemini API key in the environment variables.

Your request: "${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}"`
          }]
        }
      }]
    };
  }

  // Generate code
  async generateCode(prompt, language = 'javascript', context = '') {
    const requestFn = async () => {
      const fullPrompt = `Generate ${language} code for the following request:

${prompt}

${context ? `Context: ${context}` : ''}

Please provide clean, well-commented code with proper error handling.`;

      const data = {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      };

      const response = await this.makeRequest(`${this.model}:generateContent`, data);
      return response.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    };

    return this.queueRequest(requestFn);
  }

  // Analyze code
  async analyzeCode(code, language = 'javascript') {
    const requestFn = async () => {
      const prompt = `Analyze the following ${language} code and provide:
1. Code quality assessment
2. Potential issues or bugs
3. Performance suggestions
4. Best practices recommendations
5. Security considerations

Code to analyze:
\`\`\`${language}
${code}
\`\`\``;

      const data = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      };

      const response = await this.makeRequest(`${this.model}:generateContent`, data);
      return response.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis generated';
    };

    return this.queueRequest(requestFn);
  }

  // Explain code
  async explainCode(code, language = 'javascript') {
    const requestFn = async () => {
      const prompt = `Explain the following ${language} code in simple terms:

\`\`\`${language}
${code}
\`\`\`

Please provide:
1. What the code does
2. How it works step by step
3. Key concepts used
4. Potential use cases`;

      const data = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.5,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };

      const response = await this.makeRequest(`${this.model}:generateContent`, data);
      return response.candidates?.[0]?.content?.parts?.[0]?.text || 'No explanation generated';
    };

    return this.queueRequest(requestFn);
  }

  // Generate project structure
  async generateProjectStructure(projectType, requirements) {
    const requestFn = async () => {
      const prompt = `Generate a project structure for a ${projectType} project with the following requirements:

${requirements}

Please provide:
1. Folder structure
2. Key files and their purposes
3. Recommended dependencies
4. Basic setup instructions`;

      const data = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.6,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      };

      const response = await this.makeRequest(`${this.model}:generateContent`, data);
      return response.candidates?.[0]?.content?.parts?.[0]?.text || 'No structure generated';
    };

    return this.queueRequest(requestFn);
  }
}

export const geminiService = new GeminiService();
