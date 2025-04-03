import { GeoSPT, SPTData } from './types';
import { convertNZTM2000ToLatLng, isValidCoordinate } from '../transformations';

/**
 * Formats SPT test data for display and adds converted coordinates
 */
export function formatSPTData(data: GeoSPT): GeoSPT & { latLng?: [number, number] } {
  // Default result without latLng
  const result = {
    ...data,
    // Format numeric fields for display if needed
  };
  
  // Only add latLng if coordinate conversion succeeds
  if (data.x_coordinate && data.y_coordinate && 
      isValidCoordinate(data.x_coordinate) && 
      isValidCoordinate(data.y_coordinate)) {
    const latLng = convertNZTM2000ToLatLng(data.x_coordinate, data.y_coordinate);
    if (latLng) {
      return { ...result, latLng };
    }
  }
  
  return result;
}

// Interface for SPT test summary information
export interface SPTSummary {
  boreholeId: string;
  depth: number;
  nValue: number;
  testDate?: string;
  geologicalUnit?: string;
  coordinates?: {
    x?: number;
    y?: number;
  };
  latLng?: [number, number]; // WGS84 coordinates
}

// Calculate summary for individual SPT test
function calculateSPTSummary(test: GeoSPT): SPTSummary {
  // Convert coordinates to lat/lng if available
  let latLng: [number, number] | undefined;
  if (test.x_coordinate && test.y_coordinate) {
    latLng = convertNZTM2000ToLatLng(test.x_coordinate, test.y_coordinate);
  }
  
  return {
    boreholeId: test.borehole_id || 'Unknown',
    depth: test.depth || 0,
    nValue: test.n_value || 0,
    testDate: test.test_date,
    geologicalUnit: test.geological_unit,
    coordinates: {
      x: test.x_coordinate,
      y: test.y_coordinate
    },
    latLng
  };
}

// Main function to transform SPT data into summaries
export function calculateSPTSummaries(data: SPTData): SPTSummary[] {
  return data.map(test => calculateSPTSummary(test));
}
