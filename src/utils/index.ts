/**
 * Utility functions exports
 */

// Coordinate utilities
export {
  EARTH_RADIUS,
  latLngToVector3,
  coordinatesToVector3,
  vector3ToLatLng,
  calculateDistance,
  generateGreatCirclePath,
  validateCoordinates,
  normalizeLongitude,
  clampLatitude,
} from './coordinates';

// Validation utilities
export {
  validateExchange,
  validateCloudRegion,
  validateLatencyData,
  sanitizeExchange,
  sanitizeCloudRegion,
  validateExchanges,
  validateCloudRegions,
} from './validation';