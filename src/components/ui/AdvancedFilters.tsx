'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Filter, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Cloud,
  Zap,
  Globe,
  Settings
} from 'lucide-react';
import { Exchange, CloudProvider, CloudRegion } from '@/types';

interface AdvancedFiltersProps {
  exchanges: Exchange[];
  regions: CloudRegion[];
  selectedExchanges: string[];
  selectedProviders: CloudProvider[];
  latencyRange: [number, number];
  searchQuery: string;
  showRegions: boolean;
  showConnections: boolean;
  onExchangeToggle: (exchangeId: string) => void;
  onProviderToggle: (provider: CloudProvider) => void;
  onLatencyRangeChange: (range: [number, number]) => void;
  onSearchChange: (query: string) => void;
  onToggleRegions: () => void;
  onToggleConnections: () => void;
  className?: string;
}

export default function AdvancedFilters({
  exchanges,
  regions,
  selectedExchanges,
  selectedProviders,
  latencyRange,
  searchQuery,
  showRegions,
  showConnections,
  onExchangeToggle,
  onProviderToggle,
  onLatencyRangeChange,
  onSearchChange,
  onToggleRegions,
  onToggleConnections,
  className = '',
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const providerColors = {
    AWS: 'bg-orange-500',
    GCP: 'bg-blue-500',
    Azure: 'bg-cyan-500',
  };

  const providerStats = {
    AWS: exchanges.filter(e => e.cloudProvider === 'AWS').length,
    GCP: exchanges.filter(e => e.cloudProvider === 'GCP').length,
    Azure: exchanges.filter(e => e.cloudProvider === 'Azure').length,
  };

  const filteredExchanges = exchanges.filter(exchange =>
    exchange.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exchange.location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exchange.location.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div className={`card-elevated bg-white/95 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-600" />
            <h3 className="text-mono font-bold text-slate-900">Advanced Filters</h3>
            <span className="text-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
              {selectedExchanges.length + selectedProviders.length} active
            </span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-slate-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-600" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Search */}
              <div>
                <label className="text-mono text-sm font-medium text-slate-700 mb-2 block">
                  Search Exchanges
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search by name, city, or country..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => onSearchChange('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="text-mono text-xs text-slate-500 mt-1">
                    Found {filteredExchanges.length} exchange(s)
                  </p>
                )}
              </div>

              {/* Cloud Providers */}
              <div>
                <button
                  onClick={() => toggleSection('providers')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-2">
                    <Cloud className="w-4 h-4 text-slate-600" />
                    <span className="text-mono text-sm font-medium text-slate-700">
                      Cloud Providers
                    </span>
                  </div>
                  {activeSection === 'providers' ? (
                    <ChevronUp className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                <AnimatePresence>
                  {activeSection === 'providers' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      {(['AWS', 'GCP', 'Azure'] as CloudProvider[]).map((provider) => (
                        <label
                          key={provider}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedProviders.includes(provider)}
                              onChange={() => onProviderToggle(provider)}
                              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <div className={`w-3 h-3 rounded-full ${providerColors[provider]}`} />
                            <span className="text-mono text-sm font-medium text-slate-900">
                              {provider}
                            </span>
                          </div>
                          <span className="text-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                            {providerStats[provider]}
                          </span>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Exchanges */}
              <div>
                <button
                  onClick={() => toggleSection('exchanges')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-600" />
                    <span className="text-mono text-sm font-medium text-slate-700">
                      Exchanges
                    </span>
                  </div>
                  {activeSection === 'exchanges' ? (
                    <ChevronUp className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                <AnimatePresence>
                  {activeSection === 'exchanges' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2 max-h-64 overflow-y-auto"
                    >
                      {filteredExchanges.map((exchange) => (
                        <label
                          key={exchange.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={selectedExchanges.includes(exchange.id)}
                              onChange={() => onExchangeToggle(exchange.id)}
                              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                            />
                            <div className={`w-3 h-3 rounded-full ${providerColors[exchange.cloudProvider]}`} />
                            <div>
                              <div className="text-mono text-sm font-medium text-slate-900">
                                {exchange.name}
                              </div>
                              <div className="text-mono text-xs text-slate-500">
                                {exchange.location.city}, {exchange.location.country}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-mono text-xs text-slate-500">
                              {exchange.cloudProvider}
                            </div>
                            <div className={`text-mono text-xs font-medium ${
                              exchange.status === 'online' ? 'text-green-600' : 
                              exchange.status === 'maintenance' ? 'text-amber-600' : 'text-red-600'
                            }`}>
                              {exchange.status}
                            </div>
                          </div>
                        </label>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Latency Range */}
              <div>
                <button
                  onClick={() => toggleSection('latency')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-slate-600" />
                    <span className="text-mono text-sm font-medium text-slate-700">
                      Latency Range
                    </span>
                  </div>
                  {activeSection === 'latency' ? (
                    <ChevronUp className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                <AnimatePresence>
                  {activeSection === 'latency' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <label className="text-mono text-xs text-slate-600 mb-1 block">
                            Min (ms)
                          </label>
                          <input
                            type="number"
                            value={latencyRange[0]}
                            onChange={(e) => onLatencyRangeChange([Number(e.target.value), latencyRange[1]])}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="1000"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-mono text-xs text-slate-600 mb-1 block">
                            Max (ms)
                          </label>
                          <input
                            type="number"
                            value={latencyRange[1]}
                            onChange={(e) => onLatencyRangeChange([latencyRange[0], Number(e.target.value)])}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            min="0"
                            max="1000"
                          />
                        </div>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={latencyRange[0]}
                          onChange={(e) => onLatencyRangeChange([Number(e.target.value), latencyRange[1]])}
                          className="absolute w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <input
                          type="range"
                          min="0"
                          max="1000"
                          value={latencyRange[1]}
                          onChange={(e) => onLatencyRangeChange([latencyRange[0], Number(e.target.value)])}
                          className="absolute w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      
                      <div className="flex justify-between text-mono text-xs text-slate-500">
                        <span>0ms</span>
                        <span>{latencyRange[0]}ms - {latencyRange[1]}ms</span>
                        <span>1000ms</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Display Options */}
              <div>
                <button
                  onClick={() => toggleSection('display')}
                  className="w-full flex items-center justify-between mb-3"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-slate-600" />
                    <span className="text-mono text-sm font-medium text-slate-700">
                      Display Options
                    </span>
                  </div>
                  {activeSection === 'display' ? (
                    <ChevronUp className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                <AnimatePresence>
                  {activeSection === 'display' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-3"
                    >
                      <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 text-slate-600" />
                          <span className="text-mono text-sm font-medium text-slate-900">
                            Show Regions
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={showRegions}
                          onChange={onToggleRegions}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Zap className="w-4 h-4 text-slate-600" />
                          <span className="text-mono text-sm font-medium text-slate-900">
                            Show Connections
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          checked={showConnections}
                          onChange={onToggleConnections}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      exchanges.forEach(e => {
                        if (!selectedExchanges.includes(e.id)) {
                          onExchangeToggle(e.id);
                        }
                      });
                    }}
                    className="flex-1 px-3 py-2 text-mono text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => {
                      selectedExchanges.forEach(id => onExchangeToggle(id));
                      selectedProviders.forEach(provider => onProviderToggle(provider));
                    }}
                    className="flex-1 px-3 py-2 text-mono text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}