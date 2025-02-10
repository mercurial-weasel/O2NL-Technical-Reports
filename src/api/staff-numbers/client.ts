import { O2NL_Staff } from '../staff-fte/types';
import { API_CONFIG } from '../../data/config/api';
import { logger } from '../../lib/logger';

export class StaffNumbersApiClient {
  private baseUrl: string;
  private useMockData: boolean;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.useMockData = API_CONFIG.useMockData;
  }

  async fetchStaffNumbersData(): Promise<O2NL_Staff[]> {
    try {
      logger.info('Starting staff numbers data fetch request', {
        useMockData: this.useMockData,
        baseUrl: this.baseUrl
      });

      if (this.useMockData) {
        // Import mock data dynamically to avoid circular dependencies
        const { mockStaffFTEData } = await import('../staff-fte/mock-data');
        logger.info('Using mock staff numbers data', { recordCount: mockStaffFTEData.length });
        return mockStaffFTEData;
      }

      const url = `${this.baseUrl}${API_CONFIG.endpoints.staff}`;
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
        throw new Error(error.error || 'Failed to fetch staff numbers data');
      }
      
      const data = await response.json();
      logger.info('Successfully parsed API response', {
        recordCount: data.length || 0
      });

      return data;
    } catch (error) {
      logger.error('Failed to fetch staff numbers data', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}