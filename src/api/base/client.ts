// src/api/base/client.ts
import { APIResponse, APIError } from '../../data/types/api';
import { API_CONFIG } from '../../data/config/api';
import { logger } from '../../lib/logger';

export abstract class BaseApiClient {
  protected baseUrl: string;
  protected useMockData: boolean;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.useMockData = API_CONFIG.useMockData;
  }

  protected async fetchData<T>(
    endpoint: string,
    mockData?: T,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    try {
      logger.info(`Starting API request to ${endpoint}`, {
        useMockData: this.useMockData,
        baseUrl: this.baseUrl
      });

      if (this.useMockData && mockData) {
        logger.info('Using mock data', { endpoint });
        return {
          data: mockData,
          meta: {
            total: Array.isArray(mockData) ? mockData.length : 1
          }
        };
      }

      const url = `${this.baseUrl}${endpoint}`;
      const startTime = performance.now();
      logger.info('about  to make a call to ', { url }, ' with ', {options});
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...API_CONFIG.defaultHeaders,
          ...options.headers
        }
      });
      
      const endTime = performance.now();
      logger.info('Received API response', {
        status: response.status,
        statusText: response.statusText,
        responseTime: `${(endTime - startTime).toFixed(2)}ms`
      });

      if (!response.ok) {
        const error = await response.json() as APIError;
        logger.error('API request failed', { status: response.status, error, url });
        throw error;
      }

      const data = await response.json() as APIResponse<T>;
      logger.info('Successfully parsed API response', {
        recordCount: Array.isArray(data.data) ? data.data.length : 1
      });

      return data;
    } catch (error) {
      logger.error('API request failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        endpoint
      });
      throw error;
    }
  }
}
