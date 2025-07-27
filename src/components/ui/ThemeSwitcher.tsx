'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeSwitcherProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function ThemeSwitcher({ className = '', size = 'md' }: ThemeSwitcherProps) {
  const { theme, toggleTheme, isLoading } = useTheme();

  const sizeClasses = {
    sm: 'w-12 h-6',
    md: 'w-14 h-7',
    lg: 'w-16 h-8',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (isLoading) {
    return (
      <div className={`${sizeClasses[size]} bg-slate-200 rounded-full animate-pulse ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`relative ${sizeClasses[size]} rounded-full p-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        theme === 'dark'
          ? 'bg-slate-700 hover:bg-slate-600'
          : 'bg-slate-200 hover:bg-slate-300'
      } ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {/* Track */}
      <div className="absolute inset-0 rounded-full" />
      
      {/* Slider */}
      <motion.div
        animate={{
          x: theme === 'dark' ? '100%' : '0%',
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
        className={`relative ${
          size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
        } rounded-full shadow-md flex items-center justify-center transform -translate-x-full ${
          theme === 'dark'
            ? 'bg-slate-900 text-yellow-400'
            : 'bg-white text-orange-500'
        }`}
      >
        {theme === 'dark' ? (
          <Moon className={iconSizes[size]} />
        ) : (
          <Sun className={iconSizes[size]} />
        )}
      </motion.div>
    </button>
  );
}

// Compact version for toolbar
export function CompactThemeSwitcher({ className = '' }: { className?: string }) {
  const { theme, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className={`w-10 h-10 bg-slate-200 rounded-lg animate-pulse ${className}`} />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        theme === 'dark'
          ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700'
          : 'bg-white text-slate-600 hover:bg-slate-50 shadow-sm border border-slate-200'
      } ${className}`}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5" />
        ) : (
          <Sun className="w-5 h-5" />
        )}
      </motion.div>
    </button>
  );
}