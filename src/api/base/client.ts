// src/api/base/client.ts
import { APIResponse, APIError } from '@data/types/api';
import { API_CONFIG } from '@data/config/api';
import { logger } from '@lib/logger';

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
      logger.info(`API Request Started`, {
        endpoint,
        useMockData: this.useMockData,
        baseUrl: this.baseUrl,
        method: options.method || 'GET',
        headers: options.headers
      });

      if (this.useMockData && mockData) {
        logger.info('Using mock data', { 
          endpoint,
          mockDataType: typeof mockData,
          mockDataLength: Array.isArray(mockData) ? mockData.length : null
        });
        return {
          data: mockData,
          meta: {
            total: Array.isArray(mockData) ? mockData.length : 1
          }
        };
      }

      const url = `${this.baseUrl}${endpoint}`;
      const startTime = performance.now();
      
      logger.debug('Making API call', { 
        url,
        options: {
          ...options,
          headers: {
            ...API_CONFIG.defaultHeaders,
            ...options.headers
          }
        }
      });
      
      const response = await fetch(url, {
        ...options,
        headers: {
          ...API_CONFIG.defaultHeaders,
          ...options.headers
        }
      });
      
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      
      logger.info('API Response Received', {
        status: response.status,
        statusText: response.statusText,
        duration: `${duration}ms`,
        contentType: response.headers.get('content-type'),
        endpoint
      });

      if (!response.ok) {
        const error = await response.json() as APIError;
        logger.error('API Request Failed', { 
          status: response.status, 
          error,
          url,
          duration
        });
        throw error;
      }

      const data = await response.json() as APIResponse<T>;
      logger.info('API Response Parsed Successfully', {
        recordCount: Array.isArray(data.data) ? data.data.length : 1,
        endpoint,
        duration,
        meta: data.meta
      });

      return data;
    } catch (error) {
      logger.error('API Request Error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        endpoint
      });
      throw error;
    }
  }
}