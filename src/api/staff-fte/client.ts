import { O2NL_Staff } from './types';
import { API_CONFIG } from '../../data/config/api';
import { logger } from '../../lib/logger';
import { mockStaffFTEData } from './mock-data';

export class StaffFTEApiClient {
  private baseUrl: string;
  private useMockData: boolean;

  constructor() {
    this.baseUrl = API_CONFIG.baseUrl;
    this.useMockData = API_CONFIG.useMockData;
  }

  async fetchStaffFTEData(): Promise<O2NL_Staff[]> {
    try {
      logger.info('Starting staff FTE data fetch request', {
        useMockData: this.useMockData,
        baseUrl: this.baseUrl
      });

      if (this.useMockData) {
        logger.info('Using mock staff FTE data', { recordCount: mockStaffFTEData.length });
        return mockStaffFTEData;
      }

      const url = `${this.baseUrl}${API_CONFIG.endpoints.staffFTE}`;
      logger.info('Making API request to O2NL Backend', { url });

      const startTime = performance.now();
      const response = await fetch(url);
      const endTime = performance.now();
      
      logger.info('Received API response', {
        status: response.status,
        statusText: response.statusText,
        responseTime: `${(endTime - startTime).toFixed(2)}ms`
      });
      
      if (!response.ok) {
        const error = await response.json();
        logger.error('API request failed', { 
          status: response.status, 
          error,
          url
        });
        throw new Error(error.error || 'Failed to fetch staff FTE data');
      }
      
      const data = await response.json();
      logger.info('Successfully parsed API response', {
        recordCount: data.length || 0
      });

      // Transform response to match O2NL_Staff structure
      return data.map((item: any) => ({
        Discipline_Manager: item.Discipline_Manager || '',
        Team: item.Team || '',
        Location: item.Location || '',
        NOP_Type: item.NOP_Type || '',
        Org: item.Org || '',
        Project_Role_Title: item.Project_Role_Title || '',
        Phase: item.Phase || '',
        Name: item.Name || '',
        Status: item.Status || '',
        Last_updated_conf: item.Last_updated_conf || new Date().toISOString(),
        Split_Assignment_: item.Split_Assignment_ || '',
        Resource_Options: item.Resource_Options || '',
        Site_Based_: item.Site_Based_ || '',
        Pricing_P_G___Prof___Direct_Works: item.Pricing_P_G___Prof___Direct_Works || '',
        FTE__AVE_: parseFloat(item.FTE__AVE_) || 0,
        Required_Start: new Date(item.Required_Start),
        Required_Finish: new Date(item.Required_Finish),
        ...Object.fromEntries(
          Object.entries(item)
            .filter(([key]) => /^(January|February|March|April|May|June|July|August|September|October|November|December)_\d{2}$/.test(key))
            .map(([key, value]) => [key, parseFloat(value) || 0])
        )
      }));
    } catch (error) {
      logger.error('Failed to fetch staff FTE data', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}