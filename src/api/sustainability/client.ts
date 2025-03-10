import { BaseApiClient } from '../base/client';
import { SustainabilityInitiative } from './types';
import { API_CONFIG } from '@data/config/api';
import { mockSustainabilityData } from './mock-data';

export class SustainabilityApiClient extends BaseApiClient {
  async fetchSustainabilityData(): Promise<SustainabilityInitiative[]> {
    const response = await this.fetchData<SustainabilityInitiative[]>(
      API_CONFIG.endpoints.sustainability,
      mockSustainabilityData
    );
    return response.data;
  }
}