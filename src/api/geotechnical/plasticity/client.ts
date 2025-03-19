import { Atterbergs, AtterbergsFilters, AtterbergsResponse } from './types';
import { mockData } from './mock-data';
import { supabase } from '../../base/supabase';
import { formatAtterbergsData } from './transformations';

// Check if we should use mock data
const USE_MOCK_DATA = false; // import.meta.env.VITE_USE_MOCK_DATA === 'true';

/**
 * Fetch all Atterbergs tests with optional filtering
 */
export async function getAtterbergsData(filters?: AtterbergsFilters): Promise<AtterbergsResponse> {
  try {
    console.log('Fetching Atterbergs data with Supabase');
    
    // Return mock data if configured
    if (USE_MOCK_DATA) {
      console.log('Using mock Atterbergs data');
      let filteredData = [...mockData];
      
      // Apply filters to mock data
      if (filters) {
        if (filters.adit_id) {
          filteredData = filteredData.filter(item => item.adit_id === filters.adit_id);
        }
        if (filters.location_id) {
          filteredData = filteredData.filter(item => item.location_id === filters.location_id);
        }
        if (filters.sample_unique_id) {
          filteredData = filteredData.filter(item => item.sample_unique_id === filters.sample_unique_id);
        }
        if (filters.construction_subzone) {
          filteredData = filteredData.filter(item => item.construction_subzone === filters.construction_subzone);
        }
      }
      
      // Format the mock data
      const formattedData = filteredData.map(formatAtterbergsData);
      
      return {
        data: formattedData,
        meta: {
          total: formattedData.length
        }
      };
    }
    
    // Build the Supabase query
    let query = supabase
      .from('Geo_Atterbergs')
      .select('*');
    
    // Apply filters if provided
    if (filters) {
      if (filters.adit_id) {
        query = query.eq('adit_id', filters.adit_id);
      }
      if (filters.location_id) {
        query = query.eq('location_id', filters.location_id);
      }
      if (filters.sample_unique_id) {
        query = query.eq('sample_unique_id', filters.sample_unique_id);
      }
      if (filters.construction_subzone) {
        query = query.eq('construction_subzone', filters.construction_subzone);
      }
    }
    
    // Execute the query
    const { data, error, count } = await query.select('*', { count: 'exact' });
    
    if (error) {
      console.error('Error fetching Atterbergs data from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    // Format the data
    const formattedData = data ? data.map(formatAtterbergsData) : [];
    
    console.log(`Fetched ${formattedData.length} Atterbergs tests from Supabase`);
    
    return {
      data: formattedData,
      meta: {
        total: count || formattedData.length
      }
    };
  } catch (error) {
    console.error('Error fetching Atterbergs data:', error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch a specific Atterbergs test by its unique ID
 */
export async function getAtterbergsById(sampleId: string): Promise<Atterbergs | null> {
  try {
    // Return from mock data if configured
    if (USE_MOCK_DATA) {
      const mockTest = mockData.find(
        test => test.sample_unique_id === sampleId
      );
      return mockTest ? formatAtterbergsData(mockTest) : null;
    }
    
    // Query a specific Atterbergs test by sample_unique_id
    const { data, error } = await supabase
      .from('Geo_Atterbergs')
      .select('*')
      .eq('sample_unique_id', sampleId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - record not found
        console.warn(`Atterbergs test with ID ${sampleId} not found`);
        return null;
      }
      console.error(`Error fetching Atterbergs test with ID ${sampleId} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return formatAtterbergsData(data);
  } catch (error) {
    console.error(`Error fetching Atterbergs test with ID ${sampleId}:`, error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Get unique sample types from all Atterbergs tests
 */
export async function getUniqueSampleTypes(): Promise<string[]> {
  try {
    if (USE_MOCK_DATA) {
      const sampleTypes = new Set<string>();
      mockData.forEach(test => {
        sampleTypes.add(test.sample_type);
      });
      return Array.from(sampleTypes).sort();
    }
    
    // This is a bit tricky with Supabase - getting distinct values requires raw SQL
    // So we'll fetch all and extract unique values in JavaScript
    const { data, error } = await supabase
      .from('Geo_Atterbergs')
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
 * Get unique location IDs from all Atterbergs tests
 */
export async function getUniqueLocationIds(): Promise<string[]> {
  try {
    if (USE_MOCK_DATA) {
      const locationIds = new Set<string>();
      mockData.forEach(test => {
        locationIds.add(test.location_id);
      });
      return Array.from(locationIds).sort();
    }
    
    const { data, error } = await supabase
      .from('Geo_Atterbergs')
      .select('location_id');
    
    if (error) {
      console.error('Error fetching location IDs from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const locationIds = new Set<string>();
    data.forEach(item => {
      if (item.location_id) {
        locationIds.add(item.location_id);
      }
    });
    
    return Array.from(locationIds).sort();
  } catch (error) {
    console.error('Error getting unique location IDs:', error);
    throw error;
  }
}

/**
 * Get unique construction subzones from all Atterbergs tests
 */
export async function getUniqueConstructionSubzones(): Promise<string[]> {
  try {
    if (USE_MOCK_DATA) {
      const subzones = new Set<string>();
      mockData.forEach(test => {
        subzones.add(test.construction_subzone);
      });
      return Array.from(subzones).sort();
    }
    
    const { data, error } = await supabase
      .from('Geo_Atterbergs')
      .select('construction_subzone');
    
    if (error) {
      console.error('Error fetching construction subzones from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const subzones = new Set<string>();
    data.forEach(item => {
      if (item.construction_subzone) {
        subzones.add(item.construction_subzone);
      }
    });
    
    return Array.from(subzones).sort();
  } catch (error) {
    console.error('Error getting unique construction subzones:', error);
    throw error;
  }
}
