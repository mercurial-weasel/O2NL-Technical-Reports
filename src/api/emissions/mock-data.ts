import { CarbonEmissionData } from './types';
import { generateMockEmissions } from './generators';

// Generate mock data with 200 entries
const generatedEmissions = generateMockEmissions(200);

// Calculate total emissions
const totalEmissions = generatedEmissions.reduce(
  (sum, emission) => sum + emission.amount,
  0
);

// Export the generated mock data
export const mockEmissionsData: CarbonEmissionData = {
  projectId: "o2nl-paa",
  emissions: generatedEmissions,
  totalEmissions,
  lastUpdated: new Date().toISOString()
};