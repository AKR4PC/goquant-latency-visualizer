'use client';

import React, { useMemo } from 'react';
import { LatencyData, Exchange } from '@/types';
import { getLatencyColor } from '@/data/cloudProviders';

interface LatencyHeatmapProps {
  exchanges: Exchange[];
  latencyData: LatencyData[];
  className?: string;
}

export default function LatencyHeatmap({ exchanges, latencyData, className = '' }: LatencyHeatmapProps) {
  const heatmapData = useMemo(() => {
    // Create a matrix of latency data between exchanges
    const matrix: { [key: string]: { [key: string]: number } } = {};
    
    exchanges.forEach(from => {
      matrix[from.id] = {};
      exchanges.forEach(to => {
        if (from.id !== to.id) {
          const connection = latencyData.find(
            data => (data.from === from.id && data.to === to.id) ||
                   (data.from === to.id && data.to === from.id)
          );
          matrix[from.id][to.id] = connection?.latency || 0;
        } else {
          matrix[from.id][to.id] = 0;
        }
      });
    });
    
    return matrix;
  }, [exchanges, latencyData]);

  const maxLatency = useMemo(() => {
    return Math.max(...latencyData.map(d => d.latency));
  }, [latencyData]);

  const getIntensity = (latency: number) => {
    if (latency === 0) return 0;
    return Math.min(latency / maxLatency, 1);
  };

  return (
    <div className={`card-elevated bg-white/95 p-6 ${className}`}>
      <div className="mb-6">
        <h3 className="text-display text-xl font-bold text-slate-900 mb-2">Latency Heatmap</h3>
        <p className="text-mono text-sm text-slate-600">
          Inter-exchange latency visualization matrix
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid gap-1" style={{ gridTemplateColumns: `120px repeat(${exchanges.length}, 1fr)` }}>
            {/* Header row */}
            <div></div>
            {exchanges.map(exchange => (
              <div
                key={`header-${exchange.id}`}
                className="text-mono text-xs font-medium text-slate-600 p-2 text-center transform -rotate-45 origin-bottom-left"
                style={{ minWidth: '60px', height: '80px' }}
              >
                <div className="mt-8">
                  {exchange.name}
                </div>
              </div>
            ))}
            
            {/* Data rows */}
            {exchanges.map(fromExchange => (
              <React.Fragment key={`row-${fromExchange.id}`}>
                <div className="text-mono text-xs font-medium text-slate-600 p-2 flex items-center">
                  <div className="truncate">
                    {fromExchange.name}
                    <div className="text-xs text-slate-400">
                      {fromExchange.location.city}
                    </div>
                  </div>
                </div>
                {exchanges.map(toExchange => {
                  const latency = heatmapData[fromExchange.id]?.[toExchange.id] || 0;
                  const intensity = getIntensity(latency);
                  const color = latency > 0 ? getLatencyColor(latency) : '#f8fafc';
                  
                  return (
                    <div
                      key={`cell-${fromExchange.id}-${toExchange.id}`}
                      className="relative group cursor-pointer transition-all duration-200 hover:scale-110 hover:z-10"
                      style={{
                        backgroundColor: latency > 0 ? `${color}${Math.round(intensity * 255).toString(16).padStart(2, '0')}` : color,
                        minWidth: '60px',
                        height: '60px',
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-mono text-xs font-semibold text-slate-900">
                          {latency > 0 ? `${Math.round(latency)}` : '-'}
                        </span>
                      </div>
                      
                      {/* Tooltip */}
                      {latency > 0 && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                          <div className="card bg-slate-900 text-white p-3 text-xs text-mono whitespace-nowrap">
                            <div className="font-semibold">
                              {fromExchange.name} → {toExchange.name}
                            </div>
                            <div className="text-slate-300">
                              Latency: {Math.round(latency)}ms
                            </div>
                            <div className="text-slate-400">
                              {fromExchange.location.city} → {toExchange.location.city}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-mono text-xs text-slate-600">
          Latency (ms)
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-mono text-xs text-slate-600">0</span>
          <div className="flex space-x-1">
            {[0.2, 0.4, 0.6, 0.8, 1.0].map(intensity => (
              <div
                key={intensity}
                className="w-4 h-4 rounded"
                style={{
                  backgroundColor: `#ef4444${Math.round(intensity * 255).toString(16).padStart(2, '0')}`,
                }}
              />
            ))}
          </div>
          <span className="text-mono text-xs text-slate-600">{Math.round(maxLatency)}</span>
        </div>
      </div>
    </div>
  );
}