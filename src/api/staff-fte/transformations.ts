// Main transformations file that serves as an entry point and documentation
import { O2NL_Staff } from './types';
import { MonthColumn } from '../../components/Dashboards/ProjectControls/StaffFTE/types';

// Re-export types and functions from individual transformation files
export * from './transformations-fte-summary';
export * from './transformations-staff-numbers';
export * from './transformations-staff-movement';

/**
 * Staff Transformations Overview
 * 
 * This module provides three main types of staff data transformations:
 * 
 * 1. FTE Summaries (transformations-fte-summary.ts)
 *    - Calculates Full Time Equivalent (FTE) summaries
 *    - Breaks down FTE by organization, discipline, and NOP type
 *    - Provides monthly FTE totals and grand totals
 * 
 * 2. Staff Numbers (transformations-staff-numbers.ts)
 *    - Tracks actual headcount of staff
 *    - Provides user counts by organization, discipline, and NOP type
 *    - Includes monthly movement tracking (onboarding/offboarding)
 * 
 * 3. Staff Movement (transformations-staff-movement.ts)
 *    - Focuses on staff movement patterns
 *    - Tracks onboarding and offboarding across different categories
 *    - Provides monthly movement summaries
 * 
 * Usage:
 * ```typescript
 * import { 
 *   calculateFTESummaries,
 *   calculateNumberUsersSummaries,
 *   calculateStaffMovement
 * } from './transformations';
 * 
 * // Get FTE summaries
 * const fteSummaries = calculateFTESummaries(staffData, monthColumns);
 * 
 * // Get staff number summaries with movement tracking
 * const staffNumbers = calculateNumberUsersSummaries(staffData);
 * 
 * // Get detailed staff movement analysis
 * const staffMovement = calculateStaffMovement(staffData);
 * ```
 */

// Note: All implementation details are in their respective files
// This file serves as a central entry point and documentation