import { PSDData, ParticleSizeDistributionTest } from './types';
import { mockParticleSizeDistributionTests } from './mock-data';
import { supabase } from '../../base/supabase';

// Check if we should use mock data
const USE_MOCK_DATA = false; // import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Fetch all particle size distribution tests
 */
export async function getPSDTests(): Promise<PSDData> {
  try {
    console.log('Fetching PSD data with Supabase');
    
    // Return mock data if configured
    if (USE_MOCK_DATA) {
      console.log('Using mock PSD data');
      return mockParticleSizeDistributionTests;
    }
    
    // Query all ParticleSizeDistributionTest records with their related SieveItem records
    const { data: psdTests, error } = await supabase
      .from('ParticleSizeDistributionTest')
      .select(`
        *,
        particle_size_result:SieveItem(*)
      `);
    
    if (error) {
      console.error('Error fetching PSD data from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    console.log(`Fetched ${psdTests.length} PSD tests from Supabase`);
    return psdTests;
  } catch (error) {
    console.error('Error fetching PSD data:', error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch a specific PSD test by its unique ID
 */
export async function getPSDTestById(sampleId: string): Promise<ParticleSizeDistributionTest | null> {
  try {
    // Return from mock data if configured
    if (USE_MOCK_DATA) {
      const mockTest = mockParticleSizeDistributionTests.find(
        test => test.sample_unique_id === sampleId
      );
      return mockTest || null;
    }
    
    // Query a specific ParticleSizeDistributionTest by sample_unique_id
    const { data, error } = await supabase
      .from('ParticleSizeDistributionTest')
      .select(`
        *,
        particle_size_result:SieveItem(*)
      `)
      .eq('sample_unique_id', sampleId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - record not found
        console.warn(`PSD test with ID ${sampleId} not found`);
        return null;
      }
      console.error(`Error fetching PSD test with ID ${sampleId} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching PSD test with ID ${sampleId}:`, error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch PSD tests by location ID
 */
export async function getPSDTestsByLocation(locationId: string): Promise<PSDData> {
  try {
    // Return filtered mock data if configured
    if (USE_MOCK_DATA) {
      return mockParticleSizeDistributionTests.filter(
        test => test.location_id === locationId
      );
    }
    
    // Query ParticleSizeDistributionTest records by location_id
    const { data, error } = await supabase
      .from('ParticleSizeDistributionTest')
      .select(`
        *,
        particle_size_result:SieveItem(*)
      `)
      .eq('location_id', locationId);
    
    if (error) {
      console.error(`Error fetching PSD tests for location ${locationId} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching PSD tests for location ${locationId}:`, error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch PSD tests by sample type
 */
export async function getPSDTestsBySampleType(sampleType: string): Promise<PSDData> {
  try {
    // Return filtered mock data if configured
    if (USE_MOCK_DATA) {
      return mockParticleSizeDistributionTests.filter(
        test => test.sample_type === sampleType
      );
    }
    
    // Query ParticleSizeDistributionTest records by sample_type
    const { data, error } = await supabase
      .from('ParticleSizeDistributionTest')
      .select(`
        *,
        particle_size_result:SieveItem(*)
      `)
      .eq('sample_type', sampleType);
    
    if (error) {
      console.error(`Error fetching PSD tests for sample type ${sampleType} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching PSD tests for sample type ${sampleType}:`, error);
    throw error;
  }
}

/**
 * Get unique sample types from all tests
 */
export async function getUniqueSampleTypes(): Promise<string[]> {
  try {
    if (USE_MOCK_DATA) {
      const sampleTypes = new Set<string>();
      mockParticleSizeDistributionTests.forEach(test => {
        sampleTypes.add(test.sample_type);
      });
      return Array.from(sampleTypes).sort();
    }
    
    // This is a bit tricky with Supabase - getting distinct values requires raw SQL
    // So we'll fetch all and extract unique values in JavaScript
    const { data, error } = await supabase
      .from('ParticleSizeDistributionTest')
      .select('sample_type');
    
    if (error) {
      console.error('Error fetching sample types from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const sampleTypes = new Set<string>();
    data.forEach(item => {
      if (item.sample_type) {
        sampleTypes.add(item.sample_type);
      }
    });
    
    return Array.from(sampleTypes).sort();
  } catch (error) {
    console.error('Error getting unique sample types:', error);
    throw error;
  }
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
