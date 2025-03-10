import { BaseApiClient } from '../../base/client';
import { MonthlyPABRecord, PABResponse } from './types';
import { API_CONFIG } from '../../../data/config/api';
import { mockPABData } from './mock-data';
import { logger } from '@lib/logger';

export class PABApiClient extends BaseApiClient {
  async fetchPABData(month?: string): Promise<PABResponse> {
    try {
      logger.info('Fetching PAB data', { month });

      if (this.useMockData) {
        // Get available months from mock data
        const availableMonths = mockPABData.map(record => record.monthYear).sort((a, b) => b.localeCompare(a));
        
        // If month is specified, return that month's data
        // Otherwise, return the most recent month
        const currentMonth = month 
          ? mockPABData.find(record => record.monthYear === month)
          : mockPABData[0];

        if (!currentMonth) {
          throw new Error(`No PAB data found for month: ${month}`);
        }

        return {
          currentMonth,
          availableMonths,
          lastUpdated: new Date().toISOString()
        };
      }

      const response = await this.fetchData<PABResponse>(
        `${API_CONFIG.endpoints.pab}${month ? `/${month}` : ''}`,
        {
          currentMonth: mockPABData[0],
          availableMonths: mockPABData.map(record => record.monthYear),
          lastUpdated: new Date().toISOString()
        }
      );

      logger.info('PAB data fetched successfully');
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch PAB data', { error });
      throw error;
    }
  }

  async getAvailableMonths(): Promise<string[]> {
    try {
      if (this.useMockData) {
        return mockPABData.map(record => record.monthYear).sort((a, b) => b.localeCompare(a));
      }

      const response = await this.fetchData<string[]>(
        `${API_CONFIG.endpoints.pab}/months`,
        mockPABData.map(record => record.monthYear)
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch available PAB months', { error });
      throw error;
    }
  }

  async getMonthData(month: string): Promise<MonthlyPABRecord | null> {
    try {
      if (this.useMockData) {
        return mockPABData.find(record => record.monthYear === month) || null;
      }

      const response = await this.fetchData<MonthlyPABRecord>(
        `${API_CONFIG.endpoints.pab}/${month}`,
        mockPABData.find(record => record.monthYear === month) || null
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch PAB month data', { error, month });
      throw error;
    }
  }
}