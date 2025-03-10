import { BaseApiClient } from '../base/client';
import { EquipmentData } from './types';
import { API_CONFIG } from '@data/config/api';
import { mockEquipmentData } from './mock-data';
import { logger } from '@lib/logger';

export class EquipmentApiClient extends BaseApiClient {
  async fetchEquipmentData(): Promise<EquipmentData> {
    try {
      logger.info('Fetching equipment status data');
      const response = await this.fetchData<EquipmentData>(
        API_CONFIG.endpoints.equipment,
        mockEquipmentData
      );
      
      logger.info('Equipment status data fetched successfully', {
        equipmentTypes: response.data.equipmentTypes.length,
        totalEquipment: response.data.equipmentTypes.reduce(
          (sum, type) => sum + type.equipment.length, 
          0
        )
      });
      
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch equipment status data', { error });
      throw error;
    }
  }
}