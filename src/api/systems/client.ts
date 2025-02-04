import { SystemInfo } from './types';
import { API_CONFIG } from '../../data/config/api';
import { logger } from '../../lib/logger';
import { mockSystemsData } from './mock-data';

export class SystemsApiClient {
  private baseUrl: string;
  private useMockData: boolean;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.useMockData = API_CONFIG.useMockData;
  }

  async fetchSystemsData(): Promise<SystemInfo[]> {
    try {
      logger.info('Starting systems data fetch request', {
        useMockData: this.useMockData,
        baseUrl: this.baseUrl
      });

      if (this.useMockData) {
        logger.info('Using mock systems data', { recordCount: mockSystemsData.length });
        return mockSystemsData;
      }

      const url = `${this.baseUrl}${API_CONFIG.endpoints.systems}`;
      logger.info('Making API request to O2NL Backend', { url });

      const startTime = performance.now();
      const response = await fetch(url);
      const endTime = performance.now();
      
      logger.info('Received API response', {
        status: response.status,
        statusText: response.statusText,
        responseTime: `${(endTime - startTime).toFixed(2)}ms`
      });
      
      if (!response.ok) {
        const error = await response.json();
        logger.error('API request failed', { 
          status: response.status, 
          error,
          url
        });
        throw new Error(error.error || 'Failed to fetch systems data');
      }
      
      const data = await response.json();
      logger.info('Successfully parsed API response', {
        recordCount: data.length || 0
      });

      return data;
    } catch (error) {
      logger.error('Failed to fetch systems data', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}