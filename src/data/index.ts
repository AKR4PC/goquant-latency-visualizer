/**
 * Data module exports
 */

// Exchange data
export {
  EXCHANGES,
  getExchangeById,
  getExchangesByProvider,
  getExchangesByRegion,
  EXCHANGE_VALIDATION,
} from './exchanges';

// Cloud region data
export {
  CLOUD_REGIONS,
  getRegionById,
  getRegionsByProvider,
  getRegionByCode,
  REGION_VALIDATION,
} from './regions';

// Cloud provider configurations
export {
  CLOUD_PROVIDER_CONFIGS,
  getProviderConfig,
  getAllProviderConfigs,
  getProviderColor,
  getProviderGeometry,
  LATENCY_THRESHOLDS,
  LATENCY_COLORS,
  PERFORMANCE_TARGETS,
  VISUAL_CONFIGS,
  getLatencyStatus,
  getLatencyColor,
} from './cloudProviders';

// Re-export types for convenience
export type { CloudProviderConfig } from './cloudProviders';