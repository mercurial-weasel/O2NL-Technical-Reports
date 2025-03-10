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
