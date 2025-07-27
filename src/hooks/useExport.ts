/**
 * Custom hook for data export functionality
 */

import { useState, useCallback } from 'react';
import { LatencyData, HistoricalLatencyData, Exchange, CloudRegion, TimeRange } from '@/types';

export interface ExportOptions {
  format: 'csv' | 'json';
  timeRange?: TimeRange;
  selectedExchanges?: string[];
  includeMetadata?: boolean;
}

export interface ExportProgress {
  isExporting: boolean;
  progress: number;
  error: string | null;
  downloadUrl: string | null;
}

export function useExport() {
  const [exportProgress, setExportProgress] = useState<ExportProgress>({
    isExporting: false,
    progress: 0,
    error: null,
    downloadUrl: null,
  });

  /**
   * Convert latency data to CSV format
   */
  const convertToCSV = useCallback((data: LatencyData[] | HistoricalLatencyData[], includeMetadata: boolean = true): string => {
    if (data.length === 0) return '';

    // Determine if it's latency data or historical data
    const isHistorical = 'exchangePair' in data[0];
    
    let headers: string[];
    let rows: string[][];

    if (isHistorical) {
      const historicalData = data as HistoricalLatencyData[];
      headers = ['Timestamp', 'Exchange Pair', 'Latency (ms)', 'Packet Loss (%)', 'Jitter (ms)', 'Volume'];
      
      rows = historicalData.map(item => [
        item.timestamp.toISOString(),
        item.exchangePair,
        item.latency.toString(),
        item.packetLoss.toString(),
        item.jitter.toString(),
        item.volume?.toString() || '0',
      ]);
    } else {
      const latencyData = data as LatencyData[];
      headers = ['From', 'To', 'Latency (ms)', 'Status', 'Packet Loss (%)', 'Jitter (ms)', 'Timestamp'];
      
      rows = latencyData.map(item => [
        item.from,
        item.to,
        item.latency.toString(),
        item.status,
        item.packetLoss?.toString() || '0',
        item.jitter?.toString() || '0',
        item.timestamp.toISOString(),
      ]);
    }

    // Add metadata if requested
    let csvContent = '';
    if (includeMetadata) {
      csvContent += `# GoQuant Latency Visualizer Export\n`;
      csvContent += `# Generated: ${new Date().toISOString()}\n`;
      csvContent += `# Data Type: ${isHistorical ? 'Historical' : 'Current'} Latency Data\n`;
      csvContent += `# Total Records: ${data.length}\n`;
      csvContent += `#\n`;
    }

    // Add headers
    csvContent += headers.join(',') + '\n';

    // Add data rows
    rows.forEach(row => {
      csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
    });

    return csvContent;
  }, []);

  /**
   * Convert data to JSON format
   */
  const convertToJSON = useCallback((
    data: LatencyData[] | HistoricalLatencyData[],
    exchanges?: Exchange[],
    regions?: CloudRegion[],
    includeMetadata: boolean = true
  ): string => {
    const exportData: Record<string, unknown> = {
      data,
    };

    if (includeMetadata) {
      exportData.metadata = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        dataType: 'exchangePair' in (data[0] || {}) ? 'historical' : 'current',
        totalRecords: data.length,
        exchanges: exchanges?.map(e => ({
          id: e.id,
          name: e.name,
          location: e.location,
          cloudProvider: e.cloudProvider,
        })),
        regions: regions?.map(r => ({
          id: r.id,
          name: r.name,
          provider: r.provider,
          location: r.location,
        })),
      };
    }

    return JSON.stringify(exportData, null, 2);
  }, []);

  /**
   * Create and download a file
   */
  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL after a delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
    return url;
  }, []);

  /**
   * Export current latency data
   */
  const exportLatencyData = useCallback(async (
    data: LatencyData[],
    options: ExportOptions,
    exchanges?: Exchange[],
    regions?: CloudRegion[]
  ): Promise<void> => {
    setExportProgress({
      isExporting: true,
      progress: 0,
      error: null,
      downloadUrl: null,
    });

    try {
      // Simulate processing time for large datasets
      const totalSteps = 4;
      let currentStep = 0;

      // Step 1: Filter data
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      let filteredData = data;
      if (options.selectedExchanges && options.selectedExchanges.length > 0) {
        filteredData = data.filter(item => 
          options.selectedExchanges!.includes(item.from) || 
          options.selectedExchanges!.includes(item.to)
        );
      }

      // Step 2: Convert data
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      let content: string;
      let filename: string;
      let mimeType: string;

      if (options.format === 'csv') {
        content = convertToCSV(filteredData, options.includeMetadata);
        filename = `latency-data-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        content = convertToJSON(filteredData, exchanges, regions, options.includeMetadata);
        filename = `latency-data-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }

      // Step 3: Create file
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      // Step 4: Download
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      const downloadUrl = downloadFile(content, filename, mimeType);

      setExportProgress({
        isExporting: false,
        progress: 100,
        error: null,
        downloadUrl,
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setExportProgress({
          isExporting: false,
          progress: 0,
          error: null,
          downloadUrl: null,
        });
      }, 3000);

    } catch (error) {
      setExportProgress({
        isExporting: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Export failed',
        downloadUrl: null,
      });
    }
  }, [convertToCSV, convertToJSON, downloadFile]);

  /**
   * Export historical data
   */
  const exportHistoricalData = useCallback(async (
    data: HistoricalLatencyData[],
    options: ExportOptions,
    exchanges?: Exchange[],
    regions?: CloudRegion[]
  ): Promise<void> => {
    setExportProgress({
      isExporting: true,
      progress: 0,
      error: null,
      downloadUrl: null,
    });

    try {
      const totalSteps = 4;
      let currentStep = 0;

      // Step 1: Filter data by time range
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      let filteredData = data;
      if (options.timeRange) {
        const now = new Date();
        const timeRangeMs = {
          '1h': 60 * 60 * 1000,
          '24h': 24 * 60 * 60 * 1000,
          '7d': 7 * 24 * 60 * 60 * 1000,
          '30d': 30 * 24 * 60 * 60 * 1000,
        };
        
        const cutoffTime = new Date(now.getTime() - timeRangeMs[options.timeRange]);
        filteredData = data.filter(item => item.timestamp >= cutoffTime);
      }

      // Step 2: Filter by selected exchanges
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      if (options.selectedExchanges && options.selectedExchanges.length > 0) {
        filteredData = filteredData.filter(item => 
          options.selectedExchanges!.some(exchangeId => 
            item.exchangePair.includes(exchangeId)
          )
        );
      }

      // Step 3: Convert data
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      let content: string;
      let filename: string;
      let mimeType: string;

      if (options.format === 'csv') {
        content = convertToCSV(filteredData, options.includeMetadata);
        filename = `historical-latency-${options.timeRange || 'all'}-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      } else {
        content = convertToJSON(filteredData, exchanges, regions, options.includeMetadata);
        filename = `historical-latency-${options.timeRange || 'all'}-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      }

      // Step 4: Download
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      const downloadUrl = downloadFile(content, filename, mimeType);

      setExportProgress({
        isExporting: false,
        progress: 100,
        error: null,
        downloadUrl,
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setExportProgress({
          isExporting: false,
          progress: 0,
          error: null,
          downloadUrl: null,
        });
      }, 3000);

    } catch (error) {
      setExportProgress({
        isExporting: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Export failed',
        downloadUrl: null,
      });
    }
  }, [convertToCSV, convertToJSON, downloadFile]);

  /**
   * Generate comprehensive report
   */
  const generateReport = useCallback(async (
    latencyData: LatencyData[],
    historicalData: HistoricalLatencyData[],
    exchanges: Exchange[],
    regions: CloudRegion[],
    options: ExportOptions
  ): Promise<void> => {
    setExportProgress({
      isExporting: true,
      progress: 0,
      error: null,
      downloadUrl: null,
    });

    try {
      const totalSteps = 5;
      let currentStep = 0;

      // Step 1: Calculate statistics
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      const stats = {
        totalExchanges: exchanges.length,
        totalRegions: regions.length,
        totalConnections: latencyData.length,
        averageLatency: latencyData.reduce((sum, item) => sum + item.latency, 0) / latencyData.length,
        minLatency: Math.min(...latencyData.map(item => item.latency)),
        maxLatency: Math.max(...latencyData.map(item => item.latency)),
        highLatencyConnections: latencyData.filter(item => item.status === 'high').length,
        cloudProviderDistribution: exchanges.reduce((acc, exchange) => {
          acc[exchange.cloudProvider] = (acc[exchange.cloudProvider] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
      };

      // Step 2: Generate summary
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      const report = {
        metadata: {
          title: 'GoQuant Latency Analysis Report',
          generatedAt: new Date().toISOString(),
          timeRange: options.timeRange || 'current',
          version: '1.0',
        },
        summary: {
          ...stats,
          reportPeriod: options.timeRange ? `Last ${options.timeRange}` : 'Current snapshot',
          dataQuality: 'Good', // Could be calculated based on packet loss, etc.
        },
        exchanges: exchanges.map(exchange => ({
          ...exchange,
          connections: latencyData.filter(item => item.from === exchange.id || item.to === exchange.id).length,
          averageLatency: latencyData
            .filter(item => item.from === exchange.id || item.to === exchange.id)
            .reduce((sum, item, _, arr) => sum + item.latency / arr.length, 0),
        })),
        regions,
        currentLatencyData: latencyData,
        historicalData: historicalData.slice(-100), // Last 100 points
        recommendations: [
          stats.averageLatency > 200 ? 'Consider optimizing network routes for high-latency connections' : null,
          stats.highLatencyConnections > latencyData.length * 0.2 ? 'High number of slow connections detected' : null,
          'Regular monitoring recommended for optimal performance',
        ].filter(Boolean),
      };

      // Step 3: Convert to format
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      let content: string;
      let filename: string;
      let mimeType: string;

      if (options.format === 'json') {
        content = JSON.stringify(report, null, 2);
        filename = `goquant-report-${new Date().toISOString().split('T')[0]}.json`;
        mimeType = 'application/json';
      } else {
        // Generate CSV report with multiple sections
        content = '# GoQuant Latency Analysis Report\n';
        content += `# Generated: ${report.metadata.generatedAt}\n`;
        content += `# Time Range: ${report.summary.reportPeriod}\n\n`;
        
        content += '# Summary Statistics\n';
        content += 'Metric,Value\n';
        content += `Total Exchanges,${report.summary.totalExchanges}\n`;
        content += `Total Regions,${report.summary.totalRegions}\n`;
        content += `Total Connections,${report.summary.totalConnections}\n`;
        content += `Average Latency (ms),${report.summary.averageLatency.toFixed(2)}\n`;
        content += `Min Latency (ms),${report.summary.minLatency}\n`;
        content += `Max Latency (ms),${report.summary.maxLatency}\n\n`;
        
        content += '# Current Latency Data\n';
        content += convertToCSV(latencyData, false);
        
        filename = `goquant-report-${new Date().toISOString().split('T')[0]}.csv`;
        mimeType = 'text/csv';
      }

      // Step 4: Create file
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      // Step 5: Download
      setExportProgress(prev => ({ ...prev, progress: (++currentStep / totalSteps) * 100 }));
      
      const downloadUrl = downloadFile(content, filename, mimeType);

      setExportProgress({
        isExporting: false,
        progress: 100,
        error: null,
        downloadUrl,
      });

      // Reset after 3 seconds
      setTimeout(() => {
        setExportProgress({
          isExporting: false,
          progress: 0,
          error: null,
          downloadUrl: null,
        });
      }, 3000);

    } catch (error) {
      setExportProgress({
        isExporting: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Report generation failed',
        downloadUrl: null,
      });
    }
  }, [convertToCSV, downloadFile]);

  return {
    exportProgress,
    exportLatencyData,
    exportHistoricalData,
    generateReport,
  };
}