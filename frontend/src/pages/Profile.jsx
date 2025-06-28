import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  BookOpen, 
  Award, 
  Settings, 
  Camera,
  Save,
  Edit3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user: currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    background: currentUser?.background || '',
    skillLevel: currentUser?.skillLevel || 'beginner',
    bio: currentUser?.bio || '',
    interests: currentUser?.interests || [],
  });
  const skillLevels = [
    { value: 'beginner', label: 'Beginner', description: 'Just starting my learning journey' },
    { value: 'intermediate', label: 'Intermediate', description: 'Have some experience and knowledge' },
    { value: 'advanced', label: 'Advanced', description: 'Experienced and looking for challenges' },
  ];

  const interestOptions = [
    'Web Development', 'Mobile Development', 'Machine Learning', 'Data Science',
    'Cybersecurity', 'Game Development', 'IoT', 'Blockchain', 'UI/UX Design',
    'DevOps', 'Cloud Computing', 'Artificial Intelligence'
  ];

  const achievements = [
    { title: 'First Project', description: 'Completed your first AI-generated project', earned: false },
    { title: 'Multi-Domain Explorer', description: 'Created projects in 3+ different domains', earned: false },
    { title: 'Consistent Learner', description: 'Generated projects for 7 consecutive days', earned: false },
    { title: 'Advanced Challenger', description: 'Completed 5 advanced-level projects', earned: false },
  ];

  const stats = [
    { label: 'Projects Generated', value: '12' },
    { label: 'Projects Completed', value: '8' },
    { label: 'Learning Hours', value: '45' },
    { label: 'Domains Explored', value: '4' },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = () => {
    // TODO: Implement profile update API call
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Profile
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Manage your account and personalize your learning experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="card text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-spark-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {formData.name.charAt(0) || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <Camera className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
              
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                {currentUser.displayName || 'User'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {formData.background || 'Student'}
              </p>
              
              <div className="flex items-center justify-center space-x-2 mb-6">
                <Award className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {formData.skillLevel} Level
                </span>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full btn-primary"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>
            </div>

            {/* Stats */}
            <div className="card mt-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Learning Stats
              </h3>
              <div className="space-y-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">{stat.label}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Profile Information */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profile Information
                </h3>
                {isEditing && (
                  <button
                    onClick={handleSave}
                    className="btn-primary"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{formData.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{formData.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="background"
                      value={formData.background}
                      onChange={handleInputChange}
                      placeholder="e.g., Computer Science Student, Software Developer"
                      className="input-field"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <BookOpen className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{formData.background}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Skill Level
                  </label>
                  {isEditing ? (
                    <select
                      name="skillLevel"
                      value={formData.skillLevel}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      {skillLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label} - {level.description}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-2 mb-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-gray-900 dark:text-white capitalize">
                          {formData.skillLevel}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {skillLevels.find(l => l.value === formData.skillLevel)?.description}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself and your learning goals..."
                      rows={3}
                      className="input-field resize-none"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-900 dark:text-white">
                        {formData.bio || 'No bio added yet.'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Interests */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {interestOptions.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => isEditing && handleInterestToggle(interest)}
                    disabled={!isEditing}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                      formData.interests.includes(interest)
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    } ${isEditing ? 'hover:bg-primary-200 dark:hover:bg-primary-800 cursor-pointer' : 'cursor-default'}`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Achievements
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      achievement.earned
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <Award className={`h-6 w-6 ${
                      achievement.earned ? 'text-green-600 dark:text-green-400' : 'text-gray-400'
                    }`} />
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        achievement.earned 
                          ? 'text-green-900 dark:text-green-100' 
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${
                        achievement.earned 
                          ? 'text-green-700 dark:text-green-300' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.earned && (
                      <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded-full">
                        Earned
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
