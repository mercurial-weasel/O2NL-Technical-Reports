import { LabGradingData, GeoLabGrading } from './types';
import { supabase } from '../../base/supabase';

/**
 * Fetch all Lab Grading tests
 */
export async function getLabGradingTests(): Promise<LabGradingData> {
  try {
    console.log('Fetching Lab Grading data with Supabase');
    
    // Query all Geo_LabGrading records
    const { data: labGradingTests, error } = await supabase
      .from('Geo_LabGrading')
      .select('*');
    
    if (error) {
      console.error('Error fetching Lab Grading data from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    console.log(`Fetched ${labGradingTests.length} Lab Grading tests from Supabase`);
    return labGradingTests;
  } catch (error) {
    console.error('Error fetching Lab Grading data:', error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch a specific Lab Grading test by its ID
 */
export async function getLabGradingTestById(id: string): Promise<GeoLabGrading | null> {
  try {
    // Query a specific Geo_LabGrading by id
    const { data, error } = await supabase
      .from('Geo_LabGrading')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - record not found
        console.warn(`Lab Grading test with ID ${id} not found`);
        return null;
      }
      console.error(`Error fetching Lab Grading test with ID ${id} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching Lab Grading test with ID ${id}:`, error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch Lab Grading tests by sample_id
 */
export async function getLabGradingTestsBySampleId(sampleId: string): Promise<LabGradingData> {
  try {
    // Query Geo_LabGrading records by sample_id
    const { data, error } = await supabase
      .from('Geo_LabGrading')
      .select('*')
      .eq('sample_id', sampleId);
    
    if (error) {
      console.error(`Error fetching Lab Grading tests for sample ${sampleId} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching Lab Grading tests for sample ${sampleId}:`, error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch Lab Grading tests by point_id
 */
export async function getLabGradingTestsByPointId(pointId: string): Promise<LabGradingData> {
  try {
    // Query Geo_LabGrading records by point_id
    const { data, error } = await supabase
      .from('Geo_LabGrading')
      .select('*')
      .eq('point_id', pointId);
    
    if (error) {
      console.error(`Error fetching Lab Grading tests for point ${pointId} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching Lab Grading tests for point ${pointId}:`, error);
    throw error;
  }
}

/**
 * Get unique sample IDs from all tests
 */
export async function getUniqueSampleIds(): Promise<string[]> {
  try {
    // Fetch all sample IDs and extract unique values in JavaScript
    const { data, error } = await supabase
      .from('Geo_LabGrading')
      .select('sample_id');
    
    if (error) {
      console.error('Error fetching sample IDs from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const sampleIds = new Set<string>();
    data.forEach(item => {
      if (item.sample_id) {
        sampleIds.add(item.sample_id);
      }
    });
    
    return Array.from(sampleIds).sort();
  } catch (error) {
    console.error('Error getting unique sample IDs:', error);
    throw error;
  }
}

/**
 * Get unique point IDs from all tests
 */
export async function getUniquePointIds(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('Geo_LabGrading')
      .select('point_id');
    
    if (error) {
      console.error('Error fetching point IDs from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const pointIds = new Set<string>();
    data.forEach(item => {
      if (item.point_id) {
        pointIds.add(item.point_id);
      }
    });
    
    return Array.from(pointIds).sort();
  } catch (error) {
    console.error('Error getting unique point IDs:', error);
    throw error;
  }
}

/**
 * Get unique material IDs from all tests
 */
export async function getUniqueMaterialIds(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('Geo_LabGrading')
      .select('material_id');
    
    if (error) {
      console.error('Error fetching material IDs from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const materialIds = new Set<string>();
    data.forEach(item => {
      if (item.material_id) {
        materialIds.add(item.material_id);
      }
    });
    
    return Array.from(materialIds).sort();
  } catch (error) {
    console.error('Error getting unique material IDs:', error);
    throw error;
  }
}
