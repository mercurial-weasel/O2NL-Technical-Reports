import { DustData } from './types';
import { generateMockDustData } from './generators';

const generatedData = generateMockDustData(5, 200);

export const mockDustData: DustData = {
  devices: generatedData.devices,
  lastUpdated: new Date().toISOString(),
  totalReadings: generatedData.totalReadings
};