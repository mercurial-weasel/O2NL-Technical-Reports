// src/api/spt/mock-data.ts
import { Point, SPTResult } from './types';

export const mockSPTData = {
  points: [
    {
      id: 'p1',
      point_id: 'BH-001',
      zone: 'Zone1',
      lat: -33.865143,
      lon: 151.209900,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p2', 
      point_id: 'BH-002',
      zone: 'Zone2',
      lat: -33.867143,
      lon: 151.211900,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p3',
      point_id: 'BH-003',
      zone: 'Zone3',
      lat: -33.868143,
      lon: 151.212900,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p4',
      point_id: 'BH-004',
      zone: 'Zone1',
      lat: -33.869143,
      lon: 151.213900,
      createdAt: new Date().toISOString()
    },
    {
      id: 'p5',
      point_id: 'BH-005',
      zone: 'Zone2',
      lat: -33.870143,
      lon: 151.214900,
      createdAt: new Date().toISOString()
    }
  ] as Point[],

  sptResults: [
    {
      id: 'spt1',
      point_id: 'BH-001',
      material: 'Alluvium',
      top: 5,
      num_test_blow_count: 25,
      total_blow_count: 30,
      createdAt: new Date().toISOString()
    },
    {
      id: 'spt2',
      point_id: 'BH-001', 
      material: 'Colluvium',
      top: 10,
      num_test_blow_count: 35,
      total_blow_count: 40,
      createdAt: new Date().toISOString()
    },
    {
      id: 'spt3',
      point_id: 'BH-002',
      material: 'Clay',
      top: 7,
      num_test_blow_count: 20,
      total_blow_count: 25,
      createdAt: new Date().toISOString()
    },
    {
      id: 'spt4',
      point_id: 'BH-002',
      material: 'Silt',
      top: 15,
      num_test_blow_count: 30,
      total_blow_count: 35,
      createdAt: new Date().toISOString()
    },
    {
      id: 'spt5',
      point_id: 'BH-003',
      material: 'Sand',
      top: 8,
      num_test_blow_count: 18,
      total_blow_count: 22,
      createdAt: new Date().toISOString()
    },
    {
      id: 'spt6',
      point_id: 'BH-004',
      material: 'Gravel',
      top: 12,
      num_test_blow_count: 28,
      total_blow_count: 32,
      createdAt: new Date().toISOString()
    },
    {
      id: 'spt7',
      point_id: 'BH-005',
      material: 'Peat',
      top: 6,
      num_test_blow_count: 22,
      total_blow_count: 26,
      createdAt: new Date().toISOString()
    }
  ] as SPTResult[]
};

