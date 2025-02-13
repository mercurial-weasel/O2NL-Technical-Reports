import { BaseApiClient } from '../../base/client';
import { ConsentMonth } from './types';
import { API_CONFIG } from '../../../data/config/api';
import { mockConsentData } from './mock-data';
import { logger } from '../../../lib/logger';

export class ConsentingApiClient extends BaseApiClient {
  async fetchConsentData(monthYear: string): Promise<ConsentMonth> {
    try {
      logger.info('Fetching consent data', { monthYear });
      const response = await this.fetchData<ConsentMonth>(
        API_CONFIG.endpoints.consenting,
        mockConsentData[monthYear]
      );
      logger.info('Consent data fetched successfully', { 
        monthYear,
        assessmentCount: response.data.assessments.length 
      });
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch consent data', { error, monthYear });
      throw error;
    }
  }

  async getAvailableMonths(): Promise<string[]> {
    try {
      // When using mock data, return available months from mock data
      if (this.useMockData) {
        return Object.keys(mockConsentData).sort((a, b) => b.localeCompare(a));
      }

      // When using real API
      const response = await fetch(`${this.baseUrl}${API_CONFIG.endpoints.consenting}/months`);
      if (!response.ok) {
        throw new Error('Failed to fetch available months');
      }
      return await response.json();
    } catch (error) {
      logger.error('Failed to fetch available months', { error });
      throw error;
    }
  }
}