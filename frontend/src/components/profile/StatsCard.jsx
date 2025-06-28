import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  color = 'primary', 
  trend = null, 
  trendValue = null,
  className = '',
  onClick = null
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20',
      border: 'border-primary-200 dark:border-primary-800',
      icon: 'text-primary-600 dark:text-primary-400',
      value: 'text-primary-900 dark:text-primary-100',
      title: 'text-primary-700 dark:text-primary-300'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      value: 'text-green-900 dark:text-green-100',
      title: 'text-green-700 dark:text-green-300'
    },
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      value: 'text-blue-900 dark:text-blue-100',
      title: 'text-blue-700 dark:text-blue-300'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'text-orange-600 dark:text-orange-400',
      value: 'text-orange-900 dark:text-orange-100',
      title: 'text-orange-700 dark:text-orange-300'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'text-purple-600 dark:text-purple-400',
      value: 'text-purple-900 dark:text-purple-100',
      title: 'text-purple-700 dark:text-purple-300'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      value: 'text-red-900 dark:text-red-100',
      title: 'text-red-700 dark:text-red-300'
    }
  };

  const colors = colorClasses[color] || colorClasses.primary;

  const getTrendIcon = () => {
    if (trend === 'up') return TrendingUp;
    if (trend === 'down') return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 dark:text-green-400';
    if (trend === 'down') return 'text-red-600 dark:text-red-400';
    return 'text-gray-500 dark:text-gray-400';
  };

  const TrendIcon = getTrendIcon();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: onClick ? 1.02 : 1, y: -2 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl border p-6 transition-all duration-300
        ${colors.bg} ${colors.border}
        ${onClick ? 'cursor-pointer hover:shadow-lg' : ''}
        ${className}
      `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative">
        <div className="flex items-start justify-between">
          {/* Icon */}
          <div className={`p-3 rounded-lg ${colors.icon} bg-white/50 dark:bg-black/20`}>
            <Icon className="h-6 w-6" />
          </div>

          {/* Trend Indicator */}
          {trend && trendValue && (
            <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
              <TrendIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mt-4">
          <div className={`text-3xl font-bold ${colors.value}`}>
            {value}
          </div>
          
          {/* Title */}
          <div className={`text-sm font-medium mt-1 ${colors.title}`}>
            {title}
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      {onClick && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      )}
    </motion.div>
  );
};

export default StatsCard;
