// src/api/cost/pab/client.ts
import { BaseApiClient } from '../../base/client';
import { PABResponse } from './types';
import { API_CONFIG } from '../../../data/config/api';
import { mockPABData } from './mock-data';
import { logger } from '../../../lib/logger';

export class PABApiClient extends BaseApiClient {
  async fetchPABData(): Promise<PABResponse> {
    try {
      logger.info('Fetching PAB data');
      const response = await this.fetchData<PABResponse>(
        API_CONFIG.endpoints.pab,
        mockPABData
      );
      logger.info('PAB data fetched successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch PAB data', { error });
      throw error;
    }
  }
}
