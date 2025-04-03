import { GeoMDD, MDDData } from './types';
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
 * Formats MDD test data for display and adds converted coordinates
 */
export function formatMDDData(data: GeoMDD): GeoMDD & { latLng?: [number, number] } {
  // Default result without latLng
  const result = {
    ...data,
    // Format numeric fields for display
    SAMPLE_TOP: Number(isFinite(Number(data.SAMPLE_TOP)) ? Number(data.SAMPLE_TOP).toFixed(1) : 0),
    SPECIMEN_TOP: Number(isFinite(Number(data.SPECIMEN_TOP)) ? Number(data.SPECIMEN_TOP).toFixed(1) : 0),
    distance_to_alignment: data.distance_to_alignment ? 
      Number(isFinite(Number(data.distance_to_alignment)) ? Number(data.distance_to_alignment).toFixed(1) : 0) : 
      undefined,
    angle_to_alignment_deg_cc: data.angle_to_alignment_deg_cc ? 
      Number(isFinite(Number(data.angle_to_alignment_deg_cc)) ? Number(data.angle_to_alignment_deg_cc).toFixed(1) : 0) : 
      undefined,
    x: data.x ? Number(isFinite(Number(data.x)) ? Number(data.x).toFixed(4) : 0) : undefined,
    y: data.y ? Number(isFinite(Number(data.y)) ? Number(data.y).toFixed(4) : 0) : undefined,
  };
  
  // Only add latLng if coordinate conversion succeeds
  if (data.x && data.y && isValidCoordinate(data.x) && isValidCoordinate(data.y)) {
    const latLng = convertNZTM2000ToLatLng(data.x, data.y);
    if (latLng) {
      return { ...result, latLng };
    }
  }
  
  return result;
}

// Interface for MDD test summary information
export interface MDDSummary {
  pointId: string;
  sampleId: string;
  sampleReference: string;
  specimenReference: string;
  sampleTop: number;
  sampleType: string;
  dateTestSummary: string;
  optimalWaterContent?: number;
  maximumDryDensity?: number;
  description?: string;
  geologicalUnit?: string;
  chainage?: number;
  distance_to_alignment?: number;
  construction_subzone?: string;
  coordinates?: {
    x?: number;
    y?: number;
  };
  latLng?: [number, number]; // Added to store converted coordinates
}

// Function to analyze MDD results and determine optimal water content and maximum dry density
function analyzeMDDResults(test: GeoMDD): { optimalWaterContent?: number; maximumDryDensity?: number } {
  if (!test.mdd_results || test.mdd_results.length === 0) {
    return {};
  }

  // Filter out any results with zero values
  const validResults = test.mdd_results.filter(
    result => result.water_content > 0 && result.dry_density > 0
  );

  if (validResults.length === 0) {
    return {};
  }

  // Find the result with maximum dry density
  const maxDensityResult = validResults.reduce(
    (prev, current) => (current.dry_density > prev.dry_density ? current : prev),
    validResults[0]
  );

  return {
    optimalWaterContent: maxDensityResult.water_content,
    maximumDryDensity: maxDensityResult.dry_density
  };
}

// Calculate summary for individual MDD test
function calculateMDDSummary(test: GeoMDD): MDDSummary {
  // Get optimal values from analysis
  const { optimalWaterContent, maximumDryDensity } = analyzeMDDResults(test);
  
  // Convert coordinates to lat/lng if available
  let latLng: [number, number] | undefined;
  if (test.x && test.y) {
    latLng = convertNZTM2000ToLatLng(test.x, test.y);
  }
  
  return {
    pointId: test.POINT_ID,
    sampleId: test.SAMPLE_ID,
    sampleReference: test.SAMPLE_REFERENCE,
    specimenReference: test.SPECIMEN_REFERENCE,
    sampleTop: test.SAMPLE_TOP,
    sampleType: test.SAMPLE_TYPE,
    dateTestSummary: `Sampled: ${test.DateSampled}, Tested: ${test.DateTested}, Checked: ${test.DateChecked}`,
    optimalWaterContent,
    maximumDryDensity,
    description: test.Description,
    geologicalUnit: test.geological_unit,
    chainage: test.chainage,
    distance_to_alignment: test.distance_to_alignment,
    construction_subzone: test.construction_subzone,
    coordinates: {
      x: test.x,
      y: test.y
    },
    latLng
  };
}

// Main function to transform MDD data into summaries
export function calculateMDDSummaries(data: MDDData): MDDSummary[] {
  return data.map(test => calculateMDDSummary(test));
}
