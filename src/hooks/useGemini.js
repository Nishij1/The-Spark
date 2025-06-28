import { useState, useEffect } from 'react';
import { geminiService } from '../services/gemini';
import { generationService } from '../services/firestore';
import { useAuth } from '../context/AuthContext';

export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const generateCode = async (prompt, language = 'javascript', context = '') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await geminiService.generateCode(prompt, language, context);
      
      // Save generation to Firestore if user is authenticated
      if (currentUser) {
        try {
          await generationService.save(currentUser.uid, {
            type: 'code_generation',
            prompt,
            language,
            context,
            result,
            timestamp: new Date(),
          });
        } catch (saveError) {
          console.warn('Failed to save generation:', saveError);
        }
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const analyzeCode = async (code, language = 'javascript') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await geminiService.analyzeCode(code, language);
      
      // Save analysis to Firestore if user is authenticated
      if (currentUser) {
        try {
          await generationService.save(currentUser.uid, {
            type: 'code_analysis',
            code,
            language,
            result,
            timestamp: new Date(),
          });
        } catch (saveError) {
          console.warn('Failed to save analysis:', saveError);
        }
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const explainCode = async (code, language = 'javascript') => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await geminiService.explainCode(code, language);
      
      // Save explanation to Firestore if user is authenticated
      if (currentUser) {
        try {
          await generationService.save(currentUser.uid, {
            type: 'code_explanation',
            code,
            language,
            result,
            timestamp: new Date(),
          });
        } catch (saveError) {
          console.warn('Failed to save explanation:', saveError);
        }
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generateProjectStructure = async (projectType, requirements) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await geminiService.generateProjectStructure(projectType, requirements);
      
      // Save structure generation to Firestore if user is authenticated
      if (currentUser) {
        try {
          await generationService.save(currentUser.uid, {
            type: 'project_structure',
            projectType,
            requirements,
            result,
            timestamp: new Date(),
          });
        } catch (saveError) {
          console.warn('Failed to save structure generation:', saveError);
        }
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    generateCode,
    analyzeCode,
    explainCode,
    generateProjectStructure,
    setError,
  };
}

export function useGenerationHistory() {
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  const fetchGenerations = async () => {
    if (!currentUser) {
      setGenerations([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const userGenerations = await generationService.getUserGenerations(currentUser.uid);
      setGenerations(userGenerations);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching generations:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteGeneration = async (generationId) => {
    try {
      setError(null);
      await generationService.delete(generationId);
      await fetchGenerations(); // Refresh the list
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Fetch generations when user changes
  useEffect(() => {
    fetchGenerations();
  }, [currentUser]);

  return {
    generations,
    loading,
    error,
    deleteGeneration,
    refetch: fetchGenerations,
  };
}
