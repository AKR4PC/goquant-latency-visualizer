/**
 * Core type definitions for the GoQuant Latency Topology Visualizer
 */

import { Vector3 } from 'three';

// Cloud Provider Types
export type CloudProvider = 'AWS' | 'GCP' | 'Azure';

// Exchange Status Types
export type ExchangeStatus = 'online' | 'offline' | 'maintenance';

// Latency Status Types
export type LatencyStatus = 'low' | 'medium' | 'high' | 'critical';

// Theme Types
export type Theme = 'dark' | 'light';

// Time Range Types
export type TimeRange = '1h' | '24h' | '7d' | '30d';

// Coordinates Interface
export interface Coordinates {
  lat: number;
  lng: number;
}

// Location Interface with additional details
export interface Location extends Coordinates {
  city: string;
  country: string;
}

// Exchange Interface
export interface Exchange {
  id: string;
  name: string;
  location: Location;
  cloudProvider: CloudProvider;
  region: string;
  status: ExchangeStatus;
  serverCount: number;
  capacity: number;
}

// Latency Data Interface
export interface LatencyData {
  from: string;
  to: string;
  latency: number;
  timestamp: Date;
  status: LatencyStatus;
  packetLoss?: number;
  jitter?: number;
  route: Coordinates[];
}

// Cloud Region Interface
export interface CloudRegion {
  id: string;
  provider: CloudProvider;
  name: string;
  code: string;
  location: Coordinates;
  serverCount: number;
  capacity: number;
  exchanges: string[];
}

// Historical Latency Data Interface
export interface HistoricalLatencyData {
  timestamp: Date;
  exchangePair: string;
  latency: number;
  packetLoss: number;
  jitter: number;
  volume?: number;
}

// Exchange Pair Interface
export interface ExchangePair {
  from: string;
  to: string;
  label: string;
}

// Network Event Interface
export interface NetworkEvent {
  id: string;
  type: 'congestion' | 'maintenance' | 'outage';
  affectedExchanges: string[];
  startTime: Date;
  endTime?: Date;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

// Performance Metrics Interface
export interface PerformanceMetrics {
  fps: number;
  memoryUsage: number;
  renderTime: number;
  lastUpdate: Date;
}

// Filter State Interface
export interface FilterState {
  selectedExchanges: string[];
  selectedProviders: CloudProvider[];
  latencyRange: [number, number];
  timeRange: TimeRange;
  searchQuery: string;
}

// UI State Interface
export interface UIState {
  theme: Theme;
  showRegions: boolean;
  showConnections: boolean;
  showHeatmap: boolean;
  animationsEnabled: boolean;
  sidebarCollapsed: boolean;
}

// App State Interface
export interface AppState {
  exchanges: Exchange[];
  latencyData: LatencyData[];
  historicalData: HistoricalLatencyData[];
  cloudRegions: CloudRegion[];
  networkEvents: NetworkEvent[];
  filters: FilterState;
  ui: UIState;
  performance: PerformanceMetrics;
  loading: boolean;
  error: string | null;
}

// Component Props Types
export interface WorldMapProps {
  exchanges: Exchange[];
  latencyData: LatencyData[];
  selectedExchanges: string[];
  showRegions: boolean;
  theme: Theme;
  onExchangeSelect: (exchange: Exchange) => void;
}

export interface ExchangeMarkerProps {
  exchange: Exchange;
  position: Vector3;
  isSelected: boolean;
  onSelect: (exchange: Exchange) => void;
  scale?: number;
}

export interface LatencyConnectionProps {
  from: Vector3;
  to: Vector3;
  latency: number;
  animated: boolean;
  color?: string;
}

export interface CloudRegionProps {
  region: CloudRegion;
  position: Vector3;
  visible: boolean;
}

export interface LatencyChartProps {
  data: HistoricalLatencyData[];
  timeRange: TimeRange;
  selectedPairs: ExchangePair[];
  onTimeRangeChange: (range: TimeRange) => void;
}