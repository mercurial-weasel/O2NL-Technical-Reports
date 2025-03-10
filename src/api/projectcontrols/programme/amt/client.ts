import { BaseApiClient } from '@api/base/client';
import { AMTMonthlyRecord, AMTRecords } from './types';
import { mockAMTData } from './mock-data';
import { logger } from '@lib/logger';

export class AMTReportApiClient extends BaseApiClient {
  // Get all available months
  getAvailableMonths(): string[] {
    try {
      return mockAMTData
        .map(record => record.month)
        .sort((a, b) => b.localeCompare(a)); // Sort in descending order
    } catch (error) {
      logger.error('Failed to get available months', { error });
      throw error;
    }
  }

  // Get data for a specific month
  getMonthData(month: string): AMTMonthlyRecord | null {
    try {
      return mockAMTData.find(record => record.month === month) || null;
    } catch (error) {
      logger.error('Failed to get month data', { error, month });
      throw error;
    }
  }

  // Fetch all AMT records
  async fetchAMTRecords(): Promise<AMTRecords> {
    try {
      logger.info('Fetching AMT records');
      const response = await this.fetchData<AMTRecords>(
        '/api/programme/amt',
        mockAMTData
      );
      logger.info('Successfully fetched AMT records', { recordCount: response.data.length });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch AMT records', { error });
      throw error;
    }
  }
}