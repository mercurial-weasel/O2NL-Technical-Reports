import { EquipmentData, EquipmentType } from './types';

export interface EquipmentSummary {
  name: string;
  total: number;
  statusCounts: {
    operational: number;
    maintenance: number;
    fault: number;
    offline: number;
  };
}

export function calculateEquipmentSummaries(data: EquipmentData): EquipmentSummary[] {
  return data.equipmentTypes.map(type => ({
    name: type.name,
    total: type.equipment.length,
    statusCounts: {
      operational: type.equipment.filter(e => e.status === 'operational').length,
      maintenance: type.equipment.filter(e => e.status === 'maintenance').length,
      fault: type.equipment.filter(e => e.status === 'fault').length,
      offline: type.equipment.filter(e => e.status === 'offline').length
    }
  }));
}