'use client';

import { useState, useEffect, useCallback } from 'react';
import { PerformanceMetrics } from '@/types';
import { PERFORMANCE, UPDATE_INTERVALS } from '@/utils/constants';

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memoryUsage: 0,
    renderTime: 0,
    lastUpdate: new Date(),
  });

  const [isLowPerformance, setIsLowPerformance] = useState(false);

  // Monitor FPS from custom events
  useEffect(() => {
    const handleFPSUpdate = (event: CustomEvent) => {
      const { fps, timestamp } = event.detail;
      
      setMetrics(prev => ({
        ...prev,
        fps,
        lastUpdate: timestamp,
      }));

      // Check if performance is below threshold
      const targetFPS = window.innerWidth < 768 
        ? PERFORMANCE.TARGET_FPS.MOBILE 
        : PERFORMANCE.TARGET_FPS.DESKTOP;
      
      setIsLowPerformance(fps < targetFPS * 0.7); // 70% of target FPS
    };

    window.addEventListener('fps-update', handleFPSUpdate as EventListener);
    
    return () => {
      window.removeEventListener('fps-update', handleFPSUpdate as EventListener);
    };
  }, []);

  // Monitor memory usage
  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as Performance & { memory?: { usedJSHeapSize: number } }).memory;
        const usedMB = memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 0;
        
        setMetrics(prev => ({
          ...prev,
          memoryUsage: usedMB,
        }));
      }
    };

    const interval = setInterval(updateMemoryUsage, UPDATE_INTERVALS.PERFORMANCE_METRICS);
    updateMemoryUsage(); // Initial call

    return () => clearInterval(interval);
  }, []);

  // Monitor render time
  const measureRenderTime = useCallback((renderFunction: () => void) => {
    const startTime = performance.now();
    renderFunction();
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    setMetrics(prev => ({
      ...prev,
      renderTime: Math.round(renderTime * 100) / 100,
    }));
  }, []);

  // Get performance status
  const getPerformanceStatus = useCallback(() => {
    const targetFPS = window.innerWidth < 768 
      ? PERFORMANCE.TARGET_FPS.MOBILE 
      : PERFORMANCE.TARGET_FPS.DESKTOP;

    if (metrics.fps >= targetFPS * 0.9) return 'excellent';
    if (metrics.fps >= targetFPS * 0.7) return 'good';
    if (metrics.fps >= targetFPS * 0.5) return 'fair';
    return 'poor';
  }, [metrics.fps]);

  // Get performance recommendations
  const getRecommendations = useCallback(() => {
    const recommendations: string[] = [];
    
    if (metrics.fps < 30) {
      recommendations.push('Consider reducing visual effects');
      recommendations.push('Lower the number of visible connections');
    }
    
    if (metrics.memoryUsage > PERFORMANCE.MAX_MEMORY_MB * 0.8) {
      recommendations.push('High memory usage detected');
      recommendations.push('Consider refreshing the page');
    }
    
    if (metrics.renderTime > 16.67) { // 60fps = 16.67ms per frame
      recommendations.push('Render time is high');
      recommendations.push('Disable animations for better performance');
    }

    return recommendations;
  }, [metrics]);

  return {
    metrics,
    isLowPerformance,
    measureRenderTime,
    getPerformanceStatus,
    getRecommendations,
  };
};