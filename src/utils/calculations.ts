/**
 * Utility functions for calculations and coordinate conversions
 */

import { Vector3 } from 'three';
import { Coordinates } from '@/types';
import { SCENE_CONFIG } from './constants';

/**
 * Convert latitude and longitude to 3D coordinates on a sphere
 * @param lat Latitude in degrees
 * @param lng Longitude in degrees
 * @param radius Sphere radius (default: EARTH_RADIUS)
 * @returns Vector3 position
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = SCENE_CONFIG.EARTH_RADIUS
): Vector3 {
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
 * Calculate the great circle distance between two coordinates
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in kilometers
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.lat - coord1.lat);
  const dLng = toRadians(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.lat)) * Math.cos(toRadians(coord2.lat)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculate realistic latency based on geographic distance
 * @param distance Distance in kilometers
 * @returns Latency in milliseconds
 */
export function calculateLatency(distance: number): number {
  // Base latency calculation: distance / speed of light factor + random network overhead
  const baseLatency = distance / 200; // Approximate speed of light factor
  const networkOverhead = Math.random() * 40 + 10; // 10-50ms random overhead
  
  return Math.round(baseLatency + networkOverhead);
}

/**
 * Generate intermediate points along a great circle path
 * @param start Starting coordinates
 * @param end Ending coordinates
 * @param segments Number of segments
 * @returns Array of coordinates along the path
 */
export function generateGreatCirclePath(
  start: Coordinates,
  end: Coordinates,
  segments: number = 20
): Coordinates[] {
  const path: Coordinates[] = [];
  
  for (let i = 0; i <= segments; i++) {
    const fraction = i / segments;
    const coord = interpolateGreatCircle(start, end, fraction);
    path.push(coord);
  }
  
  return path;
}

/**
 * Interpolate between two coordinates along a great circle
 * @param start Starting coordinates
 * @param end Ending coordinates
 * @param fraction Interpolation fraction (0-1)
 * @returns Interpolated coordinates
 */
function interpolateGreatCircle(
  start: Coordinates,
  end: Coordinates,
  fraction: number
): Coordinates {
  const startLat = toRadians(start.lat);
  const startLng = toRadians(start.lng);
  const endLat = toRadians(end.lat);
  const endLng = toRadians(end.lng);
  
  const d = 2 * Math.asin(Math.sqrt(
    Math.pow(Math.sin((startLat - endLat) / 2), 2) +
    Math.cos(startLat) * Math.cos(endLat) * Math.pow(Math.sin((startLng - endLng) / 2), 2)
  ));
  
  const a = Math.sin((1 - fraction) * d) / Math.sin(d);
  const b = Math.sin(fraction * d) / Math.sin(d);
  
  const x = a * Math.cos(startLat) * Math.cos(startLng) + b * Math.cos(endLat) * Math.cos(endLng);
  const y = a * Math.cos(startLat) * Math.sin(startLng) + b * Math.cos(endLat) * Math.sin(endLng);
  const z = a * Math.sin(startLat) + b * Math.sin(endLat);
  
  const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
  const lng = Math.atan2(y, x);
  
  return {
    lat: toDegrees(lat),
    lng: toDegrees(lng),
  };
}

/**
 * Convert degrees to radians
 */
function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 */
function toDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Determine latency status based on value
 * @param latency Latency in milliseconds
 * @returns Latency status
 */
export function getLatencyStatus(latency: number): 'low' | 'medium' | 'high' {
  if (latency < 50) return 'low';
  if (latency < 150) return 'medium';
  return 'high';
}

/**
 * Get color for latency value
 * @param latency Latency in milliseconds
 * @returns Hex color string
 */
export function getLatencyColor(latency: number): string {
  const status = getLatencyStatus(latency);
  switch (status) {
    case 'low': return '#10B981';
    case 'medium': return '#F59E0B';
    case 'high': return '#EF4444';
  }
}