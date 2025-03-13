import { BaseApiClient } from '@api/base/client';
import { Atterbergs, AtterbergsFilters, AtterbergsResponse } from './types';
import { mockData } from './mock-data';
import { formatAtterbergsData } from './transformations';

const ENDPOINT = '/api/geotechnical/atterbergs';

class AtterbergsApiClient extends BaseApiClient {
  /**
   * Fetches Atterbergs data with optional filtering
   */
  async getAtterbergsData(filters?: AtterbergsFilters): Promise<AtterbergsResponse> {
    // Build query parameters for filtering
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `${ENDPOINT}?${queryString}` : ENDPOINT;
    
    // Use mock data filtering if useMockData is enabled
    let mockResponse = mockData;
    if (filters) {
      if (filters.adit_id) {
        mockResponse = mockResponse.filter(item => item.adit_id === filters.adit_id);
      }
      if (filters.location_id) {
        mockResponse = mockResponse.filter(item => item.location_id === filters.location_id);
      }
      if (filters.sample_unique_id) {
        mockResponse = mockResponse.filter(item => item.sample_unique_id === filters.sample_unique_id);
      }
    }
    
    // Fetch data using the base client
    const response = await this.fetchData<Atterbergs[]>(endpoint, mockResponse);
    
    // Format the data
    const formattedData = response.data.map(formatAtterbergsData);
    
    return {
      ...response,
      data: formattedData
    };
  }

  /**
   * Fetches a single Atterbergs test by ID
   */
  async getAtterbergsById(id: string): Promise<Atterbergs> {
    // Find mock data by ID if using mock data
    const mockItem = mockData.find(test => test.sample_unique_id === id);
    if (!mockItem && this.useMockData) {
      throw new Error(`Atterbergs test with ID ${id} not found`);
    }
    
    const response = await this.fetchData<Atterbergs>(`${ENDPOINT}/${id}`, mockItem);
    return formatAtterbergsData(response.data);
  }
}

// Create a singleton instance
const atterbergsApiClient = new AtterbergsApiClient();

// Export wrapper functions for backward compatibility
export async function fetchAtterbergsData(filters?: AtterbergsFilters): Promise<AtterbergsResponse> {
  return atterbergsApiClient.getAtterbergsData(filters);
}

export async function fetchAtterbergsById(id: string): Promise<Atterbergs> {
  return atterbergsApiClient.getAtterbergsById(id);
}
