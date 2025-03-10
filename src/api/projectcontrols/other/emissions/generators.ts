import { EmissionRecord } from './types';
import { categoryConversions, mockEmissionRecords } from './mock-data';

/**
 * Return mock emission data.
 * If no mock data exists for a given month, generate random data.
 */
export function generateEmissionData(): EmissionRecord[] {
  // For now, just return the mock data
  // Later we can add logic to generate additional months if needed
  return mockEmissionRecords;
}

function getRandomAmount(): number {
  return Math.floor(Math.random() * (500 - 50 + 1)) + 50; // Between 50 and 500
}

function calculateCarbonEstimate(amount: number, conversionFactor: number): number {
  return parseFloat((amount * conversionFactor).toFixed(2));
}