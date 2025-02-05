import { BaseApiClient } from '../base/client';
import { CarbonEmissionData } from './types';
import { API_CONFIG } from '../../data/config/api';
import { mockEmissionsData } from './mock-data';
import { logger } from '../../lib/logger';

export class EmissionsApiClient extends BaseApiClient {
  async fetchEmissionsData(): Promise<CarbonEmissionData> {
    try {
      logger.info('Starting emissions data fetch request');
      const response = await this.fetchData<CarbonEmissionData>(
        API_CONFIG.endpoints.emissions,
        mockEmissionsData
      );
      
      logger.info('Emissions data response received', { response });
      
      if (!response.data) {
        throw new Error('No data received from emissions API');
      }
      
      logger.info('Processing response data', { data: response.data });
      
      // Calculate total emissions before returning
      const totalEmissions = response.data.emissions.reduce(
        (sum, emission) => sum + emission.amount,
        0
      );

      return {
        ...response.data,
        totalEmissions
      };
    } catch (error) {
      logger.error('Emissions data fetch failed', { error });
      throw error;
    }
  }
}