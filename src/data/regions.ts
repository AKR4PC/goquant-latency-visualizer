/**
 * Static data for major cloud provider regions
 */

import { CloudRegion } from '@/types';
import { validateCloudRegion } from '@/utils/validation';

export const CLOUD_REGIONS: CloudRegion[] = [
  // AWS Regions
  {
    id: 'aws-us-east-1',
    provider: 'AWS',
    name: 'US East (N. Virginia)',
    code: 'us-east-1',
    location: {
      lat: 38.13,
      lng: -78.45,
    },
    serverCount: 500,
    capacity: 85,
    exchanges: ['coinbase-newyork'],
  },
  {
    id: 'aws-us-west-2',
    provider: 'AWS',
    name: 'US West (Oregon)',
    code: 'us-west-2',
    location: {
      lat: 45.87,
      lng: -119.69,
    },
    serverCount: 450,
    capacity: 78,
    exchanges: [],
  },
  {
    id: 'aws-eu-west-1',
    provider: 'AWS',
    name: 'Europe (Ireland)',
    code: 'eu-west-1',
    location: {
      lat: 53.41,
      lng: -8.24,
    },
    serverCount: 380,
    capacity: 82,
    exchanges: ['bitfinex-london'],
  },
  {
    id: 'aws-ap-southeast-1',
    provider: 'AWS',
    name: 'Asia Pacific (Singapore)',
    code: 'ap-southeast-1',
    location: {
      lat: 1.37,
      lng: 103.8,
    },
    serverCount: 420,
    capacity: 88,
    exchanges: ['binance-singapore', 'bybit-singapore'],
  },
  {
    id: 'aws-ap-northeast-1',
    provider: 'AWS',
    name: 'Asia Pacific (Tokyo)',
    code: 'ap-northeast-1',
    location: {
      lat: 35.41,
      lng: 139.42,
    },
    serverCount: 390,
    capacity: 86,
    exchanges: ['binance-tokyo', 'bybit-tokyo'],
  },
  
  // GCP Regions
  {
    id: 'gcp-us-central1',
    provider: 'GCP',
    name: 'US Central (Iowa)',
    code: 'us-central1',
    location: {
      lat: 41.26,
      lng: -95.86,
    },
    serverCount: 320,
    capacity: 75,
    exchanges: [],
  },  {
    
id: 'gcp-us-west1',
    provider: 'GCP',
    name: 'US West (Oregon)',
    code: 'us-west1',
    location: {
      lat: 45.87,
      lng: -119.69,
    },
    serverCount: 350,
    capacity: 79,
    exchanges: ['coinbase-sanfrancisco'],
  },
  {
    id: 'gcp-europe-west1',
    provider: 'GCP',
    name: 'Europe West (Belgium)',
    code: 'europe-west1',
    location: {
      lat: 50.45,
      lng: 4.35,
    },
    serverCount: 290,
    capacity: 73,
    exchanges: [],
  },
  {
    id: 'gcp-asia-southeast1',
    provider: 'GCP',
    name: 'Asia Southeast (Singapore)',
    code: 'asia-southeast1',
    location: {
      lat: 1.37,
      lng: 103.8,
    },
    serverCount: 310,
    capacity: 81,
    exchanges: ['okx-singapore', 'kucoin-singapore'],
  },
  {
    id: 'gcp-asia-northeast1',
    provider: 'GCP',
    name: 'Asia Northeast (Tokyo)',
    code: 'asia-northeast1',
    location: {
      lat: 35.41,
      lng: 139.42,
    },
    serverCount: 280,
    capacity: 77,
    exchanges: [],
  },
  {
    id: 'gcp-asia-east1',
    provider: 'GCP',
    name: 'Asia East (Taiwan)',
    code: 'asia-east1',
    location: {
      lat: 25.0330,
      lng: 121.5654,
    },
    serverCount: 260,
    capacity: 74,
    exchanges: ['okx-hongkong'],
  },
  
  // Azure Regions
  {
    id: 'azure-east-us',
    provider: 'Azure',
    name: 'East US (Virginia)',
    code: 'eastus',
    location: {
      lat: 38.13,
      lng: -78.45,
    },
    serverCount: 400,
    capacity: 83,
    exchanges: [],
  },
  {
    id: 'azure-west-us-2',
    provider: 'Azure',
    name: 'West US 2 (Washington)',
    code: 'westus2',
    location: {
      lat: 47.233,
      lng: -119.852,
    },
    serverCount: 370,
    capacity: 80,
    exchanges: ['kraken-sanfrancisco'],
  },
  {
    id: 'azure-west-europe',
    provider: 'Azure',
    name: 'West Europe (Netherlands)',
    code: 'westeurope',
    location: {
      lat: 52.37,
      lng: 4.89,
    },
    serverCount: 340,
    capacity: 85,
    exchanges: ['deribit-amsterdam', 'kraken-london'],
  },
  {
    id: 'azure-southeast-asia',
    provider: 'Azure',
    name: 'Southeast Asia (Singapore)',
    code: 'southeastasia',
    location: {
      lat: 1.37,
      lng: 103.8,
    },
    serverCount: 300,
    capacity: 78,
    exchanges: [],
  },
  {
    id: 'azure-japan-east',
    provider: 'Azure',
    name: 'Japan East (Tokyo)',
    code: 'japaneast',
    location: {
      lat: 35.41,
      lng: 139.42,
    },
    serverCount: 270,
    capacity: 76,
    exchanges: [],
  },
];

// Helper functions
export const getRegionById = (id: string): CloudRegion | undefined => {
  return CLOUD_REGIONS.find(region => region.id === id);
};

export const getRegionsByProvider = (provider: string): CloudRegion[] => {
  return CLOUD_REGIONS.filter(region => region.provider === provider);
};

export const getRegionByCode = (code: string): CloudRegion | undefined => {
  return CLOUD_REGIONS.find(region => region.code === code);
};

// Validate all regions on module load
const validationResults = CLOUD_REGIONS.map((region, index) => ({
  index,
  region: region.id,
  ...validateCloudRegion(region),
}));

const invalidRegions = validationResults.filter(result => !result.isValid);
if (invalidRegions.length > 0) {
  console.warn('Invalid cloud regions found:', invalidRegions);
}

// Export validation results for debugging
export const REGION_VALIDATION = {
  total: CLOUD_REGIONS.length,
  valid: validationResults.filter(r => r.isValid).length,
  invalid: invalidRegions.length,
  errors: invalidRegions,
};