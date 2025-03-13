import { Atterbergs } from './types';

/**
 * Formats Atterbergs test data for display
 */
export function formatAtterbergsData(data: Atterbergs): Atterbergs {
  return {
    ...data,
    // Format any specific fields here if needed
    liquid_limit: Number(data.liquid_limit.toFixed(1)),
    plastic_limit: Number(data.plastic_limit.toFixed(1)),
    plasticity_index: Number(data.plasticity_index.toFixed(1)),
    water_content: Number(data.water_content.toFixed(1))
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
