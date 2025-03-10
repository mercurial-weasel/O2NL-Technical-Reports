/**
 * Staff FTE API exports
 * 
 * This file exports all components from the staff FTE module, including client, types,
 * transformations, and data structures.
 */

// Export the API client
export { StaffFTEApiClient } from './client';

// Export types
export * from './types';

// Export all transformations and their types
export * from './transformations';
export * from './transformations-fte-summary';
export * from './transformations-staff-numbers2';
export * from './transformations-staff-movement';

// Export mock data
export { mockStaffFTEData } from './mock-data';
