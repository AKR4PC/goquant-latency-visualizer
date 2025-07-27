/**
 * Cloud provider configurations with visual styling properties
 */

import { CloudProvider } from '@/types';

export interface CloudProviderConfig {
  name: CloudProvider;
  displayName: string;
  color: {
    primary: string;
    secondary: string;
    accent: string;
  };
  logo: string;
  markerGeometry: 'sphere' | 'box' | 'octahedron';
  scale: number;
  opacity: number;
  glowColor: string;
  regions: string[];
}

export const CLOUD_PROVIDER_CONFIGS: Record<CloudProvider, CloudProviderConfig> = {
  AWS: {
    name: 'AWS',
    displayName: 'Amazon Web Services',
    color: {
      primary: '#FF9900',
      secondary: '#232F3E',
      accent: '#FF9900',
    },
    logo: '/logos/aws.svg',
    markerGeometry: 'box',
    scale: 1.0,
    opacity: 0.9,
    glowColor: '#FF9900',
    regions: [
      'us-east-1',
      'us-west-2',
      'eu-west-1',
      'ap-southeast-1',
      'ap-northeast-1',
    ],
  },
  GCP: {
    name: 'GCP',
    displayName: 'Google Cloud Platform',
    color: {
      primary: '#4285F4',
      secondary: '#34A853',
      accent: '#EA4335',
    },
    logo: '/logos/gcp.svg',
    markerGeometry: 'sphere',
    scale: 1.1,
    opacity: 0.85,
    glowColor: '#4285F4',
    regions: [
      'us-central1',
      'us-west1',
      'europe-west1',
      'asia-southeast1',
      'asia-northeast1',
      'asia-east1',
    ],
  },
  Azure: {
    name: 'Azure',
    displayName: 'Microsoft Azure',
    color: {
      primary: '#0078D4',
      secondary: '#005A9F',
      accent: '#40E0D0',
    },
    logo: '/logos/azure.svg',
    markerGeometry: 'octahedron',
    scale: 0.9,
    opacity: 0.88,
    glowColor: '#0078D4',
    regions: [
      'eastus',
      'westus2',
      'westeurope',
      'southeastasia',
      'japaneast',
    ],
  },
};

/**
 * Get cloud provider configuration by name
 * @param provider Cloud provider name
 * @returns Provider configuration
 */
export function getProviderConfig(provider: CloudProvider): CloudProviderConfig {
  return CLOUD_PROVIDER_CONFIGS[provider];
}

/**
 * Get all cloud provider configurations
 * @returns Array of all provider configurations
 */
export function getAllProviderConfigs(): CloudProviderConfig[] {
  return Object.values(CLOUD_PROVIDER_CONFIGS);
}

/**
 * Get provider color by name
 * @param provider Cloud provider name
 * @returns Primary color for the provider
 */
export function getProviderColor(provider: CloudProvider): string {
  return CLOUD_PROVIDER_CONFIGS[provider].color.primary;
}

/**
 * Get provider marker geometry by name
 * @param provider Cloud provider name
 * @returns Geometry type for markers
 */
export function getProviderGeometry(provider: CloudProvider): 'sphere' | 'box' | 'octahedron' {
  return CLOUD_PROVIDER_CONFIGS[provider].markerGeometry;
}

/**
 * Latency threshold configurations
 */
export const LATENCY_THRESHOLDS = {
  LOW: 50,      // < 50ms - Green
  MEDIUM: 150,  // 50-150ms - Yellow
  HIGH: 300,    // 150-300ms - Orange
  CRITICAL: 500, // > 300ms - Red
} as const;

/**
 * Latency color mapping
 */
export const LATENCY_COLORS = {
  LOW: '#10B981',      // Green
  MEDIUM: '#F59E0B',   // Yellow
  HIGH: '#F97316',     // Orange
  CRITICAL: '#EF4444', // Red
} as const;

/**
 * Performance target configurations
 */
export const PERFORMANCE_TARGETS = {
  TARGET_FPS: {
    DESKTOP: 60,
    MOBILE: 30,
  },
  MEMORY_LIMITS: {
    TEXTURES_MB: 256,
    GEOMETRIES_MB: 128,
    TOTAL_MB: 512,
  },
  RENDER_LIMITS: {
    MAX_MARKERS: 1000,
    MAX_CONNECTIONS: 500,
    MAX_PARTICLES: 10000,
  },
} as const;

/**
 * Animation and visual effect configurations
 */
export const VISUAL_CONFIGS = {
  EARTH: {
    RADIUS: 120, // Bigger globe
    SEGMENTS: 64,
    ROTATION_SPEED: 0.001,
  },
  MARKERS: {
    BASE_SIZE: 2,
    HOVER_SCALE: 1.5,
    PULSE_SPEED: 2,
    GLOW_INTENSITY: 0.3,
  },
  CONNECTIONS: {
    BASE_WIDTH: 0.5,
    PULSE_WIDTH: 2,
    ANIMATION_SPEED: 1,
    OPACITY: 0.7,
  },
  PARTICLES: {
    COUNT: 100,
    SIZE: 0.1,
    SPEED: 0.5,
    LIFETIME: 3000,
  },
} as const;

/**
 * Get latency status based on value
 * @param latency Latency value in milliseconds
 * @returns Status string
 */
export function getLatencyStatus(latency: number): 'low' | 'medium' | 'high' | 'critical' {
  if (latency < LATENCY_THRESHOLDS.LOW) return 'low';
  if (latency < LATENCY_THRESHOLDS.MEDIUM) return 'medium';
  if (latency < LATENCY_THRESHOLDS.HIGH) return 'high';
  return 'critical';
}

/**
 * Get latency color based on value
 * @param latency Latency value in milliseconds
 * @returns Color hex string
 */
export function getLatencyColor(latency: number): string {
  const status = getLatencyStatus(latency);
  switch (status) {
    case 'low': return LATENCY_COLORS.LOW;
    case 'medium': return LATENCY_COLORS.MEDIUM;
    case 'high': return LATENCY_COLORS.HIGH;
    case 'critical': return LATENCY_COLORS.CRITICAL;
    default: return LATENCY_COLORS.MEDIUM;
  }
}