import { BaseApiClient } from '../../base/client';
import { EarnedValueData } from './types';
import { API_CONFIG } from '../../../data/config/api';
import { mockEarnedValueData } from './mock-data';

export class EarnedValueApiClient extends BaseApiClient {
  async fetchEarnedValueData(): Promise<EarnedValueData> {
    const response = await this.fetchData<EarnedValueData>(
      API_CONFIG.endpoints.earnedValue,
      mockEarnedValueData
    );
    return response.data;
  }
}