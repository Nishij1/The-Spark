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
                  className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors duration-200"
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
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20 transition-colors duration-200"
                >
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden border-t border-gray-200/30 dark:border-gray-700/30"
            >
              <div className="px-4 py-2 space-y-1">
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
                        "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                        isActive
                          ? "bg-primary-100/30 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                          : "text-gray-700 dark:text-gray-300 hover:bg-white/20 dark:hover:bg-gray-800/20"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

export default TubelightNavbarComplete 