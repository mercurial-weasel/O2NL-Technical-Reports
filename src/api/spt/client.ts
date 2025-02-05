// src/api/spt/client.ts
import { BaseApiClient } from '../base/client';
import { SPTResponse } from './types';
import { API_CONFIG } from '../../data/config/api';
import { mockSPTData } from './mock-data';

export class SPTApiClient extends BaseApiClient {
  async fetchSPTData(): Promise<SPTResponse> {
    const response = await this.fetchData<SPTResponse>(
      API_CONFIG.endpoints.spt,
      {
        points: mockSPTData.points,
        sptResults: mockSPTData.sptResults,
        lastLoadTime: new Date().toISOString(),
        recordCount: mockSPTData.points.length + mockSPTData.sptResults.length,
        rawData: mockSPTData
      }
    );
    return response.data;
  }
}
