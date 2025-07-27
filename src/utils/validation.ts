/**
 * Data validation and sanitization utilities
 */

import { Exchange, CloudRegion, CloudProvider } from '@/types';
import { validateCoordinates } from './coordinates';

/**
 * Validate exchange data
 * @param exchange Exchange object to validate
 * @returns Validation result with errors if any
 */
export function validateExchange(exchange: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const ex = exchange as Record<string, unknown>;

  // Check required fields
  if (!ex.id || typeof ex.id !== 'string') {
    errors.push('Exchange ID is required and must be a string');
  }

  if (!ex.name || typeof ex.name !== 'string') {
    errors.push('Exchange name is required and must be a string');
  }

  // Validate location
  if (!ex.location) {
    errors.push('Exchange location is required');
  } else {
    const location = ex.location as Record<string, unknown>;
    if (!validateCoordinates({ lat: location.lat as number, lng: location.lng as number })) {
      errors.push('Exchange location coordinates are invalid');
    }
    
    if (!location.city || typeof location.city !== 'string') {
      errors.push('Exchange city is required and must be a string');
    }
    
    if (!location.country || typeof location.country !== 'string') {
      errors.push('Exchange country is required and must be a string');
    }
  }

  // Validate cloud provider
  const validProviders: CloudProvider[] = ['AWS', 'GCP', 'Azure'];
  if (!validProviders.includes(ex.cloudProvider as CloudProvider)) {
    errors.push('Exchange cloud provider must be one of: AWS, GCP, Azure');
  }

  // Validate region
  if (!ex.region || typeof ex.region !== 'string') {
    errors.push('Exchange region is required and must be a string');
  }

  // Validate status
  const validStatuses = ['online', 'offline', 'maintenance'];
  if (!validStatuses.includes(ex.status as string)) {
    errors.push('Exchange status must be one of: online, offline, maintenance');
  }

  // Validate numeric fields
  if (typeof ex.serverCount !== 'number' || ex.serverCount < 0) {
    errors.push('Exchange server count must be a non-negative number');
  }

  if (typeof ex.capacity !== 'number' || ex.capacity < 0 || ex.capacity > 100) {
    errors.push('Exchange capacity must be a number between 0 and 100');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate cloud region data
 * @param region Cloud region object to validate
 * @returns Validation result with errors if any
 */
export function validateCloudRegion(region: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const reg = region as Record<string, unknown>;

  // Check required fields
  if (!reg.id || typeof reg.id !== 'string') {
    errors.push('Region ID is required and must be a string');
  }

  if (!reg.name || typeof reg.name !== 'string') {
    errors.push('Region name is required and must be a string');
  }

  if (!reg.code || typeof reg.code !== 'string') {
    errors.push('Region code is required and must be a string');
  }

  // Validate cloud provider
  const validProviders: CloudProvider[] = ['AWS', 'GCP', 'Azure'];
  if (!validProviders.includes(reg.provider as CloudProvider)) {
    errors.push('Region provider must be one of: AWS, GCP, Azure');
  }

  // Validate location
  if (!reg.location || !validateCoordinates(reg.location as { lat: number; lng: number })) {
    errors.push('Region location coordinates are invalid');
  }

  // Validate numeric fields
  if (typeof reg.serverCount !== 'number' || reg.serverCount < 0) {
    errors.push('Region server count must be a non-negative number');
  }

  if (typeof reg.capacity !== 'number' || reg.capacity < 0 || reg.capacity > 100) {
    errors.push('Region capacity must be a number between 0 and 100');
  }

  // Validate exchanges array
  if (!Array.isArray(reg.exchanges)) {
    errors.push('Region exchanges must be an array');
  } else {
    reg.exchanges.forEach((exchangeId: unknown, index: number) => {
      if (typeof exchangeId !== 'string') {
        errors.push(`Region exchange at index ${index} must be a string`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate latency data
 * @param latencyData Latency data object to validate
 * @returns Validation result with errors if any
 */
export function validateLatencyData(latencyData: unknown): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const data = latencyData as Record<string, unknown>;

  // Check required fields
  if (!data.from || typeof data.from !== 'string') {
    errors.push('Latency data "from" field is required and must be a string');
  }

  if (!data.to || typeof data.to !== 'string') {
    errors.push('Latency data "to" field is required and must be a string');
  }

  // Validate latency value
  if (typeof data.latency !== 'number' || data.latency < 0) {
    errors.push('Latency value must be a non-negative number');
  }

  // Validate timestamp
  if (!data.timestamp || !(data.timestamp instanceof Date)) {
    errors.push('Latency timestamp must be a valid Date object');
  }

  // Validate status
  const validStatuses = ['low', 'medium', 'high'];
  if (!validStatuses.includes(data.status as string)) {
    errors.push('Latency status must be one of: low, medium, high');
  }

  // Validate optional fields
  if (data.packetLoss !== undefined) {
    if (typeof data.packetLoss !== 'number' || data.packetLoss < 0 || data.packetLoss > 100) {
      errors.push('Packet loss must be a number between 0 and 100');
    }
  }

  if (data.jitter !== undefined) {
    if (typeof data.jitter !== 'number' || data.jitter < 0) {
      errors.push('Jitter must be a non-negative number');
    }
  }

  // Validate route array
  if (data.route && Array.isArray(data.route)) {
    data.route.forEach((coord: unknown, index: number) => {
      if (!validateCoordinates(coord as { lat: number; lng: number })) {
        errors.push(`Route coordinate at index ${index} is invalid`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Sanitize exchange data by removing invalid fields and applying defaults
 * @param exchange Raw exchange data
 * @returns Sanitized exchange data
 */
export function sanitizeExchange(exchange: unknown): Partial<Exchange> {
  const sanitized: Partial<Exchange> = {};
  const ex = exchange as Record<string, unknown>;

  if (ex.id && typeof ex.id === 'string') {
    sanitized.id = ex.id.trim();
  }

  if (ex.name && typeof ex.name === 'string') {
    sanitized.name = ex.name.trim();
  }

  if (ex.location) {
    const location = ex.location as Record<string, unknown>;
    sanitized.location = {
      lat: Math.max(-90, Math.min(90, Number(location.lat) || 0)),
      lng: Math.max(-180, Math.min(180, Number(location.lng) || 0)),
      city: (location.city as string)?.trim() || '',
      country: (location.country as string)?.trim() || '',
    };
  }

  const validProviders: CloudProvider[] = ['AWS', 'GCP', 'Azure'];
  if (validProviders.includes(ex.cloudProvider as CloudProvider)) {
    sanitized.cloudProvider = ex.cloudProvider as CloudProvider;
  }

  if (ex.region && typeof ex.region === 'string') {
    sanitized.region = ex.region.trim();
  }

  const validStatuses = ['online', 'offline', 'maintenance'] as const;
  if (validStatuses.includes(ex.status as typeof validStatuses[number])) {
    sanitized.status = ex.status as typeof validStatuses[number];
  } else {
    sanitized.status = 'offline';
  }

  sanitized.serverCount = Math.max(0, Number(ex.serverCount) || 0);
  sanitized.capacity = Math.max(0, Math.min(100, Number(ex.capacity) || 0));

  return sanitized;
}

/**
 * Sanitize cloud region data
 * @param region Raw region data
 * @returns Sanitized region data
 */
export function sanitizeCloudRegion(region: unknown): Partial<CloudRegion> {
  const sanitized: Partial<CloudRegion> = {};
  const reg = region as Record<string, unknown>;

  if (reg.id && typeof reg.id === 'string') {
    sanitized.id = reg.id.trim();
  }

  if (reg.name && typeof reg.name === 'string') {
    sanitized.name = reg.name.trim();
  }

  if (reg.code && typeof reg.code === 'string') {
    sanitized.code = reg.code.trim();
  }

  const validProviders: CloudProvider[] = ['AWS', 'GCP', 'Azure'];
  if (validProviders.includes(reg.provider as CloudProvider)) {
    sanitized.provider = reg.provider as CloudProvider;
  }

  if (reg.location) {
    const location = reg.location as Record<string, unknown>;
    sanitized.location = {
      lat: Math.max(-90, Math.min(90, Number(location.lat) || 0)),
      lng: Math.max(-180, Math.min(180, Number(location.lng) || 0)),
    };
  }

  sanitized.serverCount = Math.max(0, Number(reg.serverCount) || 0);
  sanitized.capacity = Math.max(0, Math.min(100, Number(reg.capacity) || 0));

  if (Array.isArray(reg.exchanges)) {
    sanitized.exchanges = reg.exchanges
      .filter((id: unknown) => typeof id === 'string')
      .map((id: unknown) => (id as string).trim());
  } else {
    sanitized.exchanges = [];
  }

  return sanitized;
}

/**
 * Batch validate an array of exchanges
 * @param exchanges Array of exchange objects
 * @returns Validation summary
 */
export function validateExchanges(exchanges: unknown[]): {
  validCount: number;
  invalidCount: number;
  errors: Array<{ index: number; errors: string[] }>;
} {
  const results = exchanges.map((exchange, index) => ({
    index,
    ...validateExchange(exchange),
  }));

  return {
    validCount: results.filter(r => r.isValid).length,
    invalidCount: results.filter(r => !r.isValid).length,
    errors: results.filter(r => !r.isValid).map(r => ({
      index: r.index,
      errors: r.errors,
    })),
  };
}

/**
 * Batch validate an array of cloud regions
 * @param regions Array of region objects
 * @returns Validation summary
 */
export function validateCloudRegions(regions: unknown[]): {
  validCount: number;
  invalidCount: number;
  errors: Array<{ index: number; errors: string[] }>;
} {
  const results = regions.map((region, index) => ({
    index,
    ...validateCloudRegion(region),
  }));

  return {
    validCount: results.filter(r => r.isValid).length,
    invalidCount: results.filter(r => !r.isValid).length,
    errors: results.filter(r => !r.isValid).map(r => ({
      index: r.index,
      errors: r.errors,
    })),
  };
}