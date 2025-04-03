import { GeoCBR, CBRData } from './types';
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
 * Formats CBR test data for display and adds converted coordinates if available
 */
export function formatCBRData(data: GeoCBR): GeoCBR & { latLng?: [number, number] } {
  // Default result without latLng
  const result = {
    ...data,
    // Format numeric fields for display if they exist
    depth_to: Number(isFinite(Number(data.depth_to)) ? Number(data.depth_to).toFixed(1) : 0),
    depth_bottom: Number(isFinite(Number(data.depth_bottom)) ? Number(data.depth_bottom).toFixed(1) : 0),
    chainage: data.chainage ? 
      Number(isFinite(Number(data.chainage)) ? Number(data.chainage).toFixed(1) : 0) : 
      undefined,
    cbr_perc: data.cbr_perc ? 
      Number(isFinite(Number(data.cbr_perc)) ? Number(data.cbr_perc).toFixed(1) : 0) : 
      undefined,
    water_content_compacted: data.water_content_compacted ? 
      Number(isFinite(Number(data.water_content_compacted)) ? Number(data.water_content_compacted).toFixed(1) : 0) : 
      undefined,
    water_content_plunger: data.water_content_plunger ? 
      Number(isFinite(Number(data.water_content_plunger)) ? Number(data.water_content_plunger).toFixed(1) : 0) : 
      undefined,
  };
  
  // Only add latLng if we can derive coordinates
  // Note: CBR doesn't have direct x/y coordinates in the schema, but we could potentially 
  // add code here to derive coordinates from other fields if needed
  
  return result;
}

// Interface for CBR test summary information
export interface CBRSummary {
  sampleId: string;
  investigationId: string;
  fullInvestigationId: string;
  depthRange: string;
  cbrPercentage?: number;
  waterContentCompacted?: number;
  waterContentPlunger?: number;
  swellPercentage?: number;
  oversizeMaterialPercentage?: number;
  geologicalUnit?: string;
  treatment?: string;
  surchargeInfo?: string;
  chainage?: number;
  remarks?: string;
  densityInfo?: {
    bulkDensity?: number;
    dryDensity?: number;
  };
  latLng?: [number, number]; // Added for any potential coordinate data
}

// Calculate summary for individual CBR test
function calculateCBRSummary(test: GeoCBR): CBRSummary {
  // Create surcharge info string if available
  let surchargeInfo: string | undefined;
  if (test.surcharge_mass) {
    surchargeInfo = `${test.surcharge_mass} kg`;
  }
  
  // Format depth range as a string
  const depthRange = `${test.depth_to.toFixed(1)} - ${test.depth_bottom.toFixed(1)} m`;
  
  // Assemble density information if available
  const densityInfo: { bulkDensity?: number; dryDensity?: number } = {};
  if (test.bulk_density) densityInfo.bulkDensity = test.bulk_density;
  if (test.dry_density) densityInfo.dryDensity = test.dry_density;
  
  return {
    sampleId: test.sample_id,
    investigationId: test.investigation_id,
    fullInvestigationId: test.full_investigation_id,
    depthRange,
    cbrPercentage: test.cbr_perc,
    waterContentCompacted: test.water_content_compacted,
    waterContentPlunger: test.water_content_plunger,
    swellPercentage: test.swell_perc,
    oversizeMaterialPercentage: test.oversize_material_perc,
    geologicalUnit: test.geological_unit,
    treatment: test.treatment,
    surchargeInfo,
    chainage: test.chainage,
    remarks: test.remarks,
    densityInfo: Object.keys(densityInfo).length > 0 ? densityInfo : undefined,
  };
}

// Main function to transform CBR data into summaries
export function calculateCBRSummaries(data: CBRData): CBRSummary[] {
  return data.map(test => calculateCBRSummary(test));
}
