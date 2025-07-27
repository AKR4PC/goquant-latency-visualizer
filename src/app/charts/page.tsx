'use client';

import React, { useState, useEffect } from 'react';
import LatencyChart from '@/components/charts/LatencyChart';
import { StatsDashboard } from '@/components/charts/StatsDashboard';
import PerformanceMetrics from '@/components/charts/PerformanceMetrics';
import LatencyHeatmap from '@/components/charts/LatencyHeatmap';
import { EXCHANGES, CLOUD_REGIONS } from '@/data';
import {
  generateCurrentLatencyData,
  generateHistoricalLatencyData,
} from '@/services/latencyService';
import { LatencyData, HistoricalLatencyData, TimeRange } from '@/types';
import {
  ArrowLeft,
  BarChart3,
  TrendingUp,
  Gauge,
  Map,
  Bell,
  Settings,
  Download,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from '@/hooks/useTheme';
import { CompactThemeSwitcher } from '@/components/ui/ThemeSwitcher';

export default function ChartsPage() {
  const { theme: currentTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<
    'latency' | 'stats' | 'performance' | 'heatmap'
  >('latency');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalLatencyData[]>(
    []
  );
  const [notifications, setNotifications] = useState(3);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Generate initial data
    const initialData = generateCurrentLatencyData(EXCHANGES, CLOUD_REGIONS);
    setLatencyData(initialData);

    const exchangePairs = EXCHANGES.slice(0, 8).map(
      (e, i) => `${e.id}-${EXCHANGES[(i + 1) % EXCHANGES.length].id}`
    );
    const historical = generateHistoricalLatencyData(exchangePairs, timeRange);
    setHistoricalData(historical);
  }, [timeRange]);

  const tabs = [
    { id: 'latency', label: 'Latency Trends', icon: TrendingUp },
    { id: 'heatmap', label: 'Heatmap', icon: Map },
    { id: 'stats', label: 'Network Stats', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: Gauge },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Regenerate data
    const newData = generateCurrentLatencyData(EXCHANGES, CLOUD_REGIONS);
    setLatencyData(newData);

    const exchangePairs = EXCHANGES.slice(0, 8).map(
      (e, i) => `${e.id}-${EXCHANGES[(i + 1) % EXCHANGES.length].id}`
    );
    const newHistorical = generateHistoricalLatencyData(
      exchangePairs,
      timeRange
    );
    setHistoricalData(newHistorical);

    setIsRefreshing(false);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        currentTheme === 'dark'
          ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900'
          : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
      }`}
    >
      {/* Header */}
      <header
        className={`glass border-b sticky top-0 z-50 backdrop-blur-xl ${
          currentTheme === 'dark'
            ? 'border-slate-700/50 bg-slate-800/80'
            : 'border-slate-200/50 bg-white/80'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <Link
                href="/"
                className={`p-2 sm:p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  currentTheme === 'dark'
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <div>
                <h1
                  className={`text-display text-lg sm:text-2xl font-bold ${
                    currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  Analytics Dashboard
                </h1>
                <p
                  className={`text-mono text-sm sm:text-base ${
                    currentTheme === 'dark'
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  Real-time latency monitoring and performance insights
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`p-2 sm:p-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                  currentTheme === 'dark'
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
                title="Refresh Data"
              >
                <RefreshCw
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${isRefreshing ? 'animate-spin' : ''}`}
                />
              </button>

              <button
                className={`p-2 sm:p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  currentTheme === 'dark'
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
                title="Export Data"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                className={`p-2 sm:p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  currentTheme === 'dark'
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
                title="Settings"
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <button
                onClick={() => setNotifications(0)}
                className={`relative p-2 sm:p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  currentTheme === 'dark'
                    ? 'hover:bg-slate-700 text-slate-300'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
                title="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </button>

              <CompactThemeSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div
          className={`card-elevated p-2 backdrop-blur-sm w-full sm:w-fit shadow-xl border overflow-x-auto ${
            currentTheme === 'dark'
              ? 'bg-slate-800/95 border-slate-700/50'
              : 'bg-white/95 border-slate-200/50'
          }`}
        >
          <div className="flex rounded-xl overflow-hidden min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-8 py-3 sm:py-4 text-mono font-medium transition-all duration-300 relative group whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                      : currentTheme === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-slate-700/80'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                      activeTab === tab.id
                        ? 'scale-110'
                        : 'group-hover:scale-105'
                    }`}
                  />
                  <span className="text-sm sm:text-base">{tab.label}</span>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <div className="animate-in fade-in duration-500">
          {activeTab === 'latency' && (
            <div
              className={`card-elevated backdrop-blur-sm p-4 sm:p-6 lg:p-8 shadow-xl border ${
                currentTheme === 'dark'
                  ? 'bg-slate-800/95 border-slate-700/50'
                  : 'bg-white/95 border-slate-200/50'
              }`}
            >
              <div className="mb-6 sm:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                  <div>
                    <h2
                      className={`text-display text-2xl sm:text-3xl font-bold mb-2 ${
                        currentTheme === 'dark'
                          ? 'text-white'
                          : 'text-slate-900'
                      }`}
                    >
                      Latency Trends
                    </h2>
                    <p
                      className={`text-mono text-base sm:text-lg ${
                        currentTheme === 'dark'
                          ? 'text-slate-300'
                          : 'text-slate-600'
                      }`}
                    >
                      Historical performance data and real-time insights
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-lg border ${
                        currentTheme === 'dark'
                          ? 'bg-green-900/30 border-green-700/50'
                          : 'bg-green-50 border-green-200'
                      }`}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span
                        className={`text-sm font-medium ${
                          currentTheme === 'dark'
                            ? 'text-green-400'
                            : 'text-green-700'
                        }`}
                      >
                        Live Data
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full w-16 sm:w-24"></div>
              </div>
              <LatencyChart
                data={historicalData}
                timeRange={timeRange}
                selectedPairs={[]}
                onTimeRangeChange={setTimeRange}
              />
            </div>
          )}

          {activeTab === 'heatmap' && (
            <div className="animate-in slide-in-from-right duration-300">
              <LatencyHeatmap exchanges={EXCHANGES} latencyData={latencyData} />
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="card-elevated bg-white/95 backdrop-blur-sm p-8 shadow-xl border border-slate-200/50 animate-in slide-in-from-left duration-300">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-display text-3xl font-bold text-slate-900 mb-2">
                      Network Statistics
                    </h2>
                    <p className="text-mono text-slate-600 text-lg">
                      Comprehensive network performance overview
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700 text-sm font-medium">
                        Analytics
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full w-24"></div>
              </div>
              <StatsDashboard />
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="card-elevated bg-white/95 backdrop-blur-sm p-8 shadow-xl border border-slate-200/50 animate-in slide-in-from-bottom duration-300">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-display text-3xl font-bold text-slate-900 mb-2">
                      System Performance
                    </h2>
                    <p className="text-mono text-slate-600 text-lg">
                      Real-time monitoring and system diagnostics
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-2 px-4 py-2 bg-orange-50 rounded-lg border border-orange-200">
                      <Gauge className="w-4 h-4 text-orange-600" />
                      <span className="text-orange-700 text-sm font-medium">
                        Monitoring
                      </span>
                    </div>
                  </div>
                </div>
                <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full w-24"></div>
              </div>
              <PerformanceMetrics
                fps={58 + Math.random() * 4}
                memoryUsage={145 + Math.random() * 20}
                renderTime={14 + Math.random() * 4}
                lastUpdate={new Date()}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
