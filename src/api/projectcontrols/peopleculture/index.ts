/**
 * People & Culture API
 */

// Export everything from staff module - including all the transformations
export * from './staff';

// Hours tracking exports
export * from './hours';

// Export the HoursApiClient specifically
import { HoursApiClient } from './hours';
export { HoursApiClient };
