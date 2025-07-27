'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Loader2, Globe, BarChart3, Database, Wifi, WifiOff } from 'lucide-react';

// Generic loading spinner
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]} ${className}`} />
  );
}

// Full page loading
export function PageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mb-6"
        >
          <Globe className="w-16 h-16 text-blue-600 mx-auto" />
        </motion.div>
        
        <h2 className="text-display text-2xl font-bold text-slate-900 mb-2">
          Loading GoQuant
        </h2>
        <p className="text-mono text-slate-600">
          Initializing latency visualization...
        </p>
        
        <div className="mt-6 flex justify-center">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 bg-blue-600 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Globe loading
export function GlobeLoading() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="mb-4"
        >
          <Globe className="w-12 h-12 text-blue-600 mx-auto" />
        </motion.div>
        
        <h3 className="text-display text-lg font-bold text-slate-900 mb-2">
          Loading 3D Globe
        </h3>
        <p className="text-mono text-sm text-slate-600">
          Rendering exchange network...
        </p>
        
        <div className="mt-4 w-48 mx-auto">
          <div className="bg-slate-200 rounded-full h-2">
            <motion.div
              animate={{ width: ['0%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Chart loading
export function ChartLoading() {
  return (
    <div className="h-64 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="mb-3"
        >
          <BarChart3 className="w-8 h-8 text-blue-600 mx-auto" />
        </motion.div>
        
        <h3 className="text-display text-base font-bold text-slate-900 mb-1">
          Loading Chart
        </h3>
        <p className="text-mono text-xs text-slate-600">
          Processing data...
        </p>
      </div>
    </div>
  );
}

// Data loading
export function DataLoading({ message = 'Loading data...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <motion.div
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="mb-3"
        >
          <Database className="w-6 h-6 text-blue-600 mx-auto" />
        </motion.div>
        
        <p className="text-mono text-sm text-slate-600">{message}</p>
      </div>
    </div>
  );
}

// Connection status
export function ConnectionStatus({ isConnected, isConnecting }: { isConnected: boolean; isConnecting?: boolean }) {
  if (isConnecting) {
    return (
      <div className="flex items-center gap-2 text-amber-600">
        <LoadingSpinner size="sm" />
        <span className="text-mono text-xs">Connecting...</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
      {isConnected ? (
        <Wifi className="w-4 h-4" />
      ) : (
        <WifiOff className="w-4 h-4" />
      )}
      <span className="text-mono text-xs">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
    </div>
  );
}

// Skeleton loaders
export function SkeletonCard() {
  return (
    <div className="card bg-white/90 p-6 animate-pulse">
      <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
      <div className="h-3 bg-slate-200 rounded w-1/2 mb-2"></div>
      <div className="h-3 bg-slate-200 rounded w-2/3"></div>
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="h-64 bg-slate-100 rounded-lg animate-pulse flex items-end justify-center p-4">
      <div className="flex items-end space-x-2 h-full w-full max-w-sm">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bg-slate-200 rounded-t flex-1"
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function SkeletonTable() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-200 rounded"></div>
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, j) => (
            <div key={j} className="h-3 bg-slate-100 rounded"></div>
          ))}
        </div>
      ))}
    </div>
  );
}

// WebGL compatibility check
export function WebGLCheck({ children }: { children: React.ReactNode }) {
  const [isWebGLSupported, setIsWebGLSupported] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsWebGLSupported(!!gl);
    } catch {
      setIsWebGLSupported(false);
    }
  }, []);

  if (isWebGLSupported === null) {
    return <GlobeLoading />;
  }

  if (!isWebGLSupported) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center p-8">
          <div className="p-4 bg-amber-100 rounded-full w-fit mx-auto mb-4">
            <Globe className="w-8 h-8 text-amber-600" />
          </div>
          
          <h3 className="text-display text-lg font-bold text-slate-900 mb-2">
            WebGL Not Supported
          </h3>
          <p className="text-mono text-sm text-slate-600 mb-4 max-w-md">
            Your browser doesn&apos;t support WebGL, which is required for 3D visualization. 
            Please try using a modern browser like Chrome, Firefox, or Safari.
          </p>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-mono font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Network error component
export function NetworkError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="text-center p-8">
      <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-4">
        <WifiOff className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-display text-lg font-bold text-slate-900 mb-2">
        Connection Error
      </h3>
      <p className="text-mono text-sm text-slate-600 mb-4">
        Unable to connect to the server. Please check your internet connection.
      </p>
      
      <button
        onClick={onRetry}
        className="px-4 py-2 text-mono font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}