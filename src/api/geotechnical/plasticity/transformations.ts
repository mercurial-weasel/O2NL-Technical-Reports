import { Atterbergs, AtterbergsRecord } from './types';
import proj4 from 'proj4';

// Set up coordinate system definitions
// NZTM2000 (EPSG:2193) definition
proj4.defs('EPSG:2193', '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');

// Function to convert NZTM2000 coordinates to WGS84 latitude/longitude
export const convertNZTM2000ToLatLng = (x: number, y: number): [number, number] => {
  try {
    // proj4 expects [x, y] and returns [longitude, latitude]
    const [lng, lat] = proj4('EPSG:2193', 'EPSG:4326', [x, y]);
    return [lat, lng]; // Return as [lat, lng] for Leaflet
  } catch (error) {
    console.error('Error converting coordinates:', error);
    return [0, 0]; // Return zeros as fallback
  }
};

/**
 * Format raw Atterbergs data from Supabase
 * - Convert date strings to readable format
 * - Calculate latLng from x_coordinate and y_coordinate
 */
export function formatAtterbergsData(data: AtterbergsRecord): Atterbergs {
  // Process date fields - convert ISO dates to readable format (DD-MM-YYYY)
  const formatDate = (dateStr: Date | null): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    } catch (e) {
      return dateStr ? dateStr.toString() : '';
    }
  };
  
  // Calculate latLng from x and y coordinates
  const latLng = convertNZTM2000ToLatLng(data.x_coordinate, data.y_coordinate);
  
  return {
    id: data.id,
    // Convert dates to the format used in the app
    date_sampled: formatDate(data.date_sampled),
    date_tested: formatDate(data.date_tested),
    date_checked: formatDate(data.date_checked),
    date_approved: formatDate(data.date_approved),
    // Copy all other fields
    test_type_method: data.test_type_method,
    test_type_name: data.test_type_name,
    display_name: data.display_name,
    ags_code: data.ags_code,
    adit_id: data.adit_id,
    location_id: data.location_id,
    depth_to: data.depth_to,
    sample_reference: data.sample_reference,
    sample_type: data.sample_type,
    sample_unique_id: data.sample_unique_id,
    test_no: data.test_no,
    liquid_limit: data.liquid_limit,
    plastic_limit: data.plastic_limit,
    plasticity_index: data.plasticity_index,
    water_content: data.water_content,
    remark_dot_test_remarks: data.remark_dot_test_remarks,
    chainage: data.chainage,
    distance_to_alignment: data.distance_to_alignment,
    angle_to_alignment_deg_cc: data.angle_to_alignment_deg_cc,
    construction_subzone: data.construction_subzone,
    x_coordinate: data.x_coordinate,
    y_coordinate: data.y_coordinate,
    // Add calculated latLng
    latLng
  };
}

/**
 * Determine soil classification based on Atterberg limits
 */
export function getSoilClassification(sample: Atterbergs): string {
  const ll = sample.liquid_limit;
  const pi = sample.plasticity_index;
  
  // Invalid data check
  if (ll === undefined || pi === undefined || isNaN(ll) || isNaN(pi)) {
    return 'Unknown';
  }
  
  // A-line equation: PI = 0.73 * (LL - 20)
  const aLine = 0.73 * (ll - 20);
  
  // Basic classification based on plasticity chart
  if (ll < 35) {
    // Low plasticity
    if (pi < 7) return 'ML'; // Low plasticity silt
    if (pi < aLine) return 'ML-CL'; // Silty clay of low plasticity
    return 'CL'; // Low plasticity clay
  } else if (ll < 50) {
    // Intermediate plasticity
    if (pi < aLine) return 'MI'; // Intermediate plasticity silt
    return 'CI'; // Intermediate plasticity clay
  } else if (ll < 70) {
    // High plasticity
    if (pi < aLine) return 'MH'; // High plasticity silt
    return 'CH'; // High plasticity clay
  } else {
    // Very high plasticity
    if (pi < aLine) return 'MV'; // Very high plasticity silt
    return 'CV'; // Very high plasticity clay
  }
}

// Export the getSoilClassification for use in components
export const utils = {
  getSoilClassification,
  convertNZTM2000ToLatLng
};
