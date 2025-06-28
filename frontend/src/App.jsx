import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import TubelightNavbarComplete from './components/ui/TubelightNavbarComplete';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Generate from './pages/Generate';
import ProjectExecution from './pages/ProjectExecution';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import QuizDebug from './pages/QuizDebug';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { UserJourneyProvider } from './context/UserJourneyContext';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <UserJourneyProvider>
            <ToastProvider>
              <Router>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
              <TubelightNavbarComplete />
              <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="pt-16"
              >
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/project/:projectId"
                  element={
                    <ProtectedRoute>
                      <ProjectExecution />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/generate"
                  element={
                    <ProtectedRoute>
                      <Generate />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/quiz-debug"
                  element={
                    <ProtectedRoute>
                      <QuizDebug />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              </motion.main>
            </div>
          </Router>
            </ToastProvider>
          </UserJourneyProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
