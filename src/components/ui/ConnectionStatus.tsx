'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Wifi, WifiOff, Activity, AlertCircle } from 'lucide-react';

interface ConnectionStatusProps {
  className?: string;
}

export default function ConnectionStatus({ className = '' }: ConnectionStatusProps) {
  const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected' | 'error'>('connecting');
  const [latency, setLatency] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    // Simulate connection status
    const interval = setInterval(() => {
      // Simulate occasional connection issues
      const random = Math.random();
      if (random > 0.95) {
        setStatus('error');
        setTimeout(() => setStatus('connected'), 2000);
      } else if (random > 0.9) {
        setStatus('connecting');
        setTimeout(() => setStatus('connected'), 1000);
      } else {
        setStatus('connected');
      }

      // Update latency and timestamp
      setLatency(15 + Math.random() * 10);
      setLastUpdate(new Date());
    }, 3000);

    // Initial connection
    setTimeout(() => setStatus('connected'), 1000);

    return () => clearInterval(interval);
  }, []);

  const getStatusConfig = () => {
    switch (status) {
      case 'connected':
        return {
          icon: Wifi,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Connected',
          description: `${latency.toFixed(1)}ms`,
        };
      case 'connecting':
        return {
          icon: Activity,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          label: 'Connecting',
          description: 'Establishing connection...',
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Connection Error',
          description: 'Retrying...',
        };
      case 'disconnected':
      default:
        return {
          icon: WifiOff,
          color: 'text-slate-600',
          bgColor: 'bg-slate-50',
          borderColor: 'border-slate-200',
          label: 'Disconnected',
          description: 'No connection',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`card border ${config.borderColor} ${config.bgColor} p-3 ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Icon className={`w-5 h-5 ${config.color}`} />
          {status === 'connected' && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
            />
          )}
          {status === 'connecting' && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-1 -right-1 w-2 h-2 border border-amber-500 border-t-transparent rounded-full"
            />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className={`text-mono text-sm font-medium ${config.color}`}>
            {config.label}
          </div>
          <div className="text-mono text-xs text-slate-500">
            {config.description}
          </div>
        </div>
        
        {status === 'connected' && (
          <div className="text-right">
            <div className="text-mono text-xs text-slate-500">
              Last update
            </div>
            <div className="text-mono text-xs font-medium text-slate-700">
              {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// Compact version for header
export function CompactConnectionStatus({ className = '' }: { className?: string }) {
  const [status, setStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.95) {
        setStatus('disconnected');
        setTimeout(() => setStatus('connected'), 1000);
      } else {
        setStatus('connected');
      }
    }, 5000);

    setTimeout(() => setStatus('connected'), 1000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-amber-600';
      case 'disconnected': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected': return Wifi;
      case 'connecting': return Activity;
      case 'disconnected': return WifiOff;
      default: return WifiOff;
    }
  };

  const Icon = getStatusIcon();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Icon className={`w-4 h-4 ${getStatusColor()}`} />
        {status === 'connected' && (
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-green-500 rounded-full"
          />
        )}
      </div>
      <span className={`text-mono text-xs font-medium ${getStatusColor()}`}>
        {status === 'connected' ? 'Live' : status === 'connecting' ? 'Connecting' : 'Offline'}
      </span>
    </div>
  );
}