'use client';

import React, { useState } from 'react';
import { Search, Filter, Eye, EyeOff, Play, Pause, Sun, Moon } from 'lucide-react';
import { Exchange, CloudRegion, CloudProvider } from '@/types';
import { getProviderColor } from '@/data/cloudProviders';

interface ControlPanelProps {
  exchanges: Exchange[];
  cloudRegions: CloudRegion[];
  selectedExchanges: string[];
  selectedProviders: CloudProvider[];
  latencyRange: [number, number];
  searchQuery: string;
  showRegions: boolean;
  showConnections: boolean;
  animationsEnabled: boolean;
  theme: 'dark' | 'light';
  onExchangeToggle: (exchangeId: string) => void;
  onProviderToggle: (provider: CloudProvider) => void;
  onLatencyRangeChange: (range: [number, number]) => void;
  onSearchChange: (query: string) => void;
  onToggleRegions: () => void;
  onToggleConnections: () => void;
  onToggleAnimations: () => void;
  onThemeToggle: () => void;
}

export default function ControlPanel({
  exchanges,
  cloudRegions,
  selectedExchanges,
  selectedProviders,
  latencyRange,
  searchQuery,
  showRegions,
  showConnections,
  animationsEnabled,
  theme,
  onExchangeToggle,
  onProviderToggle,
  onLatencyRangeChange,
  onSearchChange,
  onToggleRegions,
  onToggleConnections,
  onToggleAnimations,
  onThemeToggle,
}: ControlPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'exchanges' | 'providers' | 'settings'>('exchanges');

  const providers: CloudProvider[] = ['AWS', 'GCP', 'Azure'];

  const filteredExchanges = exchanges.filter(exchange =>
    exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exchange.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exchange.location.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`fixed top-4 left-4 z-50 transition-all duration-300 ${
      isExpanded ? 'w-80' : 'w-12'
    }`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-12 h-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors mb-2"
      >
        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Control Panel */}
      {isExpanded && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Controls
            </h3>
            
            {/* Quick Actions */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={onToggleRegions}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  showRegions
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {showRegions ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Regions
              </button>
              
              <button
                onClick={onToggleConnections}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  showConnections
                    ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {showConnections ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                Connections
              </button>
              
              <button
                onClick={onToggleAnimations}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  animationsEnabled
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                {animationsEnabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                Animate
              </button>
              
              <button
                onClick={onThemeToggle}
                className="flex items-center gap-1 px-3 py-1.5 rounded-md text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search exchanges, cities..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {[
              { id: 'exchanges', label: 'Exchanges' },
              { id: 'providers', label: 'Providers' },
              { id: 'settings', label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'exchanges' | 'providers' | 'settings')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 max-h-96 overflow-y-auto">
            {activeTab === 'exchanges' && (
              <div className="space-y-2">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exchanges ({selectedExchanges.length}/{exchanges.length})
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => exchanges.forEach(e => onExchangeToggle(e.id))}
                      className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                    >
                      All
                    </button>
                    <button
                      onClick={() => selectedExchanges.forEach(id => onExchangeToggle(id))}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      None
                    </button>
                  </div>
                </div>
                
                {filteredExchanges.map((exchange) => (
                  <label
                    key={exchange.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedExchanges.includes(exchange.id)}
                      onChange={() => onExchangeToggle(exchange.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getProviderColor(exchange.cloudProvider) }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {exchange.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {exchange.location.city}, {exchange.location.country}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {exchange.cloudProvider}
                    </div>
                  </label>
                ))}
              </div>
            )}

            {activeTab === 'providers' && (
              <div className="space-y-3">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Cloud Providers
                </div>
                
                {providers.map((provider) => {
                  const providerExchanges = exchanges.filter(e => e.cloudProvider === provider);
                  const providerRegions = cloudRegions.filter(r => r.provider === provider);
                  
                  return (
                    <label
                      key={provider}
                      className="flex items-center gap-3 p-3 rounded-md border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedProviders.includes(provider)}
                        onChange={() => onProviderToggle(provider)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div
                        className="w-4 h-4 rounded"
                        style={{ backgroundColor: getProviderColor(provider) }}
                      />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {provider}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {providerExchanges.length} exchanges • {providerRegions.length} regions
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Latency Range (ms)
                  </label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={latencyRange[0]}
                        onChange={(e) => onLatencyRangeChange([Number(e.target.value), latencyRange[1]])}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={latencyRange[1]}
                        onChange={(e) => onLatencyRangeChange([latencyRange[0], Number(e.target.value)])}
                        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                        placeholder="Max"
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      value={latencyRange[1]}
                      onChange={(e) => onLatencyRangeChange([latencyRange[0], Number(e.target.value)])}
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Statistics
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">Total Exchanges</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{exchanges.length}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">Cloud Regions</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{cloudRegions.length}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">Selected</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{selectedExchanges.length}</div>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <div className="text-gray-500 dark:text-gray-400">Providers</div>
                      <div className="font-semibold text-gray-900 dark:text-white">{selectedProviders.length}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}