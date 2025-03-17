import { ParticleSizeDistributionTest, PSDData } from './types';
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
    
    return [lat, lng]; // Return as [lat, lng] for Leaflet
  } catch (error) {
    console.error('Error converting coordinates:', error);
    console.error('Input values:', { x, y });
    return undefined; // Return undefined instead of default location
  }
}

/**
 * Formats PSD test data for display and adds converted coordinates
 */
export function formatPSDData(data: ParticleSizeDistributionTest): ParticleSizeDistributionTest & { latLng?: [number, number] } {
  // Default result without latLng
  const result = {
    ...data,
    // Format numeric fields for display
    depth_to: Number(isFinite(Number(data.depth_to)) ? Number(data.depth_to).toFixed(1) : 0),
    distance_to_alignment: Number(isFinite(Number(data.distance_to_alignment)) ? Number(data.distance_to_alignment).toFixed(1) : 0),
    angle_to_alignment_deg_cc: Number(isFinite(Number(data.angle_to_alignment_deg_cc)) ? Number(data.angle_to_alignment_deg_cc).toFixed(1) : 0),
    x_coordinate: Number(isFinite(Number(data.x_coordinate)) ? Number(data.x_coordinate).toFixed(4) : 0),
    y_coordinate: Number(isFinite(Number(data.y_coordinate)) ? Number(data.y_coordinate).toFixed(4) : 0),
  };
  
  // Only add latLng if coordinate conversion succeeds
  if (isValidCoordinate(data.x_coordinate) && isValidCoordinate(data.y_coordinate)) {
    const latLng = convertNZTM2000ToLatLng(data.x_coordinate, data.y_coordinate);
    if (latLng) {
      return { ...result, latLng };
    }
  }
  
  return result;
}

// Interface for PSD test summary information
export interface PSDSummary {
  sampleId: string;
  locationId: string;
  depth: number;
  sampleType: string;
  dateTestSummary: string;
  d10?: number; // Size at which 10% of the material is finer
  d30?: number; // Size at which 30% of the material is finer
  d60?: number; // Size at which 60% of the material is finer
  cu?: number;  // Uniformity coefficient (D60/D10)
  cc?: number;  // Coefficient of curvature (D30²/(D10*D60))
  soilClassification: string;
  gravel: number; // Percentage of gravel (>4.75mm)
  sand: number;   // Percentage of sand (0.075-4.75mm)
  silt: number;   // Percentage of fines (<0.075mm)
  chainage: number;
  distance_to_alignment: number;
  construction_subzone: string;
  coordinates: {
    x: number;
    y: number;
  };
  latLng?: [number, number]; // Added to store converted coordinates
}

// Find the approximate sieve size for a given percent passing using linear interpolation
function getSizeForPercentPassing(test: ParticleSizeDistributionTest, targetPercent: number): number | undefined {
  const results = [...test.particle_size_result].sort((a, b) => a.percent_passing - b.percent_passing);
  
  // Find the bracketing points
  for (let i = 0; i < results.length - 1; i++) {
    const lower = results[i];
    const upper = results[i + 1];
    
    if (lower.percent_passing <= targetPercent && upper.percent_passing >= targetPercent) {
      // Linear interpolation
      return lower.sieve_size_mm + 
        (upper.sieve_size_mm - lower.sieve_size_mm) * 
        ((targetPercent - lower.percent_passing) / (upper.percent_passing - lower.percent_passing));
    }
  }
  
  return undefined;
}

// Get soil classification based on percentages
function classifySoil(gravel: number, sand: number, fines: number): string {
  if (gravel >= 50) {
    return fines > 12 ? "Gravel with fines" : "Clean gravel";
  } else if (sand >= 50) {
    return fines > 12 ? "Sand with fines" : "Clean sand";
  } else {
    return "Fine-grained soil";
  }
}

// Calculate summary for individual PSD test
function calculatePSDSummary(test: ParticleSizeDistributionTest): PSDSummary {
  // Calculate D values
  const d10 = getSizeForPercentPassing(test, 10);
  const d30 = getSizeForPercentPassing(test, 30);
  const d60 = getSizeForPercentPassing(test, 60);
  
  // Calculate coefficients
  let cu: number | undefined;
  let cc: number | undefined;
  
  if (d10 && d60 && d10 > 0) {
    cu = d60 / d10;
    if (d30) {
      cc = (d30 * d30) / (d10 * d60);
    }
  }
  
  // Find percentage bounds for gravel, sand, and fines
  const findPercentPassingAt = (size: number): number => {
    const exact = test.particle_size_result.find(item => item.sieve_size_mm === size);
    if (exact) return exact.percent_passing;
    
    // Find bracketing values and interpolate
    const smaller = [...test.particle_size_result]
      .filter(item => item.sieve_size_mm < size)
      .sort((a, b) => b.sieve_size_mm - a.sieve_size_mm)[0];
    
    const larger = [...test.particle_size_result]
      .filter(item => item.sieve_size_mm > size)
      .sort((a, b) => a.sieve_size_mm - b.sieve_size_mm)[0];
    
    if (!smaller || !larger) {
      return smaller ? smaller.percent_passing : 
             larger ? larger.percent_passing : 0;
    }
    
    // Linear interpolation
    return smaller.percent_passing + 
      (larger.percent_passing - smaller.percent_passing) * 
      ((size - smaller.sieve_size_mm) / (larger.sieve_size_mm - smaller.sieve_size_mm));
  };
  
  const percentPassing4_75mm = findPercentPassingAt(4.75);
  const percentPassing0_075mm = findPercentPassingAt(0.075);
  
  // Calculate material percentages
  const gravel = 100 - percentPassing4_75mm;
  const sand = percentPassing4_75mm - percentPassing0_075mm;
  const silt = percentPassing0_075mm;
  
  // Convert coordinates to lat/lng
  const latLng = convertNZTM2000ToLatLng(test.x_coordinate, test.y_coordinate);
  
  return {
    sampleId: test.sample_unique_id,
    locationId: test.location_id,
    depth: test.depth_to,
    sampleType: test.sample_type,
    dateTestSummary: `Sampled: ${test.date_sampled}, Tested: ${test.date_tested}`,
    d10,
    d30,
    d60,
    cu,
    cc,
    soilClassification: classifySoil(gravel, sand, silt),
    gravel,
    sand,
    silt,
    chainage: test.chainage,
    distance_to_alignment: test.distance_to_alignment,
    construction_subzone: test.construction_subzone,
    coordinates: {
      x: test.x_coordinate,
      y: test.y_coordinate
    },
    latLng // Add the converted coordinates
  };
}

// Main function to transform PSD data into summaries
export function calculatePSDSummaries(data: PSDData): PSDSummary[] {
  return data.map(test => calculatePSDSummary(test));
}
