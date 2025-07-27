'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { EXCHANGES } from '@/data/exchanges';
import { Activity, Zap, Globe, TrendingUp } from 'lucide-react';

export const StatsDashboard: React.FC = () => {
  // Generate cloud provider distribution data
  const cloudProviderData = [
    {
      name: 'AWS',
      count: EXCHANGES.filter(e => e.cloudProvider === 'AWS').length,
      color: '#ff9900',
    },
    {
      name: 'GCP',
      count: EXCHANGES.filter(e => e.cloudProvider === 'GCP').length,
      color: '#4285f4',
    },
    {
      name: 'Azure',
      count: EXCHANGES.filter(e => e.cloudProvider === 'Azure').length,
      color: '#00bcf2',
    },
  ];

  // Generate regional distribution data
  const regionData = [
    { name: 'Asia Pacific', exchanges: 8, avgLatency: 45 },
    { name: 'North America', exchanges: 4, avgLatency: 38 },
    { name: 'Europe', exchanges: 3, avgLatency: 52 },
  ];

  // Calculate network statistics
  const totalExchanges = EXCHANGES.length;
  const onlineExchanges = EXCHANGES.filter(e => e.status === 'online').length;
  const totalConnections = (totalExchanges * (totalExchanges - 1)) / 2;
  const avgCapacity = Math.round(EXCHANGES.reduce((sum, e) => sum + e.capacity, 0) / totalExchanges);

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{totalExchanges}</div>
              <div className="text-sm text-foreground/60">Total Exchanges</div>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Activity className="w-5 h-5 text-success" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{onlineExchanges}</div>
              <div className="text-sm text-foreground/60">Online Now</div>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Zap className="w-5 h-5 text-warning" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{totalConnections}</div>
              <div className="text-sm text-foreground/60">Active Connections</div>
            </div>
          </div>
        </div>

        <div className="card p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-danger/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-danger" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{avgCapacity}%</div>
              <div className="text-sm text-foreground/60">Avg Capacity</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cloud Provider Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Cloud Provider Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cloudProviderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {cloudProviderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 mt-4">
            {cloudProviderData.map((provider) => (
              <div key={provider.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: provider.color }}
                ></div>
                <span className="text-sm text-foreground/70">
                  {provider.name} ({provider.count})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Performance */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Regional Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(31, 41, 55, 0.95)',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
                <Bar dataKey="exchanges" fill="#3b82f6" name="Exchanges" />
                <Bar dataKey="avgLatency" fill="#10b981" name="Avg Latency (ms)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Exchange Status Overview */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Exchange Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {EXCHANGES.map((exchange) => (
            <div key={exchange.id} className="bg-background/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                    exchange.cloudProvider === 'AWS' ? 'bg-orange-500' :
                    exchange.cloudProvider === 'GCP' ? 'bg-blue-500' : 'bg-cyan-500'
                  }`}>
                    {exchange.cloudProvider === 'AWS' ? 'A' : exchange.cloudProvider === 'GCP' ? 'G' : 'Az'}
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">{exchange.name}</div>
                    <div className="text-xs text-foreground/60">{exchange.location.city}</div>
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${
                  exchange.status === 'online' ? 'bg-success' :
                  exchange.status === 'maintenance' ? 'bg-warning' : 'bg-danger'
                }`}></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground/60">Capacity:</span>
                <span className="font-medium text-foreground">{exchange.capacity}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground/60">Servers:</span>
                <span className="font-medium text-foreground">{exchange.serverCount}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};