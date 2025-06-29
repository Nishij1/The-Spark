import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link, useLocation } from "react-router-dom"
import { Sun, Moon, Zap, LogOut, LogIn, Menu, X, Home, LayoutDashboard, FolderOpen, Sparkles, User } from "lucide-react"
import { cn } from "../../lib/utils"
import { useTheme } from "../../context/ThemeContext"
import { useAuth } from "../../context/AuthContext"

const TubelightNavbarComplete = ({ className }) => {
  const [activeTab, setActiveTab] = useState('Home')
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const { currentUser, logout } = useAuth()
  const isAuthenticated = !!currentUser

  // Hard coded navigation items - always visible
  const navigation = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', url: '/projects', icon: FolderOpen },
    { name: 'Generate', url: '/generate', icon: Sparkles },
    { name: 'Profile', url: '/profile', icon: User },
  ]

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Scroll handler for navbar visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide navbar
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Update active tab based on current location
  useEffect(() => {
    const currentItem = navigation.find(item => item.url === location.pathname)
    if (currentItem) {
      setActiveTab(currentItem.name)
    }
  }, [location.pathname, navigation])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.3
          }}
          className={cn("fixed top-0 left-0 right-0 z-50 mt-4", className)}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="p-2 bg-gradient-to-r from-violet-800 to-zinc-50 rounded-lg"
                >
                  <Zap className="h-6 w-6 text-white" />
                </motion.div>
                 <span className="text-xl font-bold bg-gradient-to-r  from-violet-600 to-violet-600  bg-clip-text text-transparent">
                  Project Spark
                </span>
              </Link>

              {/* Desktop Tubelight Navigation */}
              <div className="hidden md:flex items-center">
                <div className="flex items-center gap-3 border border-gray-200/30 dark:border-gray-700/30 py-1 px-1 rounded-full shadow-lg">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.name

                    return (
                      <Link
                        key={item.name}
                        to={item.url}
                        onClick={() => setActiveTab(item.name)}
                        className={cn(
                          "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                          "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:tepurple-400",
                          isActive && "bg-gray-100 dark:bg-gray-800 text-purple-600 dark:text-purple-400",
                        )}
                      >
                        <span className="flex items-center space-x-1">
                          <Icon size={16} strokeWidth={2.5} />
                          <span>{item.name}</span>
                        </span>
                        {isActive && (
                          <motion.div
                            layoutId="lamp"
                            className="absolute inset-0 w-full bg-purple-500/5 rounded-full -z-10"
                            initial={false}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 30,
                            }}
                          >
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-purple-500 rounded-t-full">
                              <div className="absolute w-12 h-6 bg-purple-500/20 rounded-full blur-md -top-2 -left-2" />
                              <div className="absolute w-8 h-6 bg-purple-500/20 rounded-full blur-md -top-1" />
                              <div className="absolute w-4 h-4 bg-purple-500/20 rounded-full blur-sm top-0 left-2" />
                            </div>
                          </motion.div>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Right side actions */}
              <div className="flex items-center space-x-4">
                {/* Theme toggle */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleTheme}
                  className="hidden sm:block p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors duration-200"
                >
                  {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </motion.button>

                {/* Auth buttons */}
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3 ">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={logout}
                      className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors duration-200"
                    >
                      <LogOut className="h-5 w-5" />
                    </motion.button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                )}

                {/* Mobile menu button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    backgroundColor: isOpen ? 'rgba(147, 51, 234, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    borderColor: isOpen ? 'rgba(147, 51, 234, 0.3)' : 'rgba(255, 255, 255, 0.2)'
                  }}
                  onClick={() => setIsOpen(!isOpen)}
                  className={cn(
                    "md:hidden p-3 rounded-xl backdrop-blur-sm transition-all duration-200 shadow-lg",
                    isOpen
                      ? "bg-purple-500/20 dark:bg-purple-400/20 border-purple-300/50 dark:border-purple-600/50 text-purple-700 dark:text-purple-300"
                      : "bg-white/10 dark:bg-gray-800/50 border-white/20 dark:border-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-700/70"
                  )}
                >
                  <motion.div
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </motion.div>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 md:hidden"
              />

              {/* Menu content */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative z-50 md:hidden border-t border-gray-200/30 dark:border-gray-700/30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-xl"
              >
              <div className="px-4 py-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.name
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.url}
                      onClick={() => {
                        setIsOpen(false)
                        setActiveTab(item.name)
                      }}
                      className={cn(
                        "flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 shadow-sm",
                        isActive
                          ? "bg-gradient-to-r from-purple-500/20 to-violet-500/20 dark:from-purple-400/20 dark:to-violet-400/20 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-200/80 dark:hover:from-gray-800/80 dark:hover:to-gray-700/80 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}

                {/* Mobile-only actions */}
                <div className="pt-4 mt-4 border-t border-gray-200/30 dark:border-gray-700/30 space-y-2">
                  {/* Theme toggle for mobile */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={toggleTheme}
                    className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 shadow-sm text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-gray-100/80 hover:to-gray-200/80 dark:hover:from-gray-800/80 dark:hover:to-gray-700/80 border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50"
                  >
                    {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
                  </motion.button>

                  {/* Auth button for mobile */}
                  {isAuthenticated ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        logout()
                        setIsOpen(false)
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 shadow-sm text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50/80 hover:to-red-100/80 dark:hover:from-red-900/20 dark:hover:to-red-800/20 border border-transparent hover:border-red-200/50 dark:hover:border-red-700/50"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Logout</span>
                    </motion.button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 shadow-sm bg-gradient-to-r from-purple-500/20 to-violet-500/20 dark:from-purple-400/20 dark:to-violet-400/20 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50"
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Login</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
            </>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

export default TubelightNavbarComplete 