'use client';

import React, { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { Monitor, Cpu, MemoryStick, Gauge, AlertTriangle, CheckCircle } from 'lucide-react';

interface PerformanceMetricsProps {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  lastUpdate: Date;
}

export default function PerformanceMetrics({
  fps,
  memoryUsage,
  renderTime,
  lastUpdate,
}: PerformanceMetricsProps) {
  const [performanceHistory, setPerformanceHistory] = useState<Array<{
    timestamp: string;
    fps: number;
    memory: number;
    renderTime: number;
  }>>([]);

  // Update performance history
  useEffect(() => {
    const newEntry = {
      timestamp: lastUpdate.toLocaleTimeString(),
      fps: Math.round(fps),
      memory: Math.round(memoryUsage),
      renderTime: Math.round(renderTime),
    };

    setPerformanceHistory(prev => {
      const updated = [...prev, newEntry];
      // Keep only last 20 entries
      return updated.slice(-20);
    });
  }, [fps, memoryUsage, renderTime, lastUpdate]);

  // Performance status
  const getPerformanceStatus = () => {
    if (fps < 30) return { status: 'poor', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20' };
    if (fps < 50) return { status: 'fair', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/20' };
    return { status: 'good', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' };
  };

  const getMemoryStatus = () => {
    if (memoryUsage > 400) return { status: 'high', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20' };
    if (memoryUsage > 250) return { status: 'medium', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/20' };
    return { status: 'low', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' };
  };

  const getRenderStatus = () => {
    if (renderTime > 20) return { status: 'slow', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-900/20' };
    if (renderTime > 16) return { status: 'fair', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-900/20' };
    return { status: 'fast', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' };
  };

  const performanceStatus = getPerformanceStatus();
  const memoryStatus = getMemoryStatus();
  const renderStatus = getRenderStatus();

  const getRecommendations = () => {
    const recommendations = [];
    
    if (fps < 30) {
      recommendations.push('Consider reducing visual effects or lowering quality settings');
    }
    if (memoryUsage > 400) {
      recommendations.push('High memory usage detected - consider closing other applications');
    }
    if (renderTime > 20) {
      recommendations.push('Slow render times - try reducing the number of visible connections');
    }
    if (recommendations.length === 0) {
      recommendations.push('Performance is optimal');
    }
    
    return recommendations;
  };

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number; dataKey: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass border border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-4 rounded-xl shadow-xl">
          <p className="font-semibold text-slate-900 dark:text-white text-sm mb-2">{`Time: ${label}`}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}${
                entry.dataKey === 'fps' ? ' FPS' :
                entry.dataKey === 'memory' ? ' MB' :
                entry.dataKey === 'renderTime' ? ' ms' : ''
              }`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left">
        <h2 className="text-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
          System Performance
        </h2>
        <p className="text-mono text-slate-600 dark:text-slate-300 text-base sm:text-lg">
          Real-time monitoring and system diagnostics
        </p>
        <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full w-16 sm:w-24 mx-auto sm:mx-0 mt-3"></div>
      </div>

      {/* Current Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* FPS */}
        <div className="card-elevated bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Gauge className={`w-5 h-5 ${performanceStatus.color}`} />
                <span className="text-mono text-sm font-medium text-slate-600 dark:text-slate-400">FPS</span>
              </div>
              <div className={`text-3xl font-bold ${performanceStatus.color} mb-1`}>
                {Math.round(fps)}
              </div>
              <div className={`text-mono text-sm ${performanceStatus.color} capitalize`}>
                {performanceStatus.status}
              </div>
            </div>
            <div className={`p-3 rounded-xl ${performanceStatus.bgColor}`}>
              {performanceStatus.status === 'good' ? (
                <CheckCircle className={`w-6 h-6 ${performanceStatus.color}`} />
              ) : (
                <AlertTriangle className={`w-6 h-6 ${performanceStatus.color}`} />
              )}
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="card-elevated bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MemoryStick className={`w-5 h-5 ${memoryStatus.color}`} />
                <span className="text-mono text-sm font-medium text-slate-600 dark:text-slate-400">Memory</span>
              </div>
              <div className={`text-3xl font-bold ${memoryStatus.color} mb-1`}>
                {Math.round(memoryUsage)}
              </div>
              <div className={`text-mono text-sm ${memoryStatus.color}`}>
                MB
              </div>
            </div>
            <div className={`p-3 rounded-xl ${memoryStatus.bgColor}`}>
              {memoryStatus.status === 'low' ? (
                <CheckCircle className={`w-6 h-6 ${memoryStatus.color}`} />
              ) : (
                <AlertTriangle className={`w-6 h-6 ${memoryStatus.color}`} />
              )}
            </div>
          </div>
        </div>

        {/* Render Time */}
        <div className="card-elevated bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Cpu className={`w-5 h-5 ${renderStatus.color}`} />
                <span className="text-mono text-sm font-medium text-slate-600 dark:text-slate-400">Render Time</span>
              </div>
              <div className={`text-3xl font-bold ${renderStatus.color} mb-1`}>
                {Math.round(renderTime)}
              </div>
              <div className={`text-mono text-sm ${renderStatus.color}`}>
                ms
              </div>
            </div>
            <div className={`p-3 rounded-xl ${renderStatus.bgColor}`}>
              {renderStatus.status === 'fast' ? (
                <CheckCircle className={`w-6 h-6 ${renderStatus.color}`} />
              ) : (
                <AlertTriangle className={`w-6 h-6 ${renderStatus.color}`} />
              )}
            </div>
          </div>
        </div>

        {/* Last Update */}
        <div className="card-elevated bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="w-5 h-5 text-blue-600" />
                <span className="text-mono text-sm font-medium text-slate-600 dark:text-slate-400">Last Update</span>
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {lastUpdate.toLocaleTimeString()}
              </div>
              <div className="text-mono text-sm text-slate-500 dark:text-slate-400">
                {lastUpdate.toLocaleDateString()}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FPS Chart */}
        <div className="card-elevated bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 border border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-display text-lg font-semibold text-slate-900 dark:text-white mb-4">
            FPS Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="opacity-30" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                label={{ value: 'FPS', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b' } }}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
                domain={[0, 70]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="fps"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#3b82f6' }}
                name="FPS"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Memory Usage Chart */}
        <div className="card-elevated bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 border border-slate-200/50 dark:border-slate-700/50">
          <h3 className="text-display text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Memory Usage Over Time
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={performanceHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="opacity-30" />
              <XAxis 
                dataKey="timestamp" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              <YAxis 
                label={{ value: 'Memory (MB)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b' } }}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#cbd5e1' }}
                tickLine={{ stroke: '#cbd5e1' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="memory"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.2}
                strokeWidth={3}
                name="Memory"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Render Time Chart */}
      <div className="card-elevated bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 border border-slate-200/50 dark:border-slate-700/50">
        <h3 className="text-display text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Render Time Over Time
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={performanceHistory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="opacity-30" />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis 
              label={{ value: 'Render Time (ms)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#64748b' } }}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={{ stroke: '#cbd5e1' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="renderTime"
              stroke="#f59e0b"
              strokeWidth={3}
              dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#f59e0b' }}
              name="Render Time"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recommendations */}
      <div className="card-elevated bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 border border-slate-200/50 dark:border-slate-700/50">
        <h3 className="text-display text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Performance Recommendations
        </h3>
        <div className="space-y-3">
          {getRecommendations().map((recommendation, index) => (
            <div key={index} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200/50 dark:border-slate-600/50">
              {recommendation.includes('optimal') ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              )}
              <span className="text-mono text-slate-700 dark:text-slate-300">{recommendation}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}