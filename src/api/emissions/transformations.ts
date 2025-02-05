import { CarbonEmissionRecord, EmissionSourceType, EmissionSubCategories } from './types';
import { logger } from '../../lib/logger';

export interface EmissionsBySource {
  source: EmissionSourceType;
  totalEmissions: number;
  subCategories: {
    [key: string]: number;
  };
}

export interface EmissionTrend {
  date: string;
  amount: number;
  source: EmissionSourceType;
}

export interface MonthlyEmissions {
  month: string; // YYYY-MM format
  emissions: {
    [key in EmissionSourceType]?: number;
  };
  total: number;
}

export function calculateMonthlyEmissions(emissions: CarbonEmissionRecord[]): MonthlyEmissions[] {
  logger.info('Starting to calculate monthly emissions', { emissions });

  // Create a map to store emissions by month
  const monthlyMap = new Map<string, MonthlyEmissions>();

  // Sort emissions by date
  const sortedEmissions = [...emissions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  logger.info('Sorted emissions by date', { sortedEmissions });

  // Get start and end months
  const startDate = new Date(sortedEmissions[0]?.date || new Date());
  const endDate = new Date(sortedEmissions[sortedEmissions.length - 1]?.date || new Date());

  logger.info('Start and end dates determined', { startDate, endDate });

  // Initialize all months in the range
  let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const endMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (currentDate <= endMonth) {
    const monthKey = currentDate.toISOString().slice(0, 7); // YYYY-MM format
    monthlyMap.set(monthKey, {
      month: monthKey,
      emissions: {},
      total: 0
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  logger.info('Initialized all months in the range', { monthlyMap });

  // Aggregate emissions by month and source
  emissions.forEach(emission => {
    const monthKey = emission.date.slice(0, 7);
    let monthData = monthlyMap.get(monthKey);
    logger.info('Setup month key and month data', { monthKey, monthData });

    logger.info('About to initialize monthData', { monthData });
    // Initialize monthData if it doesn't exist
    if (!monthData) {
      monthData = {
        month: monthKey,
        emissions: {},
        total: 0
      };
      monthlyMap.set(monthKey, monthData);
    }
    logger.info('MonthData initialized monthData', { monthData });

   
    // Ensure the source is a valid key
    const source = emission.source as EmissionSourceType;
    logger.info('About to initialize the source1', { source });

    // Initialize source if not exists
    if (!monthData.emissions[source]) {
      monthData.emissions[source] = 0;
      logger.info('Initialized the source', { source });
    }
    logger.info('MonthData setup  monthData', { monthData });

    // Add emission amount
    monthData.emissions[source]! += emission.amount;
    monthData.total += emission.amount;
    logger.info('Added the emission amount', { source, amount: emission.amount });

    // Log the monthData after adding the emission amount
    logger.info('Updated monthData', { monthData });
  });

  logger.info('Aggregated emissions by month and source', { monthlyMap });

  // Convert map to sorted array
  const result = Array.from(monthlyMap.values())
    .sort((a, b) => a.month.localeCompare(b.month));

  logger.info('Converted map to sorted array', { result });

  return result;
}

export function calculateEmissionsBySource(emissions: CarbonEmissionRecord[]): EmissionsBySource[] {
  const sourceMap = new Map<EmissionSourceType, EmissionsBySource>();

  emissions.forEach(emission => {
    if (!sourceMap.has(emission.source)) {
      sourceMap.set(emission.source, {
        source: emission.source,
        totalEmissions: 0,
        subCategories: {}
      });
    }

    const sourceData = sourceMap.get(emission.source)!;
    sourceData.totalEmissions += emission.amount;

    if (!sourceData.subCategories[emission.subCategory]) {
      sourceData.subCategories[emission.subCategory] = 0;
    }
    sourceData.subCategories[emission.subCategory] += emission.amount;
  });

  return Array.from(sourceMap.values());
}

export function calculateEmissionTrends(
  emissions: CarbonEmissionRecord[],
  startDate: Date,
  endDate: Date
): EmissionTrend[] {
  const trends: EmissionTrend[] = [];
  const sortedEmissions = [...emissions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayEmissions = sortedEmissions.filter(e => 
      e.date.startsWith(dateStr)
    );

    Object.values(EmissionSubCategories).flat().forEach(source => {
      const amount = dayEmissions
        .filter(e => e.source === source)
        .reduce((sum, e) => sum + e.amount, 0);

      if (amount > 0) {
        trends.push({
          date: dateStr,
          amount,
          source: source as EmissionSourceType
        });
      }
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return trends;
}

export function calculateTotalEmissions(emissions: CarbonEmissionRecord[]): number {
  return emissions.reduce((total, emission) => total + emission.amount, 0);
}

export function getEmissionsByLocation(emissions: CarbonEmissionRecord[]) {
  return emissions.map(emission => ({
    latitude: emission.latitude,
    longitude: emission.longitude,
    amount: emission.amount,
    source: emission.source,
    subCategory: emission.subCategory
  }));
}