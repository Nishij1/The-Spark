import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  Settings,
  Trophy,
  Target,
  Clock,
  BookOpen,
  Edit3,
  Save,
  X,
  Camera,
  Shield,
  Bell,
  Palette,
  Globe,
  Download,
  Trash2,
  Eye,
  EyeOff,
  Star,
  TrendingUp,
  Zap,
  Award,
  Lock,
  Key,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useProjects } from '../hooks/useProjects';
import { useToast } from '../components/Toast';
import StatsCard from '../components/profile/StatsCard';
import AchievementCard from '../components/profile/AchievementCard';
import ProfileProgress from '../components/profile/ProfileProgress';
import { ACHIEVEMENT_DEFINITIONS, getAchievementProgress } from '../data/achievements';

const Profile = () => {
  const { currentUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const { projects } = useProjects();
  const {
    profile,
    stats,
    achievements,
    loading,
    profileCompletion,
    userLevel,
    updateProfile,
    updateAuthProfile,
    uploadAvatar,
    checkAchievements
  } = useProfile();

  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Form data
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    website: '',
    skills: []
  });

  // Update form data when profile loads
  useEffect(() => {
    if (profile && currentUser) {
      setFormData({
        displayName: currentUser.displayName || '',
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || '',
        skills: profile.skills || []
      });
    }
  }, [profile, currentUser]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle skill addition
  const handleAddSkill = (skill) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  // Handle skill removal
  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Handle profile save
  const handleSaveProfile = async () => {
    try {
      // Update auth profile
      await updateAuthProfile({
        displayName: formData.displayName,
        photoURL: currentUser?.photoURL
      });

      // Update custom profile data
      await updateProfile({
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        skills: formData.skills
      });

      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  // Handle avatar upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await uploadAvatar(file);
    }
  };



  // Utility functions
  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Generate recent activity from projects data
  const getRecentActivity = () => {
    if (!projects || projects.length === 0) return [];

    const activities = [];

    // Sort projects by last updated/created date
    const sortedProjects = [...projects]
      .sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt);
        const dateB = new Date(b.updatedAt || b.createdAt);
        return dateB - dateA;
      })
      .slice(0, 5); // Get last 5 activities

    sortedProjects.forEach(project => {
      if (project.status === 'completed') {
        activities.push({
          action: 'Completed',
          name: project.title,
          date: project.updatedAt || project.createdAt,
          type: 'completion',
          icon: Trophy
        });
      } else if (project.status === 'in-progress') {
        activities.push({
          action: 'Started working on',
          name: project.title,
          date: project.updatedAt || project.createdAt,
          type: 'progress',
          icon: Target
        });
      } else {
        activities.push({
          action: 'Created',
          name: project.title,
          date: project.createdAt,
          type: 'creation',
          icon: Star
        });
      }
    });

    return activities;
  };

  // Get earned achievements
  const getEarnedAchievements = () => {
    return achievements || [];
  };

  // Get unearned achievements with progress
  const getUnearnedAchievements = () => {
    if (!stats || !projects) return [];

    const earnedIds = new Set(achievements.map(a => a.id));
    const unearned = ACHIEVEMENT_DEFINITIONS
      .filter(achievement => !earnedIds.has(achievement.id))
      .slice(0, 6) // Show top 6 unearned achievements
      .map(achievement => ({
        ...achievement,
        progress: getAchievementProgress(achievement, stats, projects)
      }))
      .sort((a, b) => b.progress - a.progress); // Sort by progress descending

    return unearned;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'stats', label: 'Statistics', icon: Target },
    { id: 'achievements', label: 'Achievements', icon: Trophy }
  ];

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage your account settings and track your learning progress
          </p>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-purple-100 flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                {currentUser?.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  currentUser?.displayName?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full cursor-pointer transition-colors">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {currentUser?.displayName || 'Anonymous User'}
                </h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${
                  userLevel.color === 'gray' ? 'from-gray-100 to-gray-200 text-gray-700' :
                  userLevel.color === 'blue' ? 'from-blue-100 to-blue-200 text-blue-700' :
                  userLevel.color === 'green' ? 'from-green-100 to-green-200 text-green-700' :
                  userLevel.color === 'purple' ? 'from-purple-100 to-purple-200 text-purple-700' :
                  userLevel.color === 'orange' ? 'from-orange-100 to-orange-200 text-orange-700' :
                  'from-red-100 to-red-200 text-red-700'
                }`}>
                  Level {userLevel.level} • {userLevel.title}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{currentUser?.email}</p>
              {profile?.bio && (
                <p className="text-gray-700 dark:text-gray-300">{profile.bio}</p>
              )}

              {/* Profile Completion */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Profile Completion</span>
                  <span className="font-medium text-gray-900 dark:text-white">{profileCompletion}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-100 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="btn-primary flex items-center space-x-2  bg-gradient-to-r from-violet-800 to-purple-300 hover:from-purple-900 hover:to-purple-300 text-white  rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <Save className="h-4 w-4" />
                    <span cl>Save</span>
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-primary flex items-center space-x-2  bg-gradient-to-r from-violet-800 to-purple-300 hover:from-purple-900 hover:to-purple-300 text-white  rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-90 shadow-lg hover:shadow-xl"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Profile</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Stats */}
              <div className="lg:col-span-2 space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {stats?.totalProjects || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Projects
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats?.completedProjects || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Completed
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {formatTime(stats?.totalTimeSpent || 0)}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Time Spent
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {stats?.currentStreak || 0}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Current Streak
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {getRecentActivity().length > 0 ? (
                      getRecentActivity().map((activity, index) => {
                        const IconComponent = activity.icon;
                        const getActivityColor = (type) => {
                          switch (type) {
                            case 'completion': return 'text-green-500';
                            case 'progress': return 'text-blue-500';
                            case 'creation': return 'text-purple-500';
                            default: return 'text-primary-500';
                          }
                        };

                        return (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                            <div className={`${getActivityColor(activity.type)}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-1">
                                <span className="text-gray-900 dark:text-white font-medium">
                                  {activity.action}
                                </span>
                                <span className="text-gray-600 dark:text-gray-300 truncate">
                                  "{activity.name}"
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                              {formatDate(activity.date)}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-8">
                        <Target className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 mb-2">
                          No recent activity
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          Start working on projects to see your activity here
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details Sidebar */}
              <div className="space-y-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Profile Details
                  </h3>
                  <div className="space-y-4">
                    {isEditing ? (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Display Name
                          </label>
                          <input
                            type="text"
                            name="displayName"
                            value={formData.displayName}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bio
                          </label>
                          <textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Location
                          </label>
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            placeholder="City, Country"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Website
                          </label>
                          <input
                            type="url"
                            name="website"
                            value={formData.website}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">{currentUser?.email}</span>
                        </div>
                        {profile?.location && (
                          <div className="flex items-center space-x-3">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700 dark:text-gray-300">{profile.location}</span>
                          </div>
                        )}
                        {profile?.website && (
                          <div className="flex items-center space-x-3">
                            <Globe className="h-4 w-4 text-gray-400" />
                            <a
                              href={profile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 dark:text-purple-400 hover:underline"
                            >
                              {profile.website}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-700 dark:text-gray-300">
                            Joined {formatDate(currentUser?.metadata?.creationTime)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Top Skills */}
                {stats?.favoriteSkills?.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Top Skills
                    </h3>
                    <div className="space-y-2">
                      {stats.favoriteSkills.slice(0, 5).map((skill, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">{skill.skill}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {skill.count} projects
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              {/* Stats Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  title="Total Projects"
                  value={stats?.totalProjects || 0}
                  subtitle="All time"
                  icon={Target}
                  color="primary"
                />
                <StatsCard
                  title="Completed"
                  value={stats?.completedProjects || 0}
                  subtitle={`${stats?.completionRate || 0}% completion rate`}
                  icon={Trophy}
                  color="green"
                  trend="up"
                  trendValue="+12%"
                />
                <StatsCard
                  title="Time Spent"
                  value={formatTime(stats?.totalTimeSpent || 0)}
                  subtitle="Learning time"
                  icon={Clock}
                  color="blue"
                />
                <StatsCard
                  title="Current Streak"
                  value={`${stats?.currentStreak || 0}`}
                  subtitle="days active"
                  icon={Zap}
                  color="orange"
                  trend={stats?.currentStreak > 0 ? "up" : "down"}
                  trendValue={`${stats?.currentStreak || 0}d`}
                />
              </div>

              {/* Detailed Statistics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Progress Overview */}
                <ProfileProgress
                  currentLevel={userLevel.level}
                  nextLevel={userLevel.level + 1}
                  progress={userLevel.progress}
                  completedProjects={stats?.completedProjects || 0}
                  projectsToNext={userLevel.projectsToNext}
                />

                {/* Activity Chart */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Activity Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats?.longestStreak || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Longest Streak
                        </div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {Math.round((stats?.totalTimeSpent || 0) / (stats?.totalProjects || 1))}m
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Avg. per Project
                        </div>
                      </div>
                    </div>

                    {/* Top Skills */}
                    {stats?.favoriteSkills?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Most Used Technologies
                        </h4>
                        <div className="space-y-2">
                          {stats.favoriteSkills.slice(0, 5).map((skill, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {skill.skill}
                              </span>
                              <div className="flex items-center space-x-2">
                                <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-purple-500 to-purple-100 h-2 rounded-full"
                                    style={{
                                      width: `${(skill.count / (stats.favoriteSkills[0]?.count || 1)) * 100}%`
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                                  {skill.count}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              {/* Achievement Summary */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Your Achievements
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Trophy className="h-4 w-4" />
                    <span>{getEarnedAchievements().length} earned</span>
                  </div>
                </div>

                {/* Achievement Progress */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {getEarnedAchievements().length}
                    </div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">
                      Achievements Earned
                    </div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {getEarnedAchievements().reduce((sum, a) => sum + (a.points || 10), 0)}
                    </div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">
                      Total Points
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {Math.round((getEarnedAchievements().length / ACHIEVEMENT_DEFINITIONS.length) * 100)}%
                    </div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">
                      Collection Progress
                    </div>
                  </div>
                </div>
              </div>

              {/* Earned Achievements */}
              {getEarnedAchievements().length > 0 && (
                <div className="card">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Earned Achievements
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getEarnedAchievements().map((achievement, index) => (
                      <AchievementCard
                        key={`earned-${achievement.id || achievement.title || index}`}
                        achievement={achievement}
                        isEarned={true}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Progress Towards Next Achievements */}
              <div className="card">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {getEarnedAchievements().length > 0 ? 'Next Achievements' : 'Available Achievements'}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getUnearnedAchievements().length > 0 ? (
                    getUnearnedAchievements().map((achievement, index) => (
                      <AchievementCard
                        key={`unearned-${achievement.id || achievement.title || index}`}
                        achievement={achievement}
                        isEarned={false}
                        progress={achievement.progress}
                      />
                    ))
                  ) : getEarnedAchievements().length === 0 ? (
                    <div className="col-span-2 text-center py-12">
                      <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No achievements yet
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Start completing projects to earn your first achievement!
                      </p>
                      <button
                        onClick={() => setActiveTab('overview')}
                        className="btn-primary"
                      >
                        View Your Projects
                      </button>
                    </div>
                  ) : (
                    <div className="col-span-2 text-center py-8">
                      <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Congratulations!
                      </h4>
                      <p className="text-gray-500 dark:text-gray-400">
                        You've earned all available achievements! Keep learning for future updates.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}






        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
