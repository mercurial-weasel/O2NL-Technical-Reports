import { CBRData, GeoCBR } from './types';
import { supabase } from '../../base/supabase';

/**
 * Fetch all CBR tests
 */
export async function getCBRTests(): Promise<CBRData> {
  try {
    console.log('Fetching CBR data with Supabase');
    
    // Query all Geo_CBR records
    const { data: cbrTests, error } = await supabase
      .from('Geo_CBR')
      .select('*');
    
    if (error) {
      console.error('Error fetching CBR data from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    console.log(`Fetched ${cbrTests.length} CBR tests from Supabase`);
    return cbrTests;
  } catch (error) {
    console.error('Error fetching CBR data:', error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch a specific CBR test by its ID
 */
export async function getCBRTestById(id: string): Promise<GeoCBR | null> {
  try {
    // Query a specific Geo_CBR by id
    const { data, error } = await supabase
      .from('Geo_CBR')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        // No rows returned - record not found
        console.warn(`CBR test with ID ${id} not found`);
        return null;
      }
      console.error(`Error fetching CBR test with ID ${id} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching CBR test with ID ${id}:`, error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch CBR tests by sample_id
 */
export async function getCBRTestsBySampleId(sampleId: string): Promise<CBRData> {
  try {
    // Query Geo_CBR records by sample_id
    const { data, error } = await supabase
      .from('Geo_CBR')
      .select('*')
      .eq('sample_id', sampleId);
    
    if (error) {
      console.error(`Error fetching CBR tests for sample ${sampleId} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching CBR tests for sample ${sampleId}:`, error);
    throw error; // Propagate error to let the component handle it
  }
}

/**
 * Fetch CBR tests by investigation_id
 */
export async function getCBRTestsByInvestigationId(investigationId: string): Promise<CBRData> {
  try {
    // Query Geo_CBR records by investigation_id
    const { data, error } = await supabase
      .from('Geo_CBR')
      .select('*')
      .eq('investigation_id', investigationId);
    
    if (error) {
      console.error(`Error fetching CBR tests for investigation ${investigationId} from Supabase:`, error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching CBR tests for investigation ${investigationId}:`, error);
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
      .from('Geo_CBR')
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
 * Get unique investigation IDs from all tests
 */
export async function getUniqueInvestigationIds(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('Geo_CBR')
      .select('investigation_id');
    
    if (error) {
      console.error('Error fetching investigation IDs from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const investigationIds = new Set<string>();
    data.forEach(item => {
      if (item.investigation_id) {
        investigationIds.add(item.investigation_id);
      }
    });
    
    return Array.from(investigationIds).sort();
  } catch (error) {
    console.error('Error getting unique investigation IDs:', error);
    throw error;
  }
}

/**
 * Get unique geological units from all tests
 */
export async function getUniqueGeologicalUnits(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('Geo_CBR')
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

/**
 * Get unique O2NL stages from all tests
 */
export async function getUniqueO2NLStages(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('Geo_CBR')
      .select('o2nl_stage');
    
    if (error) {
      console.error('Error fetching O2NL stages from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }
    
    const stages = new Set<string>();
    data.forEach(item => {
      if (item.o2nl_stage) {
        stages.add(item.o2nl_stage);
      }
    });
    
    return Array.from(stages).sort();
  } catch (error) {
    console.error('Error getting unique O2NL stages:', error);
    throw error;
  }
}
