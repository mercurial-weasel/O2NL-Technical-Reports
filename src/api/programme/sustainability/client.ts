import { BaseApiClient } from '../../base/client';
import { SustainabilityMonthlyRecord, SustainabilityRecords } from './types';
import { mockSustainabilityData } from './mock-data';
import { logger } from '@lib/logger';

export class SustainabilityReportApiClient extends BaseApiClient {
  // Get all available months
  getAvailableMonths(): string[] {
    try {
      return mockSustainabilityData
        .map(record => record.month)
        .sort((a, b) => b.localeCompare(a)); // Sort in descending order
    } catch (error) {
      logger.error('Failed to get available months', { error });
      throw error;
    }
  }

  // Get data for a specific month
  getMonthData(month: string): SustainabilityMonthlyRecord | null {
    try {
      return mockSustainabilityData.find(record => record.month === month) || null;
    } catch (error) {
      logger.error('Failed to get month data', { error, month });
      throw error;
    }
  }

  // Fetch all Sustainability records
  async fetchSustainabilityRecords(): Promise<SustainabilityRecords> {
    try {
      logger.info('Fetching Sustainability records');
      const response = await this.fetchData<SustainabilityRecords>(
        '/api/programme/sustainability',
        mockSustainabilityData
      );
      logger.info('Successfully fetched Sustainability records', { recordCount: response.data.length });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch Sustainability records', { error });
      throw error;
    }
  }
}