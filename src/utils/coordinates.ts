/**
 * Coordinate conversion utilities for lat/lng to 3D positions
 */

import { Vector3 } from 'three';
import { Coordinates } from '@/types';

// Earth radius in the 3D scene (matches the Earth component)
export const EARTH_RADIUS = 120;

/**
 * Convert latitude and longitude to 3D Cartesian coordinates
 * @param lat Latitude in degrees
 * @param lng Longitude in degrees
 * @param radius Radius of the sphere (default: EARTH_RADIUS)
 * @returns Vector3 position in 3D space
 */
export function latLngToVector3(lat: number, lng: number, radius: number = EARTH_RADIUS): Vector3 {
  // Convert degrees to radians
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  // Convert spherical coordinates to Cartesian
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new Vector3(x, y, z);
}

/**
 * Convert Coordinates interface to Vector3
 * @param coordinates Coordinates object with lat/lng
 * @param radius Radius of the sphere (default: EARTH_RADIUS)
 * @returns Vector3 position in 3D space
 */
export function coordinatesToVector3(coordinates: Coordinates, radius: number = EARTH_RADIUS): Vector3 {
  return latLngToVector3(coordinates.lat, coordinates.lng, radius);
}

/**
 * Convert Vector3 back to latitude and longitude
 * @param vector Vector3 position in 3D space
 * @param radius Radius of the sphere (default: EARTH_RADIUS)
 * @returns Coordinates object with lat/lng
 */
export function vector3ToLatLng(vector: Vector3, radius: number = EARTH_RADIUS): Coordinates {
  const normalizedVector = vector.clone().normalize().multiplyScalar(radius);
  
  const lat = 90 - (Math.acos(normalizedVector.y / radius) * 180 / Math.PI);
  const lng = ((Math.atan2(normalizedVector.z, -normalizedVector.x) * 180 / Math.PI) - 180);
  
  return { lat, lng };
}

/**
 * Calculate the great circle distance between two coordinates
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generate intermediate points along a great circle path
 * @param start Starting coordinates
 * @param end Ending coordinates
 * @param segments Number of intermediate points
 * @returns Array of coordinates representing the path
 */
export function generateGreatCirclePath(start: Coordinates, end: Coordinates, segments: number = 50): Coordinates[] {
  const path: Coordinates[] = [];
  
  for (let i = 0; i <= segments; i++) {
    const fraction = i / segments;
    const lat1 = start.lat * Math.PI / 180;
    const lng1 = start.lng * Math.PI / 180;
    const lat2 = end.lat * Math.PI / 180;
    const lng2 = end.lng * Math.PI / 180;
    
    const d = Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1));
    
    if (d === 0) {
      path.push({ lat: start.lat, lng: start.lng });
      continue;
    }
    
    const a = Math.sin((1 - fraction) * d) / Math.sin(d);
    const b = Math.sin(fraction * d) / Math.sin(d);
    
    const x = a * Math.cos(lat1) * Math.cos(lng1) + b * Math.cos(lat2) * Math.cos(lng2);
    const y = a * Math.cos(lat1) * Math.sin(lng1) + b * Math.cos(lat2) * Math.sin(lng2);
    const z = a * Math.sin(lat1) + b * Math.sin(lat2);
    
    const lat = Math.atan2(z, Math.sqrt(x * x + y * y)) * 180 / Math.PI;
    const lng = Math.atan2(y, x) * 180 / Math.PI;
    
    path.push({ lat, lng });
  }
  
  return path;
}

/**
 * Check if coordinates are valid
 * @param coordinates Coordinates to validate
 * @returns True if valid, false otherwise
 */
export function validateCoordinates(coordinates: Coordinates): boolean {
  return (
    coordinates.lat >= -90 && 
    coordinates.lat <= 90 && 
    coordinates.lng >= -180 && 
    coordinates.lng <= 180
  );
}

/**
 * Normalize longitude to be within -180 to 180 range
 * @param lng Longitude value
 * @returns Normalized longitude
 */
export function normalizeLongitude(lng: number): number {
  while (lng > 180) lng -= 360;
  while (lng < -180) lng += 360;
  return lng;
}

/**
 * Clamp latitude to be within -90 to 90 range
 * @param lat Latitude value
 * @returns Clamped latitude
 */
export function clampLatitude(lat: number): number {
  return Math.max(-90, Math.min(90, lat));
}