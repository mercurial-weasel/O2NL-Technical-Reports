import { BaseApiClient } from '../base/client';
import { EmissionsData, EmissionRecord } from './types';
import { API_CONFIG } from '../../data/config/api';
import { generateEmissionData } from './generators';
import { calculateTotalCarbonEstimate } from './transformations';
import { logger } from '../../lib/logger';

export class EmissionsApiClient extends BaseApiClient {
  async fetchEmissionsData(): Promise<EmissionsData> {
    try {
      logger.info('Starting emissions data fetch request');
      
      if (this.useMockData) {
        const records = generateEmissionData();
        const totalCarbonEstimate = calculateTotalCarbonEstimate(records);
        
        logger.info('Using mock emissions data', { 
          recordCount: records.length,
          totalCarbonEstimate 
        });
        
        return {
          records,
          totalCarbonEstimate,
          lastUpdated: new Date().toISOString()
        };
      }

      const response = await this.fetchData<EmissionRecord[]>(
        API_CONFIG.endpoints.emissions,
        generateEmissionData()
      );
      
      const totalCarbonEstimate = calculateTotalCarbonEstimate(response.data);
      
      logger.info('Emissions data fetched successfully', {
        recordCount: response.data.length,
        totalCarbonEstimate
      });
      
      return {
        records: response.data,
        totalCarbonEstimate,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Failed to fetch emissions data', { error });
      throw error;
    }
  }
}