import { Point, SPTResult } from '@data/models';
import { API_CONFIG } from '@data/config/api';
import { logger } from '../logger';

export interface SPTResponse {
  points: Point[];
  sptResults: SPTResult[];
  lastLoadTime: string | null;
  recordCount: number;
  rawData: any[] | null;
}

export interface APIError {
  message: string;
  code: string;
  details?: any;
}

export class SPTApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_CONFIG.baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetchSPTData(): Promise<SPTResponse> {
    try {
      logger.info('Fetching SPT data');
      const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.spt}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch SPT data');
      }
      
      const data = await response.json();
      logger.info('SPT data fetched successfully', {
        pointCount: data.points.length,
        resultCount: data.sptResults.length
      });
      
      return data;
    } catch (error) {
      logger.error('Failed to fetch SPT data', { error });
      throw error;
    }
  }
}