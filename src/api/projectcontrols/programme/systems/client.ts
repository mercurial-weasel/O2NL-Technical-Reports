// src/api/systems/client.ts
import { BaseApiClient } from '@api/base/client';
import { SystemData } from './types';
import { API_CONFIG } from '@data/config/api';
import { mockSystemsData } from './mock-data';

export class SystemsApiClient extends BaseApiClient {
  async fetchSystemsData(): Promise<SystemData[]> {
    const response = await this.fetchData<SystemData[]>(
      API_CONFIG.endpoints.systems,
      mockSystemsData
    );
    return response.data;
  }
}
