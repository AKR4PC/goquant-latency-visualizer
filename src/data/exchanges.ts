/**
 * Static data for major cryptocurrency exchanges with accurate coordinates
 */

import { Exchange } from '@/types';
import { validateExchange } from '@/utils/validation';

export const EXCHANGES: Exchange[] = [
  // Binance
  {
    id: 'binance-singapore',
    name: 'Binance',
    location: {
      lat: 1.3521,
      lng: 103.8198,
      city: 'Singapore',
      country: 'Singapore',
    },
    cloudProvider: 'AWS',
    region: 'ap-southeast-1',
    status: 'online',
    serverCount: 150,
    capacity: 95,
  },
  {
    id: 'binance-tokyo',
    name: 'Binance',
    location: {
      lat: 35.6762,
      lng: 139.6503,
      city: 'Tokyo',
      country: 'Japan',
    },
    cloudProvider: 'AWS',
    region: 'ap-northeast-1',
    status: 'online',
    serverCount: 120,
    capacity: 88,
  },
  
  // OKX
  {
    id: 'okx-hongkong',
    name: 'OKX',
    location: {
      lat: 22.3193,
      lng: 114.1694,
      city: 'Hong Kong',
      country: 'Hong Kong',
    },
    cloudProvider: 'GCP',
    region: 'asia-east1',
    status: 'online',
    serverCount: 80,
    capacity: 92,
  },
  {
    id: 'okx-singapore',
    name: 'OKX',
    location: {
      lat: 1.3521,
      lng: 103.8198,
      city: 'Singapore',
      country: 'Singapore',
    },
    cloudProvider: 'GCP',
    region: 'asia-southeast1',
    status: 'online',
    serverCount: 75,
    capacity: 85,
  },
  
  // Deribit
  {
    id: 'deribit-amsterdam',
    name: 'Deribit',
    location: {
      lat: 52.3676,
      lng: 4.9041,
      city: 'Amsterdam',
      country: 'Netherlands',
    },
    cloudProvider: 'Azure',
    region: 'europe-west',
    status: 'online',
    serverCount: 45,
    capacity: 78,
  },  

  // Bybit
  {
    id: 'bybit-singapore',
    name: 'Bybit',
    location: {
      lat: 1.3521,
      lng: 103.8198,
      city: 'Singapore',
      country: 'Singapore',
    },
    cloudProvider: 'AWS',
    region: 'ap-southeast-1',
    status: 'online',
    serverCount: 90,
    capacity: 91,
  },
  {
    id: 'bybit-tokyo',
    name: 'Bybit',
    location: {
      lat: 35.6762,
      lng: 139.6503,
      city: 'Tokyo',
      country: 'Japan',
    },
    cloudProvider: 'AWS',
    region: 'ap-northeast-1',
    status: 'online',
    serverCount: 85,
    capacity: 87,
  },
  
  // Coinbase
  {
    id: 'coinbase-sanfrancisco',
    name: 'Coinbase',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      city: 'San Francisco',
      country: 'United States',
    },
    cloudProvider: 'GCP',
    region: 'us-west1',
    status: 'online',
    serverCount: 200,
    capacity: 96,
  },
  {
    id: 'coinbase-newyork',
    name: 'Coinbase',
    location: {
      lat: 40.7128,
      lng: -74.0060,
      city: 'New York',
      country: 'United States',
    },
    cloudProvider: 'GCP',
    region: 'us-east1',
    status: 'online',
    serverCount: 180,
    capacity: 94,
  },
  
  // Kraken
  {
    id: 'kraken-sanfrancisco',
    name: 'Kraken',
    location: {
      lat: 37.7749,
      lng: -122.4194,
      city: 'San Francisco',
      country: 'United States',
    },
    cloudProvider: 'Azure',
    region: 'us-west2',
    status: 'online',
    serverCount: 110,
    capacity: 89,
  },
  {
    id: 'kraken-london',
    name: 'Kraken',
    location: {
      lat: 51.5074,
      lng: -0.1278,
      city: 'London',
      country: 'United Kingdom',
    },
    cloudProvider: 'Azure',
    region: 'europe-west',
    status: 'online',
    serverCount: 95,
    capacity: 86,
  },
  
  // Bitfinex
  {
    id: 'bitfinex-london',
    name: 'Bitfinex',
    location: {
      lat: 51.5074,
      lng: -0.1278,
      city: 'London',
      country: 'United Kingdom',
    },
    cloudProvider: 'AWS',
    region: 'eu-west-1',
    status: 'online',
    serverCount: 70,
    capacity: 83,
  },
  
  // KuCoin
  {
    id: 'kucoin-singapore',
    name: 'KuCoin',
    location: {
      lat: 1.3521,
      lng: 103.8198,
      city: 'Singapore',
      country: 'Singapore',
    },
    cloudProvider: 'GCP',
    region: 'asia-southeast1',
    status: 'online',
    serverCount: 65,
    capacity: 81,
  },
];

// Helper function to get exchange by ID
export const getExchangeById = (id: string): Exchange | undefined => {
  return EXCHANGES.find(exchange => exchange.id === id);
};

// Helper function to get exchanges by cloud provider
export const getExchangesByProvider = (provider: string): Exchange[] => {
  return EXCHANGES.filter(exchange => exchange.cloudProvider === provider);
};

// Helper function to get exchanges by region
export const getExchangesByRegion = (region: string): Exchange[] => {
  return EXCHANGES.filter(exchange => exchange.region === region);
};

// Validate all exchanges on module load
const validationResults = EXCHANGES.map((exchange, index) => ({
  index,
  exchange: exchange.id,
  ...validateExchange(exchange),
}));

const invalidExchanges = validationResults.filter(result => !result.isValid);
if (invalidExchanges.length > 0) {
  console.warn('Invalid exchanges found:', invalidExchanges);
}

// Export validation results for debugging
export const EXCHANGE_VALIDATION = {
  total: EXCHANGES.length,
  valid: validationResults.filter(r => r.isValid).length,
  invalid: invalidExchanges.length,
  errors: invalidExchanges,
};