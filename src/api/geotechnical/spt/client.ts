// src/api/spt/client.ts
import { BaseApiClient } from '@api/base/client';
import { SPTResponse, SPTData, GeoSPT } from './types';
import { API_CONFIG } from '@data/config/api';
import { mockSPTData } from './mock-data';
import { supabase } from '../../base/supabase';

export class SPTApiClient extends BaseApiClient {
  async fetchSPTData(): Promise<SPTResponse> {
    const response = await this.fetchData<SPTResponse>(
      API_CONFIG.endpoints.spt,
      {
        points: mockSPTData.points,
        sptResults: mockSPTData.sptResults,
        lastLoadTime: new Date().toISOString(),
        recordCount: mockSPTData.points.length + mockSPTData.sptResults.length,
        rawData: mockSPTData
      }
    );
    return response.data;
  }

  /**
   * Fetch all SPT tests
   */
  static async getAllSPTTests(): Promise<SPTData> {
    try {
      console.log('Fetching SPT data with Supabase');
      
      // Query all Geo_SPT records
      const { data: sptTests, error } = await supabase
        .from('Geo_SPT')
        .select('*');
      
      if (error) {
        console.error('Error fetching SPT data from Supabase:', error);
        throw new Error(`Supabase error: ${error.message}`);
      }
      
      console.log(`Fetched ${sptTests.length} SPT tests from Supabase`);
      return sptTests;
    } catch (error) {
      console.error('Error fetching SPT data:', error);
      throw error; // Propagate error to let the component handle it
    }
  }

  /**
   * Fetch a specific SPT test by its ID
   */
  static async getSPTTestById(id: string): Promise<GeoSPT | null> {
    try {
      // Query a specific Geo_SPT by id
      const { data, error } = await supabase
        .from('Geo_SPT')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No rows returned - record not found
          console.warn(`SPT test with ID ${id} not found`);
          return null;
        }
        console.error(`Error fetching SPT test with ID ${id} from Supabase:`, error);
        throw new Error(`Supabase error: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching SPT test with ID ${id}:`, error);
      throw error; // Propagate error to let the component handle it
    }
  }

  /**
   * Get unique borehole IDs from all tests
   */
  static async getUniqueBoreholeIds(): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('Geo_SPT')
        .select('borehole_id');
      
      if (error) {
        console.error('Error fetching borehole IDs from Supabase:', error);
        throw new Error(`Supabase error: ${error.message}`);
      }
      
      const boreholeIds = new Set<string>();
      data.forEach(item => {
        if (item.borehole_id) {
          boreholeIds.add(item.borehole_id);
        }
      });
      
      return Array.from(boreholeIds).sort();
    } catch (error) {
      console.error('Error getting unique borehole IDs:', error);
      throw error;
    }
  }

  /**
   * Fetch SPT tests by depth range
   */
  static async getSPTTestsByDepthRange(minDepth: number, maxDepth: number): Promise<SPTData> {
    try {
      // Query Geo_SPT records within a depth range
      const { data, error } = await supabase
        .from('Geo_SPT')
        .select('*')
        .gte('depth', minDepth)
        .lte('depth', maxDepth);
      
      if (error) {
        console.error(`Error fetching SPT tests within depth range from Supabase:`, error);
        throw new Error(`Supabase error: ${error.message}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Error fetching SPT tests within depth range:`, error);
      throw error;
    }
  }
}

// Individual function exports (alternative approach)
export async function getAllSPTTests(): Promise<SPTData> {
  return SPTApiClient.getAllSPTTests();
}

export async function getSPTTestById(id: string): Promise<GeoSPT | null> {
  return SPTApiClient.getSPTTestById(id);
}

export async function getUniqueBoreholeIds(): Promise<string[]> {
  return SPTApiClient.getUniqueBoreholeIds();
}

export async function getSPTTestsByDepthRange(minDepth: number, maxDepth: number): Promise<SPTData> {
  return SPTApiClient.getSPTTestsByDepthRange(minDepth, maxDepth);
}
