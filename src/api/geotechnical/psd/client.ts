import { PSDData } from './types';
import { mockParticleSizeDistributionTests } from './mock-data';

/**
 * Fetch all particle size distribution tests
 */
export async function getPSDTests(): Promise<PSDData> {
  // In a real application, this would fetch from an API endpoint
  // For development/demo purposes, return mock data with simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockParticleSizeDistributionTests);
    }, 300);
  });
}

/**
 * Fetch a specific PSD test by its unique ID
 */
export async function getPSDTestById(sampleId: string): Promise<PSDData[number] | null> {
  const allTests = await getPSDTests();
  const test = allTests.find(test => test.sample_unique_id === sampleId);
  return test || null;
}

/**
 * Fetch PSD tests by location ID
 */
export async function getPSDTestsByLocation(locationId: string): Promise<PSDData> {
  const allTests = await getPSDTests();
  const tests = allTests.filter(test => test.location_id === locationId);
  return tests;
}

/**
 * Fetch PSD tests by sample type
 */
export async function getPSDTestsBySampleType(sampleType: string): Promise<PSDData> {
  const allTests = await getPSDTests();
  const tests = allTests.filter(test => test.sample_type === sampleType);
  return tests;
}

/**
 * Get unique sample types from all tests
 */
export async function getUniqueSampleTypes(): Promise<string[]> {
  const allTests = await getPSDTests();
  const sampleTypes = new Set<string>();
  
  allTests.forEach(test => {
    sampleTypes.add(test.sample_type);
  });
  
  return Array.from(sampleTypes).sort();
}

/**
 * Get unique location IDs from all tests
 */
export async function getUniqueLocationIds(): Promise<string[]> {
  const allTests = await getPSDTests();
  const locationIds = new Set<string>();
  
  allTests.forEach(test => {
    locationIds.add(test.location_id);
  });
  
  return Array.from(locationIds).sort();
}
