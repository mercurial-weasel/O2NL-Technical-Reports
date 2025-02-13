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
  logger.info('starting calculateMonthlyEmissions');
  // Create a map to store emissions by month
  const monthlyMap = new Map<string, MonthlyEmissions>();

  // Sort emissions by date
  const sortedEmissions = [...emissions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get start and end dates
  const startDate = new Date(sortedEmissions[0]?.date || new Date());
  const endDate = new Date(sortedEmissions[sortedEmissions.length - 1]?.date || new Date());

  logger.info('about to  Initialize all months in the range');
  // Initialize all months in the range
  let currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  while (currentDate <= endDate) {
    const monthKey = currentDate.toISOString().slice(0, 7);
    monthlyMap.set(monthKey, {
      month: monthKey,
      emissions: {
        Materials: 0,
        Transport: 0,
        Equipment: 0,
        'Site Operations': 0,
        Waste: 0,
        Energy: 0,
        Other: 0
      },
      total: 0
    });
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  logger.info('about to Aggregate emissions by month and source');
  // Aggregate emissions by month and source
  emissions.forEach(emission => {
    const monthKey = emission.date.slice(0, 7);
    const monthData = monthlyMap.get(monthKey);

    if (!monthData) {
      logger.warn('Month data not found for key', { monthKey });
      return;
    }

    logger.info('about to Add emission amount');
    logger.info('monthData ', {monthData});
    
    // Add emission amount - now we know monthData.emissions exists and is initialized
    monthData.emissions[emission.source] += emission.amount;
    monthData.total += emission.amount;
  });

  logger.info('about Convert map to sorted array');
  // Convert map to sorted array
  return Array.from(monthlyMap.values())
    .sort((a, b) => a.month.localeCompare(b.month));
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
