import { BaseApiClient } from '../../base/client';
import { API_CONFIG } from '@data/config/api';
import { logger } from '@lib/logger';
import { TimeLogEntry, HoursResponse } from './types';
import { transformToHoursPivot } from './transformations';
import { mockTimeLogs } from './mock-data';

export class HoursApiClient extends BaseApiClient {
  async getHoursData(): Promise<HoursResponse> {
    try {
      logger.info('Starting hours data retrieval process');

      // Log mock data usage status
      logger.info('Mock data configuration', { 
        useMockData: API_CONFIG.useMockData 
      });

      const response = await this.fetchData<TimeLogEntry[]>(
        API_CONFIG.endpoints.hours,
        mockTimeLogs // Explicitly pass mock data
      );

      // Log raw data details
      logger.info('Raw hours data received', {
        recordCount: response.data.length,
        sampleRecord: response.data[0] ? {
          projectName: response.data[0].projectName,
          taskName: response.data[0].taskName,
          userName: response.data[0].userName,
          columnCount: Object.keys(response.data[0]).length
        } : 'No records'
      });

      logger.debug('Starting data transformation');
      const transformedData = transformToHoursPivot(response.data);
      
      // Log transformed data details
      logger.info('Hours data transformation completed', {
        projectCount: Object.keys(transformedData.data).length,
        uniqueStatuses: transformedData.metadata.statuses.length,
        uniqueMonthYears: transformedData.metadata.monthYears.length
      });

      // Log detailed statistics
      logger.debug('Transformed data statistics', {
        projects: Object.keys(transformedData.data),
        statuses: transformedData.metadata.statuses,
        monthYears: transformedData.metadata.monthYears
      });

      return {
        data: transformedData.data,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Hours data retrieval failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}