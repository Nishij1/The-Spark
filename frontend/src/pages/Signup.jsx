import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SignupForm from '../components/auth/SignupForm';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-spark-600 dark:text-spark-400 mb-2">
            Project Spark
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ignite your coding potential with AI
          </p>
        </motion.div>
        
        <SignupForm />
      </div>
    </div>
  );
}
