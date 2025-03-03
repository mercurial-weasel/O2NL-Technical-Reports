import { EmissionRecord } from './types';

/**
 * Calculate total carbon estimate for all records.
 */
export function calculateTotalCarbonEstimate(records: EmissionRecord[]): number {
  return parseFloat(records.reduce((sum, record) => sum + record.carbonEstimateKgCO2e, 0).toFixed(2));
}

/**
 * Get emissions data grouped by category
 */
export function getEmissionsByCategory(records: EmissionRecord[]): Record<string, EmissionRecord[]> {
  return records.reduce((acc, record) => {
    if (!acc[record.category]) {
      acc[record.category] = [];
    }
    acc[record.category].push(record);
    return acc;
  }, {} as Record<string, EmissionRecord[]>);
}

/**
 * Get emissions data for a specific time period
 */
export function getEmissionsForPeriod(
  records: EmissionRecord[],
  startDate: string,
  endDate: string
): EmissionRecord[] {
  return records.filter(record => 
    record.yearMonth >= startDate && record.yearMonth <= endDate
  );
}

/**
 * Calculate monthly totals
 */
export function calculateMonthlyTotals(records: EmissionRecord[]): Record<string, number> {
  return records.reduce((acc, record) => {
    if (!acc[record.yearMonth]) {
      acc[record.yearMonth] = 0;
    }
    acc[record.yearMonth] += record.carbonEstimateKgCO2e;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get unique categories from records
 */
export function getUniqueCategories(records: EmissionRecord[]): string[] {
  return Array.from(new Set(records.map(record => record.category))).sort();
}

/**
 * Get unique months from records
 */
export function getUniqueMonths(records: EmissionRecord[]): string[] {
  return Array.from(new Set(records.map(record => record.yearMonth))).sort();
}