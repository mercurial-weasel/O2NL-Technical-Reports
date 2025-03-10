import { BaseApiClient } from '../../base/client';
import { DustData } from './types';
import { API_CONFIG } from '../../../data/config/api';
import { mockDustData } from './mock-data';
import { logger } from '@lib/logger';

export class DustApiClient extends BaseApiClient {
  async fetchDustData(): Promise<DustData> {
    try {
      logger.info('Starting dust monitoring data fetch request');
      
      const response = await this.fetchData<DustData>(
        API_CONFIG.endpoints.dust,
        mockDustData
      );
      
      logger.info('Dust monitoring data fetched successfully', {
        deviceCount: response.data.devices.length,
        totalReadings: response.data.totalReadings
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch dust monitoring data', { error });
      throw error;
    }
  }
}