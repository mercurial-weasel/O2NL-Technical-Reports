import { GeoLabGrading, LabGradingData } from './types';
import proj4 from 'proj4';

// Set up coordinate system definitions
// NZTM2000 (EPSG:2193) definition
proj4.defs('EPSG:2193', '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');

/**
 * Validates if a value is a finite number
 */
function isValidCoordinate(value: any): boolean {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

/**
 * Converts NZTM2000 coordinates to WGS84 latitude/longitude
 */
export function convertNZTM2000ToLatLng(x: number, y: number): [number, number] | undefined {
  try {
    // Validate coordinates
    if (!isValidCoordinate(x) || !isValidCoordinate(y)) {
      console.error('Invalid coordinates:', { x, y });
      return undefined;
    }
    
    // Check for reasonable NZTM2000 bounds for New Zealand
    if (x < 1000000 || x > 2100000 || y < 4700000 || y > 6200000) {
      console.warn('Coordinates outside normal NZTM2000 bounds for New Zealand:', { x, y });
      // Continue anyway, but log the warning
    }
    
    // proj4 expects [x, y] and returns [longitude, latitude]
    const [lng, lat] = proj4('EPSG:2193', 'EPSG:4326', [x, y]);
    
    // Validate the result
    if (!isValidCoordinate(lat) || !isValidCoordinate(lng)) {
      console.error('Invalid conversion result:', { lat, lng });
      return undefined;
    }
    
    // Additional check: Validate coordinates are within reasonable WGS84 bounds for New Zealand
    if (lat < -47.5 || lat > -34 || lng < 166 || lng > 179) {
      console.warn('Converted coordinates outside expected WGS84 bounds for New Zealand:', { lat, lng });
      // Continue but log the warning
    }
    
    return [lat, lng]; // Return as [lat, lng] for Leaflet
  } catch (error) {
    console.error('Error converting coordinates:', error);
    console.error('Input values:', { x, y });
    return undefined; // Return undefined instead of default location
  }
}

/**
 * Formats LabGrading test data for display and adds converted coordinates if available
 */
export function formatLabGradingData(data: GeoLabGrading): GeoLabGrading & { latLng?: [number, number] } {
  // Convert national coordinates to lat/lng if available
  let latLng: [number, number] | undefined;
  if (isValidCoordinate(data.national_east) && isValidCoordinate(data.national_north)) {
    latLng = convertNZTM2000ToLatLng(data.national_east, data.national_north);
  }
  
  return {
    ...data,
    // Format numeric fields for display
    sample_top: data.sample_top !== null ? 
      Number(isFinite(Number(data.sample_top)) ? Number(data.sample_top).toFixed(1) : 0) : 
      undefined,
    perc_passing: Number(isFinite(Number(data.perc_passing)) ? Number(data.perc_passing).toFixed(1) : 0),
    item: Number(isFinite(Number(data.item)) ? Number(data.item).toFixed(1) : 0),
    latLng,
  };
}

// Interface for LabGrading test summary information
export interface LabGradingSummary {
  pointId: string;
  sampleId?: string;
  materialId?: string;
  geologyDescription?: string;
  sampleTop?: number;
  sampleReference?: string;
  item: number;
  percPassing: number;
  coordinates: {
    latitude: number;
    longitude: number;
    nationalEast: number;
    nationalNorth: number;
    nationalElevation: number;
  };
  latLng?: [number, number]; // Added for map display
}

// Calculate summary for individual LabGrading test
function calculateLabGradingSummary(test: GeoLabGrading): LabGradingSummary {
  // Convert coordinates for mapping
  let latLng: [number, number] | undefined;
  if (isValidCoordinate(test.national_east) && isValidCoordinate(test.national_north)) {
    latLng = convertNZTM2000ToLatLng(test.national_east, test.national_north);
  }
  
  return {
    pointId: test.point_id,
    sampleId: test.sample_id,
    materialId: test.material_id,
    geologyDescription: test.geology_description,
    sampleTop: test.sample_top,
    sampleReference: test.sample_reference,
    item: test.item,
    percPassing: test.perc_passing,
    coordinates: {
      latitude: test.latitude,
      longitude: test.longitude,
      nationalEast: test.national_east,
      nationalNorth: test.national_north,
      nationalElevation: test.national_elevation
    },
    latLng
  };
}

// Main function to transform LabGrading data into summaries
export function calculateLabGradingSummaries(data: LabGradingData): LabGradingSummary[] {
  return data.map(test => calculateLabGradingSummary(test));
}

/**
 * Groups lab grading data by sample ID to make it easier to analyze
 * multiple measurements for the same sample
 */
export function groupLabGradingBySample(data: LabGradingData): Record<string, LabGradingData> {
  const result: Record<string, LabGradingData> = {};
  
  data.forEach(test => {
    const sampleId = test.sample_id || 'unknown';
    if (!result[sampleId]) {
      result[sampleId] = [];
    }
    result[sampleId].push(test);
  });
  
  return result;
}
