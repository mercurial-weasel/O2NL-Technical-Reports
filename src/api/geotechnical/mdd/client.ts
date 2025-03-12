import { MDDData, MDDDataSchema } from './types';
import { mockTestData } from './mock-data';

/**
 * Fetch all maximum dry density tests
 */
export async function getMDDTests(): Promise<MDDData> {
  // In a real application, this would fetch from an API endpoint
  // For development/demo purposes, return mock data with simulated delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Validate data through Zod schema
      const data = MDDDataSchema.parse(mockTestData);
      resolve(data);
    }, 300);
  });
}

/**
 * Fetch a specific MDD test by its unique ID
 */
export async function getMDDTestById(sampleId: string): Promise<MDDData[number] | null> {
  const allTests = await getMDDTests();
  const test = allTests.find(test => test.sample_unique_id === sampleId);
  return test || null;
}

/**
 * Fetch MDD tests by location ID
 */
export async function getMDDTestsByLocation(locationId: string): Promise<MDDData> {
  const allTests = await getMDDTests();
  const tests = allTests.filter(test => test.location_id === locationId);
  return tests;
}

/**
 * Fetch MDD tests by sample type
 */
export async function getMDDTestsBySampleType(sampleType: string): Promise<MDDData> {
  const allTests = await getMDDTests();
  const tests = allTests.filter(test => test.sample_type === sampleType);
  return tests;
}

/**
 * Fetch MDD tests by test method
 */
export async function getMDDTestsByMethod(testMethod: string): Promise<MDDData> {
  const allTests = await getMDDTests();
  const tests = allTests.filter(test => test.test_type_method.includes(testMethod));
  return tests;
}

/**
 * Get unique sample types from all tests
 */
export async function getUniqueSampleTypes(): Promise<string[]> {
  const allTests = await getMDDTests();
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
  const allTests = await getMDDTests();
  const locationIds = new Set<string>();
  
  allTests.forEach(test => {
    locationIds.add(test.location_id);
  });
  
  return Array.from(locationIds).sort();
}

/**
 * Get unique test methods from all tests
 */
export async function getUniqueTestMethods(): Promise<string[]> {
  const allTests = await getMDDTests();
  const testMethods = new Set<string>();
  
  allTests.forEach(test => {
    testMethods.add(test.test_type_method);
  });
  
  return Array.from(testMethods).sort();
}
