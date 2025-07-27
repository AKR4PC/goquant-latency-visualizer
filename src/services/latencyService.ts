/**
 * Latency data generation and simulation service
 */

import { LatencyData, HistoricalLatencyData, NetworkEvent, Exchange, CloudRegion } from '@/types';
import { calculateDistance } from '@/utils/coordinates';
import { getLatencyStatus } from '@/data/cloudProviders';

/**
 * Generate realistic latency based on geographic distance
 * @param from Source exchange
 * @param to Target exchange or region
 * @returns Latency in milliseconds
 */
export function calculateRealisticLatency(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): number {
  const distance = calculateDistance(from, to);
  
  // Base latency calculation: ~0.1ms per 15km (speed of light in fiber)
  const baseLatency = (distance / 15) * 0.1;
  
  // Add routing overhead (20-50% increase)
  const routingOverhead = baseLatency * (0.2 + Math.random() * 0.3);
  
  // Add network congestion (0-30% increase)
  const congestionFactor = Math.random() * 0.3;
  
  // Add processing delays (1-5ms)
  const processingDelay = 1 + Math.random() * 4;
  
  const totalLatency = baseLatency + routingOverhead + (baseLatency * congestionFactor) + processingDelay;
  
  // Add some randomness for realism
  const variance = totalLatency * 0.1 * (Math.random() - 0.5);
  
  return Math.max(1, Math.round(totalLatency + variance));
}

/**
 * Generate packet loss percentage based on latency and distance
 * @param latency Latency in milliseconds
 * @param distance Distance in kilometers
 * @returns Packet loss percentage
 */
export function calculatePacketLoss(latency: number, distance: number): number {
  // Base packet loss increases with distance and latency
  let packetLoss = (distance / 10000) * 0.1; // 0.1% per 10,000km
  
  // Higher latency indicates network issues
  if (latency > 200) {
    packetLoss += (latency - 200) / 1000; // Additional loss for high latency
  }
  
  // Add random network conditions
  packetLoss += Math.random() * 0.2;
  
  return Math.max(0, Math.min(5, Number(packetLoss.toFixed(3)))); // Cap at 5%
}

/**
 * Generate jitter based on latency
 * @param latency Base latency in milliseconds
 * @returns Jitter in milliseconds
 */
export function calculateJitter(latency: number): number {
  // Jitter is typically 5-15% of latency
  const baseJitter = latency * (0.05 + Math.random() * 0.1);
  
  // Add random spikes
  const spike = Math.random() < 0.1 ? Math.random() * 10 : 0;
  
  return Math.max(0.1, Number((baseJitter + spike).toFixed(2)));
}

/**
 * Generate current latency data between exchanges
 * @param exchanges Array of exchanges
 * @param regions Array of cloud regions
 * @returns Array of current latency data
 */
export function generateCurrentLatencyData(
  exchanges: Exchange[],
  regions: CloudRegion[]
): LatencyData[] {
  const latencyData: LatencyData[] = [];
  const timestamp = new Date();

  // Generate exchange-to-exchange latencies
  for (let i = 0; i < exchanges.length; i++) {
    for (let j = i + 1; j < exchanges.length; j++) {
      const from = exchanges[i];
      const to = exchanges[j];
      
      const latency = calculateRealisticLatency(from.location, to.location);
      const distance = calculateDistance(from.location, to.location);
      const packetLoss = calculatePacketLoss(latency, distance);
      const jitter = calculateJitter(latency);
      
      latencyData.push({
        from: from.id,
        to: to.id,
        latency,
        timestamp,
        status: getLatencyStatus(latency),
        packetLoss,
        jitter,
        route: [from.location, to.location],
      });
    }
  }

  // Generate exchange-to-region latencies
  exchanges.forEach(exchange => {
    regions.forEach(region => {
      // Only generate data for different providers or distant regions
      if (exchange.cloudProvider !== region.provider || 
          calculateDistance(exchange.location, region.location) > 1000) {
        
        const latency = calculateRealisticLatency(exchange.location, region.location);
        const distance = calculateDistance(exchange.location, region.location);
        const packetLoss = calculatePacketLoss(latency, distance);
        const jitter = calculateJitter(latency);
        
        latencyData.push({
          from: exchange.id,
          to: region.id,
          latency,
          timestamp,
          status: getLatencyStatus(latency),
          packetLoss,
          jitter,
          route: [exchange.location, region.location],
        });
      }
    });
  });

  return latencyData;
}

/**
 * Generate historical latency data with realistic patterns
 * @param exchangePairs Array of exchange pair identifiers
 * @param timeRange Time range for historical data
 * @param dataPoints Number of data points to generate
 * @returns Array of historical latency data
 */
export function generateHistoricalLatencyData(
  exchangePairs: string[],
  timeRange: '1h' | '24h' | '7d' | '30d',
  dataPoints: number = 100
): HistoricalLatencyData[] {
  const historicalData: HistoricalLatencyData[] = [];
  
  // Time range mappings
  const timeRangeMs = {
    '1h': 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  };
  
  const totalTime = timeRangeMs[timeRange];
  const interval = totalTime / dataPoints;
  const now = Date.now();
  
  exchangePairs.forEach(pair => {
    // Generate base latency for this pair
    const baseLatency = 50 + Math.random() * 200; // 50-250ms base
    
    for (let i = 0; i < dataPoints; i++) {
      const timestamp = new Date(now - totalTime + (i * interval));
      
      // Add daily patterns (higher latency during peak hours)
      const hour = timestamp.getHours();
      const dailyMultiplier = 1 + (Math.sin((hour - 6) * Math.PI / 12) * 0.2);
      
      // Add weekly patterns (higher latency on weekdays)
      const dayOfWeek = timestamp.getDay();
      const weeklyMultiplier = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1.1 : 0.9;
      
      // Add random variations
      const randomVariation = 0.8 + Math.random() * 0.4; // ±20% variation
      
      // Occasional spikes (5% chance)
      const spike = Math.random() < 0.05 ? 1.5 + Math.random() : 1;
      
      const latency = Math.round(
        baseLatency * dailyMultiplier * weeklyMultiplier * randomVariation * spike
      );
      
      const packetLoss = calculatePacketLoss(latency, 5000); // Assume 5000km average
      const jitter = calculateJitter(latency);
      
      // Simulate trading volume (higher during market hours)
      const volume = Math.random() * 1000000 * dailyMultiplier;
      
      historicalData.push({
        timestamp,
        exchangePair: pair,
        latency,
        packetLoss,
        jitter,
        volume,
      });
    }
  });
  
  return historicalData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

/**
 * Generate network events (congestion, maintenance, outages)
 * @param exchanges Array of exchanges
 * @param regions Array of cloud regions
 * @returns Array of network events
 */
export function generateNetworkEvents(
  exchanges: Exchange[]
): NetworkEvent[] {
  const events: NetworkEvent[] = [];
  const now = new Date();
  
  // Generate some historical events
  for (let i = 0; i < 10; i++) {
    const eventTime = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    const eventTypes: NetworkEvent['type'][] = ['congestion', 'maintenance', 'outage'];
    const severities: NetworkEvent['severity'][] = ['low', 'medium', 'high'];
    
    const type = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    
    // Select affected exchanges
    const affectedCount = Math.ceil(Math.random() * 3);
    const affectedExchanges = exchanges
      .sort(() => Math.random() - 0.5)
      .slice(0, affectedCount)
      .map(e => e.id);
    
    // Event duration based on type and severity
    const baseDuration = {
      congestion: 30 * 60 * 1000, // 30 minutes
      maintenance: 2 * 60 * 60 * 1000, // 2 hours
      outage: 45 * 60 * 1000, // 45 minutes
    };
    
    const severityMultiplier = { low: 0.5, medium: 1, high: 2 };
    const duration = baseDuration[type] * severityMultiplier[severity];
    
    const descriptions = {
      congestion: `Network congestion detected affecting ${affectedExchanges.length} exchange(s)`,
      maintenance: `Scheduled maintenance window for ${affectedExchanges.length} exchange(s)`,
      outage: `Service outage reported for ${affectedExchanges.length} exchange(s)`,
    };
    
    events.push({
      id: `event-${i}`,
      type,
      affectedExchanges,
      startTime: eventTime,
      endTime: new Date(eventTime.getTime() + duration),
      severity,
      description: descriptions[type],
    });
  }
  
  return events.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
}

/**
 * Real-time data stream simulation
 */
export class LatencyDataStream {
  private subscribers: Array<(data: LatencyData[]) => void> = [];
  private intervalId: NodeJS.Timeout | null = null;
  private exchanges: Exchange[] = [];
  private regions: CloudRegion[] = [];
  
  constructor(exchanges: Exchange[], regions: CloudRegion[]) {
    this.exchanges = exchanges;
    this.regions = regions;
  }
  
  /**
   * Subscribe to real-time latency updates
   * @param callback Function to call with new data
   * @returns Unsubscribe function
   */
  subscribe(callback: (data: LatencyData[]) => void): () => void {
    this.subscribers.push(callback);
    
    // Start streaming if this is the first subscriber
    if (this.subscribers.length === 1) {
      this.startStreaming();
    }
    
    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
      
      // Stop streaming if no more subscribers
      if (this.subscribers.length === 0) {
        this.stopStreaming();
      }
    };
  }
  
  private startStreaming(): void {
    // Update every 5 seconds
    this.intervalId = setInterval(() => {
      const newData = generateCurrentLatencyData(this.exchanges, this.regions);
      this.subscribers.forEach(callback => callback(newData));
    }, 5000);
    
    // Send initial data
    const initialData = generateCurrentLatencyData(this.exchanges, this.regions);
    this.subscribers.forEach(callback => callback(initialData));
  }
  
  private stopStreaming(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  
  /**
   * Update exchanges and regions for the stream
   * @param exchanges New exchanges array
   * @param regions New regions array
   */
  updateSources(exchanges: Exchange[], regions: CloudRegion[]): void {
    this.exchanges = exchanges;
    this.regions = regions;
  }
}

/**
 * Data validation and sanitization for latency data
 * @param data Raw latency data
 * @returns Sanitized latency data
 */
export function sanitizeLatencyData(data: unknown): LatencyData | null {
  try {
    const d = data as Record<string, unknown>;
    
    if (!d.from || !d.to || typeof d.latency !== 'number') {
      return null;
    }
    
    return {
      from: String(d.from),
      to: String(d.to),
      latency: Math.max(0, Number(d.latency)),
      timestamp: d.timestamp instanceof Date ? d.timestamp : new Date(),
      status: getLatencyStatus(Number(d.latency)),
      packetLoss: typeof d.packetLoss === 'number' ? Math.max(0, Math.min(100, d.packetLoss)) : undefined,
      jitter: typeof d.jitter === 'number' ? Math.max(0, d.jitter) : undefined,
      route: Array.isArray(d.route) ? d.route as { lat: number; lng: number }[] : [],
    };
  } catch (error) {
    console.error('Error sanitizing latency data:', error);
    return null;
  }
}