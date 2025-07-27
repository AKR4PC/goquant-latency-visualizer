'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, Database, X, CheckCircle, AlertCircle } from 'lucide-react';
import { useExport, ExportOptions } from '@/hooks/useExport';
import { LatencyData, HistoricalLatencyData, Exchange, CloudRegion, TimeRange } from '@/types';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  latencyData: LatencyData[];
  historicalData: HistoricalLatencyData[];
  exchanges: Exchange[];
  regions: CloudRegion[];
  selectedExchanges: string[];
}

export default function ExportDialog({
  isOpen,
  onClose,
  latencyData,
  historicalData,
  exchanges,
  regions,
  selectedExchanges,
}: ExportDialogProps) {
  const { exportProgress, exportLatencyData, exportHistoricalData, generateReport } = useExport();
  
  const [exportType, setExportType] = useState<'current' | 'historical' | 'report'>('current');
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [useSelectedExchanges, setUseSelectedExchanges] = useState(false);

  const handleExport = async () => {
    const options: ExportOptions = {
      format,
      timeRange,
      selectedExchanges: useSelectedExchanges ? selectedExchanges : undefined,
      includeMetadata,
    };

    switch (exportType) {
      case 'current':
        await exportLatencyData(latencyData, options, exchanges, regions);
        break;
      case 'historical':
        await exportHistoricalData(historicalData, options, exchanges, regions);
        break;
      case 'report':
        await generateReport(latencyData, historicalData, exchanges, regions, options);
        break;
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="card-elevated bg-white/95 max-w-md w-full p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6 text-blue-600" />
              <h2 className="text-display text-xl font-bold text-slate-900">Export Data</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>

          {/* Export Type Selection */}
          <div className="mb-6">
            <label className="text-mono text-sm font-medium text-slate-700 mb-3 block">
              Data Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'current', label: 'Current', icon: Database },
                { id: 'historical', label: 'Historical', icon: FileText },
                { id: 'report', label: 'Report', icon: FileText },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setExportType(id as typeof exportType)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                    exportType === id
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-mono text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <label className="text-mono text-sm font-medium text-slate-700 mb-3 block">
              Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'csv', label: 'CSV', description: 'Spreadsheet compatible' },
                { id: 'json', label: 'JSON', description: 'Structured data' },
              ].map(({ id, label, description }) => (
                <button
                  key={id}
                  onClick={() => setFormat(id as typeof format)}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    format === id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-mono text-sm font-medium text-slate-900">{label}</div>
                  <div className="text-mono text-xs text-slate-600">{description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Time Range (for historical data) */}
          {exportType === 'historical' && (
            <div className="mb-6">
              <label className="text-mono text-sm font-medium text-slate-700 mb-3 block">
                Time Range
              </label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as TimeRange)}
                className="w-full p-3 border border-slate-300 rounded-lg text-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>
          )}

          {/* Options */}
          <div className="mb-6 space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-mono text-sm text-slate-700">Include metadata</span>
            </label>
            
            {selectedExchanges.length > 0 && (
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={useSelectedExchanges}
                  onChange={(e) => setUseSelectedExchanges(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <span className="text-mono text-sm text-slate-700">
                  Only selected exchanges ({selectedExchanges.length})
                </span>
              </label>
            )}
          </div>

          {/* Progress */}
          {exportProgress.isExporting && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                <span className="text-mono text-sm text-slate-700">Exporting...</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${exportProgress.progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Success/Error Messages */}
          {exportProgress.error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-mono text-sm text-red-700">{exportProgress.error}</span>
            </div>
          )}

          {exportProgress.downloadUrl && !exportProgress.isExporting && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-mono text-sm text-green-700">Export completed successfully!</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-mono font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={exportProgress.isExporting}
              className="flex-1 px-4 py-2 text-mono font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}