/**
 * Utility functions for formatting and styling
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine class names with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format latency value with appropriate units
 */
export function formatLatency(latency: number): string {
  if (latency < 1000) {
    return `${Math.round(latency)}ms`;
  }
  return `${(latency / 1000).toFixed(1)}s`;
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value * 100) / 100}%`;
}

/**
 * Format large numbers with appropriate suffixes
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

/**
 * Format timestamp to relative time
 */
export function formatRelativeTime(timestamp: Date): string {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return `${seconds}s ago`;
}

/**
 * Format bytes to human readable format
 */
export function formatBytes(bytes: number): string {
  const sizes = ['B', 'KB', 'MB', 'GB'];
  if (bytes === 0) return '0 B';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
}

/**
 * Get status color class based on status
 */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'online':
    case 'healthy':
    case 'low':
      return 'text-success';
    case 'warning':
    case 'medium':
    case 'maintenance':
      return 'text-warning';
    case 'error':
    case 'high':
    case 'offline':
    case 'critical':
      return 'text-danger';
    default:
      return 'text-foreground/60';
  }
}

/**
 * Get status background color class
 */
export function getStatusBgColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'online':
    case 'healthy':
    case 'low':
      return 'bg-success';
    case 'warning':
    case 'medium':
    case 'maintenance':
      return 'bg-warning';
    case 'error':
    case 'high':
    case 'offline':
    case 'critical':
      return 'bg-danger';
    default:
      return 'bg-foreground/20';
  }
}