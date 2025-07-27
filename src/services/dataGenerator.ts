/**
 * Data generation service for creating realistic mock data
 */

import { 
  LatencyData, 
  HistoricalLatencyData, 
  NetworkEvent, 
  Exchange,
  TimeRange 
} from '@/types';
import { EXCHANGES } from '@/data/exchanges';
import { 
  calculateDistance, 
  calculateLatency, 
  getLatencyStatus,
  generateGreatCirclePath 
} from '@/utils/calculations';
import { TIME_RANGES } from '@/utils/constants';

export class DataGenerator {
  private networkEvents: NetworkEvent[] = [];
  private baseLatencyMultiplier = 1;

  /**
   * Generate realistic real-time latency data between all exchanges
   */
  generateRealtimeLatencyData(): LatencyData[] {
    const latencyData: LatencyData[] = [];
    const now = new Date();

    // Generate latency data for all exchange pairs
    for (let i = 0; i < EXCHANGES.length; i++) {
      for (let j = i + 1; j < EXCHANGES.length; j++) {
        const fromExchange = EXCHANGES[i];
        const toExchange = EXCHANGES[j];
        
        // Calculate base latency from geographic distance
        const distance = calculateDistance(
          fromExchange.location,
          toExchange.location
        );
        
        let baseLatency = calculateLatency(distance);
        
        // Apply network events effects
        baseLatency = this.applyNetworkEvents(baseLatency, fromExchange, toExchange);
        
        // Add some realistic variation
        const variation = (Math.random() - 0.5) * 20; // ±10ms variation
        const finalLatency = Math.max(1, Math.round(baseLatency + variation));
        
        // Generate route path
        const route = generateGreatCirclePath(
          fromExchange.location,
          toExchange.location,
          10
        );

        // Create bidirectional latency data
        latencyData.push({
          from: fromExchange.id,
          to: toExchange.id,
          latency: finalLatency,
          timestamp: now,
          status: getLatencyStatus(finalLatency),
          packetLoss: this.generatePacketLoss(),
          jitter: this.generateJitter(finalLatency),
          route,
        });

        // Add reverse direction with slight variation
        const reverseLatency = Math.max(1, Math.round(finalLatency + (Math.random() - 0.5) * 10));
        latencyData.push({
          from: toExchange.id,
          to: fromExchange.id,
          latency: reverseLatency,
          timestamp: now,
          status: getLatencyStatus(reverseLatency),
          packetLoss: this.generatePacketLoss(),
          jitter: this.generateJitter(reverseLatency),
          route: [...route].reverse(),
        });
      }
    }

    return latencyData;
  }  /**
  
 * Generate historical latency data with realistic patterns
   */
  generateHistoricalData(timeRange: TimeRange): HistoricalLatencyData[] {
    const historicalData: HistoricalLatencyData[] = [];
    const config = TIME_RANGES[timeRange];
    const now = new Date();
    const startTime = new Date(now.getTime() - config.milliseconds);
    const interval = config.milliseconds / config.dataPoints;

    // Generate data for a subset of exchange pairs to keep it manageable
    const popularPairs = [
      { from: 'binance-singapore', to: 'coinbase-sanfrancisco' },
      { from: 'okx-hongkong', to: 'kraken-london' },
      { from: 'bybit-tokyo', to: 'deribit-amsterdam' },
      { from: 'binance-singapore', to: 'okx-hongkong' },
      { from: 'coinbase-newyork', to: 'bitfinex-london' },
    ];

    for (const pair of popularPairs) {
      const fromExchange = EXCHANGES.find(e => e.id === pair.from);
      const toExchange = EXCHANGES.find(e => e.id === pair.to);
      
      if (!fromExchange || !toExchange) continue;

      const baseDistance = calculateDistance(
        fromExchange.location,
        toExchange.location
      );
      const baseLatency = calculateLatency(baseDistance);

      for (let i = 0; i < config.dataPoints; i++) {
        const timestamp = new Date(startTime.getTime() + i * interval);
        
        // Create realistic patterns
        const hourOfDay = timestamp.getHours();
        const dayOfWeek = timestamp.getDay();
        
        // Business hours effect (higher latency during peak trading)
        const businessHoursMultiplier = this.getBusinessHoursMultiplier(hourOfDay);
        
        // Weekend effect (lower latency on weekends)
        const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.8 : 1.0;
        
        // Random network congestion events
        const congestionMultiplier = Math.random() < 0.05 ? 1.5 + Math.random() : 1.0;
        
        // Sine wave for daily patterns
        const dailyPattern = 1 + 0.2 * Math.sin((hourOfDay / 24) * 2 * Math.PI);
        
        const finalLatency = Math.round(
          baseLatency * 
          businessHoursMultiplier * 
          weekendMultiplier * 
          congestionMultiplier * 
          dailyPattern
        );

        historicalData.push({
          timestamp,
          exchangePair: `${pair.from}-${pair.to}`,
          latency: finalLatency,
          packetLoss: this.generatePacketLoss(),
          jitter: this.generateJitter(finalLatency),
          volume: this.generateTradingVolume(hourOfDay, dayOfWeek),
        });
      }
    }

    return historicalData.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }

  /**
   * Simulate network events that affect latency
   */
  simulateNetworkEvents(): NetworkEvent[] {
    const events: NetworkEvent[] = [];
    const now = new Date();

    // Generate some random network events
    const eventTypes = ['congestion', 'maintenance', 'outage'] as const;
    const severities = ['low', 'medium', 'high'] as const;

    for (let i = 0; i < 5; i++) {
      const startTime = new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000);
      const duration = Math.random() * 4 * 60 * 60 * 1000; // Up to 4 hours
      const endTime = new Date(startTime.getTime() + duration);

      const affectedExchanges = EXCHANGES
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 1)
        .map(e => e.id);

      events.push({
        id: `event-${i}`,
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        affectedExchanges,
        startTime,
        endTime: Math.random() > 0.3 ? endTime : undefined,
        severity: severities[Math.floor(Math.random() * severities.length)],
        description: this.generateEventDescription(),
      });
    }

    this.networkEvents = events;
    return events;
  }

  /**
   * Apply network events to latency calculations
   */
  private applyNetworkEvents(
    baseLatency: number, 
    fromExchange: Exchange, 
    toExchange: Exchange
  ): number {
    let multiplier = 1;
    const now = new Date();

    for (const event of this.networkEvents) {
      if (event.endTime && now > event.endTime) continue;
      if (now < event.startTime) continue;

      const isAffected = 
        event.affectedExchanges.includes(fromExchange.id) ||
        event.affectedExchanges.includes(toExchange.id);

      if (isAffected) {
        switch (event.type) {
          case 'congestion':
            multiplier *= event.severity === 'high' ? 2.0 : event.severity === 'medium' ? 1.5 : 1.2;
            break;
          case 'maintenance':
            multiplier *= event.severity === 'high' ? 3.0 : event.severity === 'medium' ? 2.0 : 1.5;
            break;
          case 'outage':
            multiplier *= 5.0; // Severe impact
            break;
        }
      }
    }

    return baseLatency * multiplier;
  }

  /**
   * Generate realistic packet loss percentage
   */
  private generatePacketLoss(): number {
    // Most connections have very low packet loss
    if (Math.random() < 0.8) {
      return Math.random() * 0.1; // 0-0.1%
    } else if (Math.random() < 0.95) {
      return Math.random() * 1; // 0-1%
    } else {
      return Math.random() * 5; // 0-5% for problematic connections
    }
  }

  /**
   * Generate realistic jitter based on latency
   */
  private generateJitter(latency: number): number {
    // Jitter is typically 5-15% of latency
    const baseJitter = latency * (0.05 + Math.random() * 0.1);
    return Math.round(baseJitter * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Generate trading volume data
   */
  private generateTradingVolume(hour: number, dayOfWeek: number): number {
    // Higher volume during business hours and weekdays
    const businessHoursMultiplier = this.getBusinessHoursMultiplier(hour);
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1.0;
    
    const baseVolume = 1000000; // $1M base volume
    return Math.round(baseVolume * businessHoursMultiplier * weekendMultiplier * (0.5 + Math.random()));
  }

  /**
   * Get business hours multiplier for latency/volume
   */
  private getBusinessHoursMultiplier(hour: number): number {
    // Peak hours: 8-10 AM and 2-4 PM UTC (major trading sessions)
    if ((hour >= 8 && hour <= 10) || (hour >= 14 && hour <= 16)) {
      return 1.3;
    }
    // Business hours: 6 AM - 8 PM UTC
    if (hour >= 6 && hour <= 20) {
      return 1.1;
    }
    // Off hours
    return 0.9;
  }

  /**
   * Generate event descriptions
   */
  private generateEventDescription(): string {
    const descriptions = [
      'Network congestion due to high trading volume',
      'Scheduled maintenance window',
      'Fiber optic cable issue affecting connectivity',
      'DDoS attack mitigation in progress',
      'Data center power fluctuation',
      'ISP routing optimization',
      'Cloud provider infrastructure update',
    ];
    
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }
}