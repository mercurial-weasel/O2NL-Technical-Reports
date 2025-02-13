import { BaseApiClient } from '../../base/client';
import { AMTBudgetData } from './types';
import { API_CONFIG } from '../../../data/config/api';
import { mockAMTBudgetData } from './mock-data';

export class AMTBudgetApiClient extends BaseApiClient {
  async fetchAMTBudgetData(): Promise<AMTBudgetData> {
    const response = await this.fetchData<AMTBudgetData>(
      API_CONFIG.endpoints.amtBudget,
      mockAMTBudgetData
    );
    return response.data;
  }
}