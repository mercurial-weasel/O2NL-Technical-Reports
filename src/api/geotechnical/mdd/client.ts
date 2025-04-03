import { MDDData, GeoMDD } from './types';
import { supabase } from '../../base/supabase';

/**
 * Fetch all MDD tests
 */
export async function getMDDTests(): Promise<MDDData> {
  try {
    console.log('Fetching MDD data with Supabase');
    
    // Query all Geo_MDD records with their related Geo_MDD_Result records
    const { data: mddTests, error } = await supabase
      .from('Geo_MDD')
      .select(`
        *,
        mdd_results:Geo_MDD_Result(*)
      `);
    
    if (error) {
      console.error('Error fetching MDD data from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    console.log(`Fetched ${mddTests.length} MDD tests from Supabase`);
    return mddTests;
  } catch (error) {
    console.error('Error fetching MDD data:', error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch a specific MDD test by its ID
 */
export async function getMDDTestById(id: string): Promise<GeoMDD | null> {
  try {
    // Query a specific Geo_MDD by id
    const { data, error } = await supabase
      .from('Geo_MDD')
      .select(`
        *,
        mdd_results:Geo_MDD_Result(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - record not found
        console.warn(`MDD test with ID ${id} not found`);
        return null;
      }
      console.error(`Error fetching MDD test with ID ${id} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching MDD test with ID ${id}:`, error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch MDD tests by POINT_ID
 */
export async function getMDDTestsByPointId(pointId: string): Promise<MDDData> {
  try {
    // Query Geo_MDD records by POINT_ID
    const { data, error } = await supabase
      .from('Geo_MDD')
      .select(`
        *,
        mdd_results:Geo_MDD_Result(*)
      `)
      .eq('POINT_ID', pointId);
    
    if (error) {
      console.error(`Error fetching MDD tests for point ${pointId} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching MDD tests for point ${pointId}:`, error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch MDD tests by sample type
 */
export async function getMDDTestsBySampleType(sampleType: string): Promise<MDDData> {
  try {
    // Query Geo_MDD records by SAMPLE_TYPE
    const { data, error } = await supabase
      .from('Geo_MDD')
      .select(`
        *,
        mdd_results:Geo_MDD_Result(*)
      `)
      .eq('SAMPLE_TYPE', sampleType);
    
    if (error) {
      console.error(`Error fetching MDD tests for sample type ${sampleType} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching MDD tests for sample type ${sampleType}:`, error);
    throw error;
  }
}

/**
 * Get unique sample types from all tests
 */
export async function getUniqueSampleTypes(): Promise<string[]> {
  try {
    // Fetch all sample types and extract unique values in JavaScript
    const { data, error } = await supabase
      .from('Geo_MDD')
      .select('SAMPLE_TYPE');
    
    if (error) {
      console.error('Error fetching sample types from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const sampleTypes = new Set<string>();
    data.forEach(item => {
      if (item.SAMPLE_TYPE) {
        sampleTypes.add(item.SAMPLE_TYPE);
      }
    });
    
    return Array.from(sampleTypes).sort();
  } catch (error) {
    console.error('Error getting unique sample types:', error);
    throw error;
  }
}

/**
 * Get unique POINT_ID values from all tests
 */
export async function getUniquePointIds(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('Geo_MDD')
      .select('POINT_ID');
    
    if (error) {
      console.error('Error fetching point IDs from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const pointIds = new Set<string>();
    data.forEach(item => {
      if (item.POINT_ID) {
        pointIds.add(item.POINT_ID);
      }
    });
    
    return Array.from(pointIds).sort();
  } catch (error) {
    console.error('Error getting unique point IDs:', error);
    throw error;
  }
}

/**
 * Get unique geological units from all tests
 */
export async function getUniqueGeologicalUnits(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('Geo_MDD')
      .select('geological_unit');
    
    if (error) {
      console.error('Error fetching geological units from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const geologicalUnits = new Set<string>();
    data.forEach(item => {
      if (item.geological_unit) {
        geologicalUnits.add(item.geological_unit);
      }
    });
    
    return Array.from(geologicalUnits).sort();
  } catch (error) {
    console.error('Error getting unique geological units:', error);
    throw error;
  }
}
