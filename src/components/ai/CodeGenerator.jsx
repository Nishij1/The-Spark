import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  SparklesIcon, 
  ClipboardDocumentIcon, 
  ArrowPathIcon,
  CodeBracketIcon 
} from '@heroicons/react/24/outline';
import { useGemini } from '../../hooks/useGemini';
import { useToast } from '../Toast';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
];

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [context, setContext] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const { generateCode, loading, error } = useGemini();
  const { showSuccess, showError } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      const result = await generateCode(prompt, language, context);
      setGeneratedCode(result);
      showSuccess('Code generated successfully!');
    } catch (err) {
      console.error('Generation failed:', err);
      showError('Failed to generate code. Please try again.');
    }
  };

  const handleCopy = async () => {
    if (!generatedCode) return;

    try {
      await navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showSuccess('Code copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      showError('Failed to copy code. Please try again.');
    }
  };

  const handleClear = () => {
    setGeneratedCode('');
    setPrompt('');
    setContext('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-gradient-to-r from-primary-500 to-spark-500 rounded-lg">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            AI Code Generator
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What do you want to build?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the code you want to generate..."
                className="input-field h-32 resize-none"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Programming Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input-field"
                disabled={loading}
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Context (Optional)
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Any additional context or requirements..."
                className="input-field h-24 resize-none"
                disabled={loading}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <ArrowPathIcon className="h-5 w-5 animate-spin mr-2" />
                    Generating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <SparklesIcon className="h-5 w-5 mr-2" />
                    Generate Code
                  </div>
                )}
              </button>

              <button
                onClick={handleClear}
                disabled={loading}
                className="btn-secondary"
              >
                Clear
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Output Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Generated Code
              </label>
              {generatedCode && (
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}
            </div>

            <div className="relative">
              {generatedCode ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-900 dark:bg-gray-800 rounded-lg p-4 overflow-auto max-h-96"
                >
                  <pre className="text-sm text-gray-100 dark:text-gray-200 whitespace-pre-wrap">
                    <code>{generatedCode}</code>
                  </pre>
                </motion.div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
                  <CodeBracketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Generated code will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
