'use client';

import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from 'recharts';
import { HistoricalLatencyData, TimeRange, ExchangePair } from '@/types';
import { format } from 'date-fns';

interface LatencyChartProps {
  data: HistoricalLatencyData[];
  timeRange: TimeRange;
  selectedPairs: ExchangePair[];
  onTimeRangeChange: (range: TimeRange) => void;
}

export default function LatencyChart({
  data,
  timeRange,
  onTimeRangeChange,
}: LatencyChartProps) {
  const timeRanges: { value: TimeRange; label: string }[] = [
    { value: '1h', label: '1 Hour' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
  ];

  // Process data for charts
  const chartData = useMemo(() => {
    if (!data.length) {
      // Generate mock data if no real data is available
      const mockData = [];
      const now = new Date();
      const points = timeRange === '1h' ? 12 : timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
      
      for (let i = points - 1; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * (timeRange === '1h' ? 5 * 60 * 1000 : 
                                                        timeRange === '24h' ? 60 * 60 * 1000 :
                                                        timeRange === '7d' ? 24 * 60 * 60 * 1000 :
                                                        24 * 60 * 60 * 1000));
        
        mockData.push({
          time: format(timestamp, 
            timeRange === '1h' ? 'HH:mm' :
            timeRange === '24h' ? 'HH:mm' :
            timeRange === '7d' ? 'MMM dd' :
            'MMM dd'
          ),
          avgLatency: Math.round(80 + Math.sin(i * 0.3) * 30 + Math.random() * 20),
          minLatency: Math.round(50 + Math.random() * 20),
          maxLatency: Math.round(120 + Math.random() * 40),
          avgPacketLoss: Number((Math.random() * 0.5).toFixed(3)),
          avgJitter: Number((5 + Math.random() * 10).toFixed(2)),
          totalVolume: Math.round(Math.random() * 1000000),
        });
      }
      
      return mockData;
    }

    // Group data by time intervals
    const groupedData = data.reduce((acc: Record<string, { time: string; latencies: number[]; packetLosses: number[]; jitters: number[]; volumes: number[] }>, item) => {
      const timeKey = format(item.timestamp, 
        timeRange === '1h' ? 'HH:mm' :
        timeRange === '24h' ? 'HH:mm' :
        timeRange === '7d' ? 'MMM dd' :
        'MMM dd'
      );
      
      if (!acc[timeKey]) {
        acc[timeKey] = {
          time: timeKey,
          latencies: [],
          packetLosses: [],
          jitters: [],
          volumes: [],
        };
      }
      
      acc[timeKey].latencies.push(item.latency);
      acc[timeKey].packetLosses.push(item.packetLoss);
      acc[timeKey].jitters.push(item.jitter);
      if (item.volume) acc[timeKey].volumes.push(item.volume);
      
      return acc;
    }, {} as Record<string, { time: string; latencies: number[]; packetLosses: number[]; jitters: number[]; volumes: number[] }>);

    // Calculate averages
    return Object.values(groupedData).map((group) => ({
      time: group.time,
      avgLatency: Math.round(group.latencies.reduce((a: number, b: number) => a + b, 0) / group.latencies.length),
      minLatency: Math.min(...group.latencies),
      maxLatency: Math.max(...group.latencies),
      avgPacketLoss: Number((group.packetLosses.reduce((a: number, b: number) => a + b, 0) / group.packetLosses.length).toFixed(3)),
      avgJitter: Number((group.jitters.reduce((a: number, b: number) => a + b, 0) / group.jitters.length).toFixed(2)),
      totalVolume: group.volumes.reduce((a: number, b: number) => a + b, 0),
    }));
  }, [data, timeRange]);

  // Statistics
  const stats = useMemo(() => {
    if (!chartData.length) return null;

    const latencies = chartData.map(d => d.avgLatency);
    const packetLosses = chartData.map(d => d.avgPacketLoss);
    const jitters = chartData.map(d => d.avgJitter);

    return {
      avgLatency: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
      minLatency: Math.min(...latencies),
      maxLatency: Math.max(...latencies),
      avgPacketLoss: Number((packetLosses.reduce((a, b) => a + b, 0) / packetLosses.length).toFixed(3)),
      avgJitter: Number((jitters.reduce((a, b) => a + b, 0) / jitters.length).toFixed(2)),
    };
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ color: string; name: string; value: number; dataKey: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass border border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-4 rounded-xl shadow-xl z-50">
          <div className="text-mono font-bold text-slate-900 dark:text-white mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
            📊 {label}
          </div>
          <div className="space-y-2">
            {payload.map((entry, index: number) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full shadow-sm" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-mono text-sm text-slate-600 dark:text-slate-300">{entry.name}:</span>
                </div>
                <span className="text-mono font-bold text-slate-900 dark:text-white">
                  {entry.value}
                  {entry.dataKey.includes('Latency') || entry.dataKey.includes('Jitter') ? 'ms' :
                   entry.dataKey.includes('PacketLoss') ? '%' : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-display text-3xl font-bold text-slate-900">
            Historical Latency Trends
          </h2>
          <p className="text-mono text-slate-600 text-lg">
            Network performance metrics over time with real-time insights
          </p>
          <div className="flex items-center gap-4 text-mono text-sm text-slate-500">
            <span>📊 {chartData.length} data points</span>
            <span>🔄 Updated every 5 seconds</span>
            <span>📈 {timeRange} view</span>
          </div>
        </div>
        
        {/* Enhanced Time Range Selector */}
        <div className="card-elevated p-2 bg-white/95">
          <div className="flex rounded-xl overflow-hidden">
            {timeRanges.map((range) => (
              <button
                key={range.value}
                onClick={() => onTimeRangeChange(range.value)}
                className={`px-6 py-3 text-mono font-medium transition-all duration-300 ${
                  timeRange === range.value
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="card-elevated bg-gradient-to-br from-blue-50 to-blue-100 p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="text-blue-600 text-xs font-mono bg-blue-200 px-2 py-1 rounded-full">
                AVG
              </div>
            </div>
            <div className="text-mono text-sm text-slate-600 mb-1">Average Latency</div>
            <div className="text-display text-3xl font-bold text-blue-700">{stats.avgLatency}<span className="text-lg text-blue-500">ms</span></div>
            <div className="text-mono text-xs text-blue-600 mt-2">
              {stats.avgLatency < 100 ? '🟢 Excellent' : stats.avgLatency < 200 ? '🟡 Good' : '🔴 Poor'}
            </div>
          </div>
          
          <div className="card-elevated bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="text-emerald-600 text-xs font-mono bg-emerald-200 px-2 py-1 rounded-full">
                MIN
              </div>
            </div>
            <div className="text-mono text-sm text-slate-600 mb-1">Minimum Latency</div>
            <div className="text-display text-3xl font-bold text-emerald-700">{stats.minLatency}<span className="text-lg text-emerald-500">ms</span></div>
            <div className="text-mono text-xs text-emerald-600 mt-2">
              🚀 Best Performance
            </div>
          </div>
          
          <div className="card-elevated bg-gradient-to-br from-red-50 to-red-100 p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="text-red-600 text-xs font-mono bg-red-200 px-2 py-1 rounded-full">
                MAX
              </div>
            </div>
            <div className="text-mono text-sm text-slate-600 mb-1">Maximum Latency</div>
            <div className="text-display text-3xl font-bold text-red-700">{stats.maxLatency}<span className="text-lg text-red-500">ms</span></div>
            <div className="text-mono text-xs text-red-600 mt-2">
              ⚠️ Peak Latency
            </div>
          </div>
          
          <div className="card-elevated bg-gradient-to-br from-amber-50 to-amber-100 p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="text-amber-600 text-xs font-mono bg-amber-200 px-2 py-1 rounded-full">
                LOSS
              </div>
            </div>
            <div className="text-mono text-sm text-slate-600 mb-1">Packet Loss</div>
            <div className="text-display text-3xl font-bold text-amber-700">{stats.avgPacketLoss}<span className="text-lg text-amber-500">%</span></div>
            <div className="text-mono text-xs text-amber-600 mt-2">
              {stats.avgPacketLoss < 0.1 ? '🟢 Excellent' : stats.avgPacketLoss < 1 ? '🟡 Good' : '🔴 High'}
            </div>
          </div>
          
          <div className="card-elevated bg-gradient-to-br from-purple-50 to-purple-100 p-6 hover:scale-105 transition-transform duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="text-purple-600 text-xs font-mono bg-purple-200 px-2 py-1 rounded-full">
                JITTER
              </div>
            </div>
            <div className="text-mono text-sm text-slate-600 mb-1">Average Jitter</div>
            <div className="text-display text-3xl font-bold text-purple-700">{stats.avgJitter}<span className="text-lg text-purple-500">ms</span></div>
            <div className="text-mono text-xs text-purple-600 mt-2">
              {stats.avgJitter < 5 ? '🟢 Stable' : stats.avgJitter < 15 ? '🟡 Moderate' : '🔴 High'}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Main Latency Chart */}
      <div className="card-elevated bg-white/95 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-display text-2xl font-bold text-slate-900 mb-2">
              Latency Over Time
            </h3>
            <p className="text-mono text-slate-600">
              Real-time network performance visualization with min/max ranges
            </p>
          </div>
          <div className="flex items-center gap-4 text-mono text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <span className="text-slate-600">Min Latency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-slate-600">Avg Latency</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-slate-600">Max Latency</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time" 
              className="text-gray-600 dark:text-gray-400"
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              className="text-gray-600 dark:text-gray-400"
              label={{ value: 'Latency (ms)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="maxLatency"
              stackId="1"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.2}
              name="Max Latency"
            />
            <Area
              type="monotone"
              dataKey="avgLatency"
              stackId="2"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.6}
              name="Avg Latency"
            />
            <Area
              type="monotone"
              dataKey="minLatency"
              stackId="3"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.8}
              name="Min Latency"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Enhanced Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Enhanced Packet Loss Chart */}
        <div className="card-elevated bg-white/95 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-display text-xl font-bold text-slate-900 mb-2">
                Packet Loss Over Time
              </h3>
              <p className="text-mono text-slate-600 text-sm">
                Network reliability indicator
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <div className="w-6 h-6 bg-red-500 rounded-lg"></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                label={{ value: 'Loss (%)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="avgPacketLoss"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 3 }}
                name="Packet Loss"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced Jitter Chart */}
        <div className="card-elevated bg-white/95 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-display text-xl font-bold text-slate-900 mb-2">
                Jitter Over Time
              </h3>
              <p className="text-mono text-slate-600 text-sm">
                Connection stability measurement
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <div className="w-6 h-6 bg-amber-500 rounded-lg"></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                label={{ value: 'Jitter (ms)', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="avgJitter"
                stroke="#F59E0B"
                strokeWidth={2}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }}
                name="Jitter"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Enhanced Volume Chart (if data available) */}
      {chartData.some(d => d.totalVolume > 0) && (
        <div className="card-elevated bg-white/95 p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-display text-2xl font-bold text-slate-900 mb-2">
                Trading Volume
              </h3>
              <p className="text-mono text-slate-600">
                Exchange activity correlation with network performance
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <div className="w-6 h-6 bg-purple-500 rounded-lg"></div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                className="text-gray-600 dark:text-gray-400"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                className="text-gray-600 dark:text-gray-400"
                label={{ value: 'Volume', angle: -90, position: 'insideLeft' }}
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="totalVolume"
                fill="#8B5CF6"
                name="Trading Volume"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}