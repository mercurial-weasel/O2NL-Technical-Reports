import { O2NL_Staff, monthFormatter } from './types';
import { API_CONFIG } from '@data/config/api';
import { logger } from '@lib/logger';
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

      // Transform response to match new O2NL_Staff structure
      return data.map((item: any) => {
        // Extract monthly FTE values
        const monthlyFTE: { [key: string]: number } = {};
        
        // Process all properties that match month pattern
        Object.entries(item).forEach(([key, value]) => {
          if (/^(January|February|March|April|May|June|July|August|September|October|November|December)_\d{2}$/.test(key)) {
            // Convert from legacy format (e.g., "January_24") to ISO format (e.g., "2024-01")
            const isoMonth = monthFormatter.toISOFormat(key);
            monthlyFTE[isoMonth] = parseFloat(value as string) || 0;
          }
        });
        
        return {
          id: item.id,
          disciplineManager: item.Discipline_Manager || '',
          team: item.Team || '',
          location: item.Location || '',
          nopType: item.NOP_Type || '',
          org: item.Org || '',
          projectRoleTitle: item.Project_Role_Title || '',
          jobCode: item.Job_Code || '',
          phase: item.Phase || '',
          name: item.Name || '',
          status: item.Status || '',
          lastUpdatedConf: item.Last_updated_conf || new Date().toISOString(),
          resourceOptions: item.Resource_Options || '',
          taitokoLevinSiteBased: item.Taitoko_Levin_Site_Based_ || '',
          pricingPGProfDirectWorks: item.Pricing_P_G___Prof___Direct_Works || '',
          fteAve: parseFloat(item.FTE__AVE_) || 0,
          requiredStart: new Date(item.Required_Start),
          requiredFinish: new Date(item.Required_Finish),
          monthlyFTE: monthlyFTE,
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
          updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date()
        };
      });
    } catch (error) {
      logger.error('Failed to fetch staff FTE data', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }
}