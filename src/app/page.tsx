'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SimpleGlobe from '@/components/3d/SimpleGlobe';

import LatencyChart from '@/components/charts/LatencyChart';
import PerformanceMetrics from '@/components/charts/PerformanceMetrics';
import { Exchange, CloudRegion, LatencyData, HistoricalLatencyData, CloudProvider, TimeRange } from '@/types';
import { EXCHANGES, CLOUD_REGIONS } from '@/data';
import { generateCurrentLatencyData, generateHistoricalLatencyData, LatencyDataStream } from '@/services/latencyService';
import { BarChart3, Globe, TrendingUp, Download } from 'lucide-react';
import ExportDialog from '@/components/ui/ExportDialog';
import { GlobeErrorBoundary, ChartErrorBoundary } from '@/components/ui/ErrorBoundary';
import { GlobeLoading, ChartLoading, WebGLCheck } from '@/components/ui/LoadingStates';
import { useNotificationHelpers } from '@/components/ui/NotificationSystem';
import { CompactThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import AdvancedFilters from '@/components/ui/AdvancedFilters';
import { CompactConnectionStatus } from '@/components/ui/ConnectionStatus';
import NotificationCenter from '@/components/ui/NotificationCenter';
import { useTheme } from '@/hooks/useTheme';

export default function Home() {
  // State management
  const [exchanges] = useState<Exchange[]>(EXCHANGES);
  const [cloudRegions] = useState<CloudRegion[]>(CLOUD_REGIONS);
  const [latencyData, setLatencyData] = useState<LatencyData[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalLatencyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Notifications and theme
  const { showSuccess, showError } = useNotificationHelpers();
  const { theme: currentTheme } = useTheme();
  
  // UI State
  const [selectedExchanges, setSelectedExchanges] = useState<string[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<CloudProvider[]>(['AWS', 'GCP', 'Azure']);
  const [latencyRange, setLatencyRange] = useState<[number, number]>([0, 1000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRegions, setShowRegions] = useState(true);
  const [showConnections, setShowConnections] = useState(true);
  const [animationsEnabled] = useState(true);

  const [currentView, setCurrentView] = useState<'globe' | 'charts' | 'performance'>('globe');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [showExportDialog, setShowExportDialog] = useState(false);
  
  // Performance metrics
  const [performanceMetrics, setPerformanceMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    lastUpdate: new Date(),
  });

  // Initialize data stream
  const [dataStream] = useState(() => new LatencyDataStream(exchanges, cloudRegions));

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setIsLoading(true);
        
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate initial latency data
        const initialData = generateCurrentLatencyData(exchanges, cloudRegions);
        setLatencyData(initialData);

        // Generate historical data
        const exchangePairs = exchanges.slice(0, 5).map((e, i) => 
          `${e.id}-${exchanges[(i + 1) % exchanges.length].id}`
        );
        const historical = generateHistoricalLatencyData(exchangePairs, timeRange);
        setHistoricalData(historical);

        // Subscribe to real-time updates
        const unsubscribe = dataStream.subscribe((newData) => {
          setLatencyData(newData);
          setPerformanceMetrics(() => ({
            fps: 60,
            memoryUsage: 0,
            renderTime: 0,
            lastUpdate: new Date(),
          }));
        });

        setIsLoading(false);
        showSuccess('Data Loaded', 'Successfully connected to exchange network');

        return unsubscribe;
      } catch (error) {
        setIsLoading(false);
        showError('Loading Failed', 'Unable to initialize data. Using cached data.');
        console.error('Data initialization error:', error);
      }
    };

    initializeData();
  }, [exchanges, cloudRegions, dataStream, timeRange, showSuccess, showError]);

  // Performance monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate performance metrics
      setPerformanceMetrics(() => ({
        fps: 55 + Math.random() * 10,
        memoryUsage: 150 + Math.random() * 50,
        renderTime: 12 + Math.random() * 8,
        lastUpdate: new Date(),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Event handlers
  const handleExchangeToggle = useCallback((exchangeId: string) => {
    setSelectedExchanges(prev => 
      prev.includes(exchangeId)
        ? prev.filter(id => id !== exchangeId)
        : [...prev, exchangeId]
    );
  }, []);

  const handleProviderToggle = useCallback((provider: CloudProvider) => {
    setSelectedProviders(prev =>
      prev.includes(provider)
        ? prev.filter(p => p !== provider)
        : [...prev, provider]
    );
  }, []);

  const handleExchangeClick = useCallback((exchange: Exchange) => {
    setSelectedExchanges(prev => 
      prev.includes(exchange.id) 
        ? prev.filter(id => id !== exchange.id)
        : [...prev, exchange.id]
    );
  }, []);

  const handleRegionClick = useCallback((region: CloudRegion) => {
    console.log('Region clicked:', region);
  }, []);

  const handleTimeRangeChange = useCallback((newTimeRange: TimeRange) => {
    setTimeRange(newTimeRange);
    // Regenerate historical data for new time range
    const exchangePairs = exchanges.slice(0, 5).map((e, i) => 
      `${e.id}-${exchanges[(i + 1) % exchanges.length].id}`
    );
    const historical = generateHistoricalLatencyData(exchangePairs, newTimeRange);
    setHistoricalData(historical);
  }, [exchanges]);

  // Filter data based on current selections
  const filteredLatencyData = latencyData.filter(data => {
    if (latencyRange[0] > 0 && data.latency < latencyRange[0]) return false;
    if (latencyRange[1] < 1000 && data.latency > latencyRange[1]) return false;
    return true;
  });

  const filteredExchanges = exchanges.filter(exchange => {
    if (selectedProviders.length > 0 && !selectedProviders.includes(exchange.cloudProvider)) return false;
    if (searchQuery && !exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !exchange.location.city.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !exchange.location.country.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <main className={`min-h-screen transition-all duration-500 ${
      currentTheme === 'dark' 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50'
    }`}>
      {/* Header */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className={`text-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 ${
            currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            GoQuant
            <span className="text-gradient"> Latency</span>
            <br />
            <span className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl ${
              currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'
            }`}>Visualizer</span>
          </h1>
          <p className={`text-mono text-sm sm:text-base md:text-lg lg:text-xl max-w-4xl mx-auto leading-relaxed px-4 ${
            currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Real-time visualization of cryptocurrency exchange latency across global cloud infrastructure.
            <br className="hidden sm:block" />
            <span className={`text-xs sm:text-sm md:text-base mt-2 block ${
              currentTheme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Monitor AWS • GCP • Azure performance metrics in real-time
            </span>
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-4xl px-4">
            <div className={`card-elevated p-2 w-full sm:w-auto ${
              currentTheme === 'dark' ? 'bg-slate-800/90' : 'bg-white/90'
            }`}>
              <div className="flex rounded-xl overflow-hidden">
                {[
                  { id: 'globe', label: '3D Globe', icon: Globe, shortLabel: 'Globe' },
                  { id: 'charts', label: 'Analytics', icon: BarChart3, shortLabel: 'Charts' },
                  { id: 'performance', label: 'Performance', icon: TrendingUp, shortLabel: 'Perf' },
                ].map(({ id, label, shortLabel, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setCurrentView(id as 'globe' | 'charts' | 'performance')}
                    className={`flex items-center justify-center gap-2 sm:gap-3 px-3 sm:px-6 py-3 text-mono font-medium transition-all duration-300 flex-1 sm:flex-none ${
                      currentView === id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : currentTheme === 'dark'
                        ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden text-xs">{shortLabel}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setShowExportDialog(true)}
                className={`card-elevated p-3 transition-all duration-300 ${
                  currentTheme === 'dark'
                    ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white'
                    : 'bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900'
                }`}
                title="Export Data"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              <div className={`card-elevated p-3 ${
                currentTheme === 'dark' ? 'bg-slate-800/90' : 'bg-white/90'
              }`}>
                <CompactConnectionStatus />
              </div>
              
              <NotificationCenter />
              
              <CompactThemeSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <AdvancedFilters
          exchanges={exchanges}
          regions={cloudRegions}
          selectedExchanges={selectedExchanges}
          selectedProviders={selectedProviders}
          latencyRange={latencyRange}
          searchQuery={searchQuery}
          showRegions={showRegions}
          showConnections={showConnections}
          onExchangeToggle={handleExchangeToggle}
          onProviderToggle={handleProviderToggle}
          onLatencyRangeChange={setLatencyRange}
          onSearchChange={setSearchQuery}
          onToggleRegions={() => setShowRegions(!showRegions)}
          onToggleConnections={() => setShowConnections(!showConnections)}
        />
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
        <div className={`card-elevated overflow-hidden ${
          currentTheme === 'dark' ? 'bg-slate-800/95' : 'bg-white/95'
        }`}>
          {currentView === 'globe' && (
            <div className="h-[500px] sm:h-[600px] md:h-[700px] lg:h-[900px] w-full relative">
              <GlobeErrorBoundary>
                <WebGLCheck>
                  {isLoading ? (
                    <GlobeLoading />
                  ) : (
                    <SimpleGlobe
                      exchanges={filteredExchanges}
                      latencyData={filteredLatencyData}
                      cloudRegions={cloudRegions}
                      selectedExchanges={selectedExchanges}
                      showRegions={showRegions}
                      showConnections={showConnections}
                      animationsEnabled={animationsEnabled}
                      theme={currentTheme}
                      onExchangeClick={handleExchangeClick}
                      onRegionClick={handleRegionClick}
                    />
                  )}
                </WebGLCheck>
              </GlobeErrorBoundary>
              
              {/* Globe overlay info */}
              {!isLoading && (
                <div className="absolute top-3 sm:top-6 left-3 sm:left-6 z-20">
                  <div className={`card p-3 sm:p-4 max-w-xs sm:max-w-sm ${
                    currentTheme === 'dark' ? 'bg-slate-800/90' : 'bg-white/90'
                  }`}>
                    <h3 className={`text-mono font-bold mb-2 text-sm sm:text-base ${
                      currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
                    }`}>Network Status</h3>
                    <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-mono">
                      <div className="flex justify-between">
                        <span className={currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Active Exchanges:</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{filteredExchanges.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Connections:</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{filteredLatencyData.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>Avg Latency:</span>
                        <span className={`font-semibold ${currentTheme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                          {Math.round(filteredLatencyData.reduce((acc, d) => acc + d.latency, 0) / filteredLatencyData.length || 0)}ms
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentView === 'charts' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mb-4 sm:mb-6">
                <h2 className={`text-display text-xl sm:text-2xl font-bold mb-2 ${
                  currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>Latency Analytics</h2>
                <p className={`text-mono text-sm sm:text-base ${
                  currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>Historical performance data and trends</p>
              </div>
              <ChartErrorBoundary>
                {isLoading ? (
                  <ChartLoading />
                ) : (
                  <LatencyChart
                    data={historicalData}
                    timeRange={timeRange}
                    selectedPairs={[]}
                    onTimeRangeChange={handleTimeRangeChange}
                  />
                )}
              </ChartErrorBoundary>
            </div>
          )}

          {currentView === 'performance' && (
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="mb-4 sm:mb-6">
                <h2 className={`text-display text-xl sm:text-2xl font-bold mb-2 ${
                  currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>System Performance</h2>
                <p className={`text-mono text-sm sm:text-base ${
                  currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                }`}>Real-time monitoring and diagnostics</p>
              </div>
              <ChartErrorBoundary>
                {isLoading ? (
                  <ChartLoading />
                ) : (
                  <PerformanceMetrics
                    fps={performanceMetrics.fps}
                    memoryUsage={performanceMetrics.memoryUsage}
                    renderTime={performanceMetrics.renderTime}
                    lastUpdate={performanceMetrics.lastUpdate}
                  />
                )}
              </ChartErrorBoundary>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 sm:mt-8">
          <div className={`card p-4 sm:p-6 ${
            currentTheme === 'dark' ? 'bg-slate-800/90' : 'bg-white/90'
          }`}>
            <h3 className={`text-mono font-bold mb-3 sm:mb-4 text-center text-sm sm:text-base ${
              currentTheme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>Legend</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 text-xs sm:text-sm text-mono">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full shadow-sm"></div>
                <span className={`font-medium ${currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>AWS</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full shadow-sm"></div>
                <span className={`font-medium ${currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>GCP</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-cyan-500 rounded-full shadow-sm"></div>
                <span className={`font-medium ${currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Azure</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-emerald-500 rounded-full shadow-sm"></div>
                <span className={`font-medium ${currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Low (&lt;50ms)</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-500 rounded-full shadow-sm"></div>
                <span className={`font-medium ${currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>Med (50-150ms)</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full shadow-sm"></div>
                <span className={`font-medium ${currentTheme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>High (&gt;150ms)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog
        isOpen={showExportDialog}
        onClose={() => setShowExportDialog(false)}
        latencyData={filteredLatencyData}
        historicalData={historicalData}
        exchanges={filteredExchanges}
        regions={cloudRegions}
        selectedExchanges={selectedExchanges}
      />
    </main>
  );
}