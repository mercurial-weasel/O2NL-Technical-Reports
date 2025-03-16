import { Atterbergs } from './types';
import proj4 from 'proj4';

// Set up coordinate system definitions
// NZTM2000 (EPSG:2193) definition
proj4.defs('EPSG:2193', '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');

/**
 * Converts NZTM2000 coordinates to WGS84 latitude/longitude
 */
export function convertNZTM2000ToLatLng(x: number, y: number): [number, number] {
  try {
    // proj4 expects [x, y] and returns [longitude, latitude]
    const [lng, lat] = proj4('EPSG:2193', 'EPSG:4326', [x, y]);
    return [lat, lng]; // Return as [lat, lng] for Leaflet
  } catch (error) {
    console.error('Error converting coordinates:', error);
    console.error('Input values:', x, y);
    // Return a default location in New Zealand as fallback
    return [-41.2865, 174.7762]; // Wellington, NZ
  }
}

/**
 * Formats Atterbergs test data for display
 */
export function formatAtterbergsData(data: Atterbergs): Atterbergs & { latLng?: [number, number] } {
  // Convert NZTM2000 coordinates to WGS84
  const latLng = convertNZTM2000ToLatLng(data.x_coordinate, data.y_coordinate);
  
  return {
    ...data,
    // Format any specific fields here if needed
    liquid_limit: Number(data.liquid_limit.toFixed(1)),
    plastic_limit: Number(data.plastic_limit.toFixed(1)),
    plasticity_index: Number(data.plasticity_index.toFixed(1)),
    water_content: Number(data.water_content.toFixed(1)),
    depth_to: Number(data.depth_to.toFixed(1)),
    distance_to_alignment: Number(data.distance_to_alignment.toFixed(1)),
    angle_to_alignment_deg_cc: Number(data.angle_to_alignment_deg_cc.toFixed(1)),
    x_coordinate: Number(data.x_coordinate.toFixed(4)),
    y_coordinate: Number(data.y_coordinate.toFixed(4)),
    // Add the converted coordinates
    latLng
  };
}

/**
 * Calculates soil classification based on Atterberg limits
 */
export function getSoilClassification(data: Atterbergs): string {
  const { liquid_limit, plasticity_index } = data;
  
  if (liquid_limit === 0 || plasticity_index === 0) {
    return 'Non-plastic';
  }
  
  // Casagrande plasticity chart classification
  if (liquid_limit < 50) {
    // Low plasticity
    if (plasticity_index > 0.73 * (liquid_limit - 20)) {
      return 'CL - Low plasticity clay';
    } else {
      return 'ML - Low plasticity silt';
    }
  } else {
    // High plasticity
    if (plasticity_index > 0.73 * (liquid_limit - 20)) {
      return 'CH - High plasticity clay';
    } else {
      return 'MH - High plasticity silt';
    }
  }
}

/**
 * Groups Atterbergs data by location
 */
export function groupAtterbergsByLocation(data: Atterbergs[]): Record<string, Atterbergs[]> {
  return data.reduce((acc, item) => {
    const key = item.location_id;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, Atterbergs[]>);
}
