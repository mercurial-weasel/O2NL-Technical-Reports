import { CarbonEmissionData } from './types';
import { generateMockEmissions } from './generators';

// Generate mock data once at startup
const generatedEmissions = generateMockEmissions();

// Calculate total emissions
const totalEmissions = generatedEmissions.reduce(
  (sum, emission) => sum + emission.amount,
  0
);

// Export the static mock data
export const mockEmissionsData: CarbonEmissionData = {
  projectId: "o2nl-paa",
  emissions: generatedEmissions,
  totalEmissions,
  lastUpdated: new Date().toISOString()
};