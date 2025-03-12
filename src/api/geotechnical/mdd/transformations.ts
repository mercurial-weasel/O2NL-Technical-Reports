import { TestData, MDDData, MDDResult } from './types';

// Interface for MDD test summary information
export interface MDDSummary {
  sampleId: string;
  locationId: string;
  depth: number;
  sampleType: string;
  dateTestSummary: string;
  testMethod: string;
  optimumDryDensity: number;
  optimumWaterContent: number;
  naturalWaterContent: number;
  bulkDensity: number;
  solidDensity: number;
  airVoids: number;
  shearStrength: number | null;
  remarks: string;
  validPoints: MDDResult[];
}

// Calculate the polynomial curve fit for MDD data points
export function calculateMDDCurve(points: MDDResult[]): { waterContent: number; dryDensity: number }[] {
  // Filter out invalid points (zero values)
  const validPoints = points.filter(p => p.water_content > 0 && p.dry_density > 0);
  
  if (validPoints.length < 3) {
    return validPoints.map(p => ({ waterContent: p.water_content, dryDensity: p.dry_density }));
  }
  
  // Use the valid points to create a smooth curve
  // This is a simplified implementation - just returning the points
  // In a real application, you might implement a polynomial regression
  
  // Sort points by water content
  const sortedPoints = [...validPoints].sort((a, b) => a.water_content - b.water_content);
  
  // Generate a smooth curve with more points
  const minWC = sortedPoints[0].water_content;
  const maxWC = sortedPoints[sortedPoints.length - 1].water_content;
  const curvePoints: { waterContent: number; dryDensity: number }[] = [];
  
  // Just return the sorted valid points for now
  return sortedPoints.map(p => ({ waterContent: p.water_content, dryDensity: p.dry_density }));
}

// Calculate summary for individual MDD test
export function calculateMDDSummary(test: TestData): MDDSummary {
  // Filter out invalid points (zero values)
  const validPoints = test.mdd_results.filter(p => p.water_content > 0 && p.dry_density > 0);
  
  return {
    sampleId: test.sample_unique_id,
    locationId: test.location_id,
    depth: test.depth_to,
    sampleType: test.sample_type,
    dateTestSummary: `Sampled: ${test.date_sampled}, Tested: ${test.date_tested}`,
    testMethod: test.test_type_method,
    optimumDryDensity: test.optimum_dry_density,
    optimumWaterContent: test.water_content,
    naturalWaterContent: test.natural_water_content,
    bulkDensity: test.bulk_density,
    solidDensity: test.solid_density,
    airVoids: test.air_voids,
    shearStrength: test.shear_strength,
    remarks: test.remark_dot_test_remarks,
    validPoints: validPoints
  };
}

// Main function to transform MDD data into summaries
export function calculateMDDSummaries(data: MDDData): MDDSummary[] {
  return data.map(test => calculateMDDSummary(test));
}
