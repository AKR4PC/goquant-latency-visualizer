/**
 * Application constants and configuration values
 */

import { CloudProvider } from '@/types';

// Latency Thresholds (in milliseconds)
export const LATENCY_THRESHOLDS = {
  LOW: 50,
  MEDIUM: 150,
} as const;

// Color Scheme - GitHub inspired
export const COLORS = {
  PRIMARY: '#0969da',
  SUCCESS: '#1a7f37',
  WARNING: '#bf8700',
  DANGER: '#cf222e',
  BACKGROUND: '#fafbfc',
  
  // Latency Colors
  LATENCY_LOW: '#1a7f37',    // Green
  LATENCY_MEDIUM: '#bf8700', // Yellow
  LATENCY_HIGH: '#cf222e',   // Red
  
  // Cloud Provider Colors
  AWS: '#ff9900',      // Orange
  GCP: '#4285f4',      // Blue
  AZURE: '#00bcf2',    // Light Blue
} as const;

// Performance Targets
export const PERFORMANCE = {
  TARGET_FPS: {
    DESKTOP: 60,
    MOBILE: 30,
  },
  MAX_MEMORY_MB: 512,
  MAX_LOAD_TIME_MS: 3000,
} as const;

// 3D Scene Configuration
export const SCENE_CONFIG = {
  EARTH_RADIUS: 5,
  EARTH_SEGMENTS: 64,
  CAMERA_DISTANCE: 15,
  MARKER_SCALE: 0.1,
  CONNECTION_OPACITY: 0.7,
  ANIMATION_SPEED: 0.02,
} as const;

// Data Update Intervals
export const UPDATE_INTERVALS = {
  LATENCY_DATA: 7000,      // 7 seconds
  PERFORMANCE_METRICS: 1000, // 1 second
  HISTORICAL_DATA: 60000,   // 1 minute
} as const;

// Cloud Provider Configurations
export const CLOUD_PROVIDERS: Record<CloudProvider, {
  name: string;
  color: string;
  markerType: 'sphere' | 'cube' | 'pyramid';
}> = {
  AWS: {
    name: 'Amazon Web Services',
    color: COLORS.AWS,
    markerType: 'sphere',
  },
  GCP: {
    name: 'Google Cloud Platform',
    color: COLORS.GCP,
    markerType: 'cube',
  },
  Azure: {
    name: 'Microsoft Azure',
    color: COLORS.AZURE,
    markerType: 'pyramid',
  },
} as const;

// Time Range Configurations
export const TIME_RANGES = {
  '1h': {
    label: '1 Hour',
    milliseconds: 60 * 60 * 1000,
    dataPoints: 60,
  },
  '24h': {
    label: '24 Hours',
    milliseconds: 24 * 60 * 60 * 1000,
    dataPoints: 144, // Every 10 minutes
  },
  '7d': {
    label: '7 Days',
    milliseconds: 7 * 24 * 60 * 60 * 1000,
    dataPoints: 168, // Every hour
  },
  '30d': {
    label: '30 Days',
    milliseconds: 30 * 24 * 60 * 60 * 1000,
    dataPoints: 720, // Every hour
  },
} as const;

// Default Filter State
export const DEFAULT_FILTERS = {
  selectedExchanges: [],
  selectedProviders: ['AWS', 'GCP', 'Azure'] as CloudProvider[],
  latencyRange: [0, 500] as [number, number],
  timeRange: '24h' as const,
  searchQuery: '',
} as const;

// Default UI State
export const DEFAULT_UI_STATE = {
  theme: 'dark' as const,
  showRegions: true,
  showConnections: true,
  showHeatmap: false,
  animationsEnabled: true,
  sidebarCollapsed: false,
} as const;

// Responsive Breakpoints
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;

// Animation Durations (in milliseconds)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  CONNECTION_PULSE: 2000,
  MARKER_HOVER: 200,
} as const;

// API Endpoints (for future use)
export const API_ENDPOINTS = {
  EXCHANGES: '/api/exchanges',
  LATENCY: '/api/latency',
  HISTORICAL: '/api/historical',
  REGIONS: '/api/regions',
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  WEBGL_NOT_SUPPORTED: 'WebGL is not supported in your browser. Please use a modern browser.',
  NETWORK_ERROR: 'Network error occurred. Please check your connection.',
  DATA_LOAD_ERROR: 'Failed to load data. Please try again.',
  PERFORMANCE_WARNING: 'Performance is degraded. Consider reducing visual effects.',
} as const;