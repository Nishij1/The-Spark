import React from 'react';
import { motion } from 'framer-motion';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full text-center"
          >
            <div className="card">
              <div className="flex flex-col items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Something went wrong
                </h2>
                
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
                </p>

                {import.meta.env.DEV && this.state.error && (
                  <details className="mb-6 w-full">
                    <summary className="text-sm text-gray-500 cursor-pointer mb-2">
                      Error Details (Development)
                    </summary>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs text-left overflow-auto max-h-32">
                      <pre className="whitespace-pre-wrap">
                        {this.state.error.toString()}
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  </details>
                )}

                <div className="flex space-x-3">
                  <button
                    onClick={this.handleRetry}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    <span>Try Again</span>
                  </button>
                  
                  <button
                    onClick={() => window.location.reload()}
                    className="btn-secondary"
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
