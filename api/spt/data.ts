import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock data for demonstration
const mockData = {
  points: [
    {
      id: 'p1',
      point_id: 'BH-001',
      zone: 'Zone1',
      lat: -33.865143,
      lon: 151.209900,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'p2',
      point_id: 'BH-002',
      zone: 'Zone2',
      lat: -33.867143,
      lon: 151.211900,
      createdAt: new Date().toISOString(),
    }
  ],
  sptResults: [
    {
      id: 'spt1',
      point_id: 'BH-001',
      material: 'Alluvium',
      top: 5,
      num_test_blow_count: 25,
      total_blow_count: 30,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'spt2',
      point_id: 'BH-001',
      material: 'Colluvium',
      top: 10,
      num_test_blow_count: 35,
      total_blow_count: 40,
      createdAt: new Date().toISOString(),
    }
  ]
};

// Cache configuration
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let cache = {
  data: null as any,
  timestamp: 0
};

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check cache
    if (cache.data && Date.now() - cache.timestamp < CACHE_TTL) {
      return res.json(cache.data);
    }

    // In a real application, this would fetch data from a database
    // For now, we'll use mock data
    const response = {
      points: mockData.points,
      sptResults: mockData.sptResults,
      lastLoadTime: new Date().toISOString(),
      recordCount: mockData.points.length + mockData.sptResults.length,
      rawData: mockData
    };

    // Update cache
    cache = {
      data: response,
      timestamp: Date.now()
    };

    res.json(response);
  } catch (error) {
    console.error('API Error: Failed to fetch SPT data', error);
    res.status(500).json({ 
      error: 'Failed to fetch SPT data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}