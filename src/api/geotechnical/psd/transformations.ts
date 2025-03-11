import { ParticleSizeDistributionTest, PSDData } from './types';

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
    silt
  };
}

// Main function to transform PSD data into summaries
export function calculatePSDSummaries(data: PSDData): PSDSummary[] {
  return data.map(test => calculatePSDSummary(test));
}
