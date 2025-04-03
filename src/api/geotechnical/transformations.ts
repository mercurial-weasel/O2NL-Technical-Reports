import proj4 from 'proj4';

// Re-export transformations from submodules
export * from './psd/transformations';
export * from './mdd/transformations';

// Set up coordinate system definitions for project-wide use
// NZTM2000 (EPSG:2193) definition
proj4.defs('EPSG:2193', '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');

/**
 * Validates if a value is a finite number
 * Shared utility function for coordinate validation
 */
export function isValidCoordinate(value: any): boolean {
  return typeof value === 'number' && isFinite(value) && !isNaN(value);
}

/**
 * Converts NZTM2000 coordinates to WGS84 latitude/longitude
 * Shared utility function for all geotechnical modules
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
 * Common formatting function for geotechnical test data
 * This could be extended with shared formatting logic
 */
export function formatTestDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    // Try to parse and format date if it's a valid date string
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Not a valid date, return original
      return dateString;
    }
    
    // Format: DD-MM-YYYY
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
  } catch (error) {
    console.warn('Error formatting date:', error);
    return dateString;
  }
}

/**
 * Safely convert value to fixed decimal string and then to number
 */
export function formatNumber(value: any, decimals: number = 2): number | undefined {
  if (value === null || value === undefined) return undefined;
  
  const num = Number(value);
  if (isNaN(num)) return undefined;
  
  return Number(num.toFixed(decimals));
}
