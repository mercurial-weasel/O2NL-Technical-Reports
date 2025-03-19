// src/api/base/client.ts
import { APIResponse, APIError } from '@data/types/api';
import { API_CONFIG } from '@data/config/api';
import { logger } from '@lib/logger';
import { supabase } from './supabase';

export abstract class BaseApiClient {
  protected baseUrl: string;
  protected useMockData: boolean;
  protected useSupabase: boolean;

  constructor(useSupabase = false) {
    this.baseUrl = API_CONFIG.baseUrl;
    this.useMockData = API_CONFIG.useMockData;
    this.useSupabase = useSupabase;
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
        useSupabase: this.useSupabase,
        baseUrl: this.baseUrl,
        method: options.method || 'GET',
        headers: options.headers
      });

      // Use mock data if configured
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

      // Use Supabase if configured
      if (this.useSupabase) {
        return await this.fetchFromSupabase<T>(endpoint);
      }

      // Default to regular fetch API
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

  protected async fetchFromSupabase<T>(endpoint: string): Promise<APIResponse<T>> {
    try {
      logger.info('Fetching data from Supabase', { endpoint });
      const startTime = performance.now();

      // Parse the endpoint to get the table name and any query parameters
      // Format: /tableName or /tableName/:id
      const parts = endpoint.split('/').filter(part => part);
      const tableName = parts[0];
      
      if (!tableName) {
        throw new Error(`Invalid Supabase endpoint: ${endpoint}`);
      }

      let query = supabase.from(tableName).select('*');

      // If we have an ID in the URL, filter by that ID
      if (parts.length > 1 && parts[1] !== 'select') {
        const id = parts[1];
        query = query.eq('id', id);
      }

      const { data, error } = await query;

      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);

      if (error) {
        logger.error('Supabase Query Error', {
          error: error.message,
          tableName,
          endpoint,
          duration
        });
        throw error;
      }

      logger.info('Supabase Query Successful', {
        recordCount: Array.isArray(data) ? data.length : 1,
        tableName,
        endpoint,
        duration
      });

      return {
        data: data as T,
        meta: {
          total: Array.isArray(data) ? data.length : 1
        }
      };
    } catch (error) {
      logger.error('Supabase Query Failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        endpoint
      });
      throw error;
    }
  }
}