import { supabase } from '../base/supabase';

// Re-export all client functions from submodules
export * from './psd/client';
export * from './mdd/client';

// Common geotechnical API functions could be defined here
// For example, functions to get general geotechnical information

/**
 * Get all geological units from the database
 */
export async function getAllGeologicalUnits(): Promise<string[]> {
  try {
    // Get all unique geological units from multiple tables
    const uniqueUnits = new Set<string>();
    
    // Get from MDD
    const { data: mddData, error: mddError } = await supabase
      .from('Geo_MDD')
      .select('geological_unit');
      
    if (mddError) {
      console.error('Error fetching geological units from Geo_MDD:', mddError);
    } else {
      mddData.forEach(item => {
        if (item.geological_unit) {
          uniqueUnits.add(item.geological_unit);
        }
      });
    }
    
    // More tables could be queried here as they are added to the system
    
    return Array.from(uniqueUnits).sort();
  } catch (error) {
    console.error('Error getting geological units:', error);
    return [];
  }
}

/**
 * Get all construction subzones from the database
 */
export async function getAllConstructionSubzones(): Promise<string[]> {
  try {
    // Get all unique construction subzones from multiple tables
    const uniqueSubzones = new Set<string>();
    
    // Get from PSD
    const { data: psdData, error: psdError } = await supabase
      .from('ParticleSizeDistributionTest')
      .select('construction_subzone');
      
    if (psdError) {
      console.error('Error fetching construction subzones from PSD:', psdError);
    } else {
      psdData.forEach(item => {
        if (item.construction_subzone) {
          uniqueSubzones.add(item.construction_subzone);
        }
      });
    }
    
    // Get from MDD
    const { data: mddData, error: mddError } = await supabase
      .from('Geo_MDD')
      .select('construction_subzone');
      
    if (mddError) {
      console.error('Error fetching construction subzones from Geo_MDD:', mddError);
    } else {
      mddData.forEach(item => {
        if (item.construction_subzone) {
          uniqueSubzones.add(item.construction_subzone);
        }
      });
    }
    
    return Array.from(uniqueSubzones).sort();
  } catch (error) {
    console.error('Error getting construction subzones:', error);
    return [];
  }
}
