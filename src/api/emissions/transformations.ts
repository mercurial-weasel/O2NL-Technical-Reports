import { CarbonEmissionRecord, EmissionSourceType, EmissionSubCategories } from './types';

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
  // Create a map to store emissions by month
  const monthlyMap = new Map<string, MonthlyEmissions>();

  // Sort emissions by date
  const sortedEmissions = [...emissions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get start and end months
  const startDate = new Date(sortedEmissions[0]?.date || new Date());
  const endDate = new Date(sortedEmissions[sortedEmissions.length - 1]?.date || new Date());

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

  // Aggregate emissions by month and source
  emissions.forEach(emission => {
    const monthKey = emission.date.slice(0, 7);
    const monthData = monthlyMap.get(monthKey)!;

    // Initialize source if not exists
    if (!monthData.emissions[emission.source]) {
      monthData.emissions[emission.source] = 0;
    }

    // Add emission amount
    monthData.emissions[emission.source]! += emission.amount;
    monthData.total += emission.amount;
  });

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