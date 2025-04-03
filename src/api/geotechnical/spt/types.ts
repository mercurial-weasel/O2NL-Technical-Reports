// src/api/spt/types.ts
export interface Point {
  id: string;
  point_id: string;
  zone: string;
  lat: number;
  lon: number;
  createdAt: string;
}

export interface SPTResult {
  id: string;
  point_id: string;
  material: string;
  top: number;
  num_test_blow_count: number;
  total_blow_count: number;
  createdAt: string;
}

export interface SPTResponse {
  points: Point[];
  sptResults: SPTResult[];
  lastLoadTime: string | null;
  recordCount: number;
  rawData: any[] | null;
}

import { Geo_SPT as PrismaGeoSPT } from '../../../types/prismaTypes';

// Re-export the Prisma types with potentially added functionality
export interface GeoSPT extends Omit<PrismaGeoSPT, 'createdAt' | 'updatedAt'> {
  // Add any extended properties here
}

export type SPTData = GeoSPT[];
