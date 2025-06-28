import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Zap,
  Brain,
  Lightbulb,
  Target,
  Users,
  ArrowRight,
  Sparkles,
  Code,
  Cpu,
  Palette,
  Search,
  Play,
  CheckCircle,
  Star,
  TrendingUp,
  BookOpen,
  Rocket
} from 'lucide-react';
import {
  SparklesIcon,
  AcademicCapIcon,
  RocketLaunchIcon,
  LightBulbIcon,
  CogIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: SparklesIcon,
      title: 'AI Project Generation',
      description: 'Transform any learning concept, lecture transcript, or topic into structured DIY projects with detailed steps and learning objectives.',
      highlight: 'ENHANCED',
    },
    {
      icon: AcademicCapIcon,
      title: 'Interactive Execution',
      description: 'Execute projects with step-by-step guidance, progress tracking, time management, and visual completion indicators.',
      highlight: 'NEW',
    },
    {
      icon: Target,
      title: 'Smart Navigation',
      description: 'One-click access to project details, seamless navigation between projects, and intuitive project management interface.',
      highlight: 'IMPROVED',
    },
    {
      icon: RocketLaunchIcon,
      title: 'Progress Tracking',
      description: 'Real-time progress monitoring, completion celebrations, time tracking, and persistent learning journey management.',
      highlight: 'ADVANCED',
    },
  ];

  const domains = [
    {
      icon: Code,
      name: 'Coding',
      color: 'from-blue-500 to-cyan-500',
      description: 'Web apps, mobile apps, APIs, algorithms',
      projects: '500+ projects'
    },
    {
      icon: Cpu,
      name: 'Hardware',
      color: 'from-green-500 to-emerald-500',
      description: 'Arduino, Raspberry Pi, IoT devices',
      projects: '200+ projects'
    },
    {
      icon: Palette,
      name: 'Design',
      color: 'from-purple-500 to-pink-500',
      description: 'UI/UX, graphics, prototypes',
      projects: '300+ projects'
    },
    {
      icon: Search,
      name: 'Research',
      color: 'from-orange-500 to-red-500',
      description: 'Data analysis, experiments, studies',
      projects: '150+ projects'
    },
  ];

  const sampleProjects = [
    {
      title: 'Personal Finance Tracker',
      domain: 'Coding',
      difficulty: 'Intermediate',
      time: '2-3 days',
      description: 'Build a React app to track expenses with charts and budgeting features.',
      technologies: ['React', 'Chart.js', 'Firebase'],
    },
    {
      title: 'Smart Plant Monitor',
      domain: 'Hardware',
      difficulty: 'Beginner',
      time: '1 day',
      description: 'Create an Arduino-based system to monitor soil moisture and light levels.',
      technologies: ['Arduino', 'Sensors', 'LCD Display'],
    },
    {
      title: 'Mobile App Redesign',
      domain: 'Design',
      difficulty: 'Advanced',
      time: '1 week',
      description: 'Redesign a popular app\'s interface with modern UX principles.',
      technologies: ['Figma', 'Prototyping', 'User Testing'],
    },
  ];

  const stats = [
    { number: '15,000+', label: 'Projects Generated', icon: Rocket },
    { number: '8,000+', label: 'Active Learners', icon: Users },
    { number: '98%', label: 'Completion Rate', icon: TrendingUp },
    { number: '4.9/5', label: 'User Rating', icon: Star },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-100 to-purple-100 dark:from-primary-900/30 dark:to-purple-900/30 text-purple-800 dark:text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <SparklesIcon className="h-4 w-4" />
                <span>Enhanced Project Execution & AI Generation</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:tl font-bold text-gray-900 dark:text-white mb-6">
                Never Wonder{' '}
                <span className="bg-gradient-to-r from-violet-800 to-violet-800 bg-clip-text text-transparent">
                  "What Should I Build?"
                </span>{' '}
                Again
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Transform any learning concept, lecture transcript, or topic into personalized DIY projects.
                Our enhanced AI generates structured projects with step-by-step execution, progress tracking, and interactive learning experiences.
              </p>

              {/* Key Benefits */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">AI-powered project generation with structured steps</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Interactive execution with progress tracking & time management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">One-click navigation and seamless project management</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300">Personalized to your skill level and learning goals</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/generate"
                      className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-800 to-purple-300 hover:from-purple-900 hover:to-purple-300 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <SparklesIcon className="h-5 w-5" />
                      <span>Generate AI Project</span>
                    </Link>
                    <Link
                      to="/dashboard"
                      className="inline-flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105"
                    >
                      <span>Dashboard</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      <span>Start Free Today</span>
                      <ArrowRight className="h-5 w-5" />
                    </Link>

                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-500 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105"
                    >
                      <span>Sign In</span>
                      <Zap className="h-5 w-5" />
                    </Link>
                  </>
                )}
              </div>
            </motion.div>

            {/* Right Column - Demo/Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">DIY Mission Engine</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Input:</div>
                    <div className="text-gray-900 dark:text-white">"I want to learn React hooks and state management"</div>
                  </div>

                  <div className="flex items-center justify-center py-2">
                    <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-300">
                      <CogIcon className="h-5 w-5 animate-spin" />
                      <span className="text-sm">AI Processing...</span>
                    </div>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="text-sm text-purple-600 dark:text-purple-200 mb-2">Generated Project:</div>
                    <div className="font-semibold text-gray-900 dark:text-white mb-2">Personal Task Manager with React Hooks</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">Build a task management app with 4 structured steps, progress tracking, and interactive execution...</div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded">React</span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded">Hooks</span>
                        <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded">Intermediate</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">4 steps • 2-3 hours</div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-200 to-purple-500 h-2 rounded-full" style={{width: '25%'}}></div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ready to start • Click to execute</div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-800 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ✨ AI Powered
              </div>
              <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-purple-800 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                🚀 Instant Results
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Enhanced Project Execution Platform
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Experience seamless project generation, interactive execution, and comprehensive progress tracking with our enhanced AI-powered platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative card text-center group hover:scale-105 transition-transform duration-200"
                >
                  {feature.highlight && (
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {feature.highlight}
                    </div>
                  )}
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-700 to-purple-300 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Domains Section */}
      <section className="py-20 bg-purple-100 dark:bg-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Multi-Domain Project Generation
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI generates personalized projects across multiple domains, ensuring you can explore any field of interest
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {domains.map((domain, index) => {
              const Icon = domain.icon;
              return (
                <motion.div
                  key={domain.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card text-center group hover:scale-105 transition-all duration-200 cursor-pointer"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${domain.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {domain.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {domain.description}
                  </p>
                  <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                    {domain.projects}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sample Projects Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              See What Our AI Can Generate
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Real examples of projects generated by our DIY Mission Engine for different skill levels and domains
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group hover:scale-105 transition-transform duration-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm rounded-full">
                    {project.domain}
                  </span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full">
                    {project.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {project.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {project.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>⏱️ {project.time}</span>
                  <span>🎯 {project.difficulty}</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              These are just examples. Our AI generates unique projects based on your specific input and skill level.
            </p>
            {isAuthenticated ? (
              <Link
                to="/generate"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-800 to-purple-300 hover:from-purple-300 hover:to-purple-800 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>Generate Your Own Project</span>
              </Link>
            ) : (
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-slate-50 hover:from-slate-100 hover:to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span>Try It Free</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Thousands of Learners
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Join the growing community of makers and learners
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-700 to-slate-50 rounded-xl mb-4">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-slate-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Learning Into Action?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of learners who never wonder "what should I build?" anymore.
              Start generating personalized projects with AI today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/generate"
                    className="inline-flex items-center space-x-2 bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <SparklesIcon className="h-5 w-5" />
                    <span>Generate AI Project</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="inline-flex items-center space-x-2 bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    <span>Start Free Today</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 hover:scale-105"
                  >
                    <span>Sign In</span>
                    <Zap className="h-5 w-5" />
                  </Link>
                </>
              )}
            </div>

            <div className="mt-8 text-white/80 text-sm">
              ✨ Free forever • 🚀 Instant results • 🎯 Personalized projects
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
