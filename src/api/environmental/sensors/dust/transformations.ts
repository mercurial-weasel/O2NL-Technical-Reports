import { DustData, DustParent, DustChild } from './types';

export interface WindRoseBin {
  direction: string;
  speedRanges: {
    percentage: number;
  }[];
}

export interface WindRoseData {
  bins: WindRoseBin[];
  speedRanges: string[];
  maxPercentage: number;
}

export interface DeviceLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
  lastReading: DustChild;
}

export interface DailyDustLevel {
  date: string;
  pm10Average: number;
  pm2_5Average: number;
  combinedAverage: number;
  readings: number;
}

export interface MonthlyDustData {
  month: string; // YYYY-MM format
  days: DailyDustLevel[];
}

export interface TrendPoint {
  timestamp: string;
  pm10: number;
  pm2_5: number;
  temperature: number;
  humidity: number;
  windSpeed: number;
}

export function calculateTrends(device: DustParent): TrendPoint[] {
  return device.childRecords
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime())
    .map(record => ({
      timestamp: record.dateTime,
      pm10: record.pm10,
      pm2_5: record.pm2_5,
      temperature: record.temperature,
      humidity: record.humidity,
      windSpeed: record.windSpeed
    }));
}

export function calculateWindRoseData(
  data: DustData,
  selectedDevices: Set<string>,
  dateRange: [Date | null, Date | null]
): WindRoseData {
  // Define direction bins (every 30 degrees)
  const directionBins = Array.from({ length: 12 }, (_, i) => `${i * 30}`);
  
  // Define speed ranges
  const speedRanges = ['0-3', '3-6', '6-9', '9-12', '12-15', '15+'];
  
  // Initialize bins
  const bins = directionBins.map(direction => ({
    direction,
    speedRanges: speedRanges.map(() => ({ percentage: 0 }))
  }));

  // Filter and count records
  let totalRecords = 0;
  data.devices
    .filter(device => selectedDevices.has('all') || selectedDevices.has(device.id))
    .forEach(device => {
      device.childRecords
        .filter(record => {
          const recordDate = new Date(record.dateTime);
          return (!dateRange[0] || recordDate >= dateRange[0]) &&
                 (!dateRange[1] || recordDate <= dateRange[1]);
        })
        .forEach(record => {
          // Find direction bin
          const binIndex = Math.floor(record.windDirection / 30);
          
          // Find speed range
          const speedRangeIndex = Math.min(
            Math.floor(record.windSpeed / 3),
            speedRanges.length - 1
          );
          
          // Increment count
          bins[binIndex].speedRanges[speedRangeIndex].percentage++;
          totalRecords++;
        });
    });

  // Convert counts to percentages
  if (totalRecords > 0) {
    bins.forEach(bin => {
      bin.speedRanges.forEach(range => {
        range.percentage = (range.percentage / totalRecords) * 100;
      });
    });
  }

  // Find max percentage for scaling
  const maxPercentage = Math.max(
    ...bins.flatMap(bin => bin.speedRanges.map(range => range.percentage))
  );

  return {
    bins,
    speedRanges,
    maxPercentage
  };
}

export function getDeviceLocations(data: DustData): DeviceLocation[] {
  return data.devices.map(device => ({
    id: device.id,
    name: device.deviceName,
    latitude: device.latitude,
    longitude: device.longitude,
    status: device.deviceStatus || 'Active',
    lastReading: device.childRecords[device.childRecords.length - 1]
  }));
}

export function calculateDailyAverages(
  data: DustData,
  selectedDevices: Set<string>,
  dateRange: [Date | null, Date | null],
  selectedParameters: Set<'pm10' | 'pm2_5'>
): MonthlyDustData[] {
  // Filter records based on selected devices and date range
  const filteredRecords = data.devices
    .filter(device => selectedDevices.has('all') || selectedDevices.has(device.id))
    .flatMap(device => device.childRecords
      .filter(record => {
        const recordDate = new Date(record.dateTime);
        return (!dateRange[0] || recordDate >= dateRange[0]) &&
               (!dateRange[1] || recordDate <= dateRange[1]);
      })
    );

  // Group records by month and day
  const recordsByMonth = new Map<string, Map<string, DustChild[]>>();

  filteredRecords.forEach(record => {
    const date = new Date(record.dateTime);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
    const dayKey = date.toISOString().slice(0, 10); // YYYY-MM-DD

    if (!recordsByMonth.has(monthKey)) {
      recordsByMonth.set(monthKey, new Map());
    }
    const monthData = recordsByMonth.get(monthKey)!;

    if (!monthData.has(dayKey)) {
      monthData.set(dayKey, []);
    }
    monthData.get(dayKey)!.push(record);
  });

  // Calculate daily averages for each month
  return Array.from(recordsByMonth.entries())
    .map(([month, daysMap]) => ({
      month,
      days: Array.from(daysMap.entries()).map(([date, readings]) => {
        const pm10Sum = readings.reduce((sum, r) => sum + r.pm10, 0);
        const pm2_5Sum = readings.reduce((sum, r) => sum + r.pm2_5, 0);
        const count = readings.length;

        const pm10Average = pm10Sum / count;
        const pm2_5Average = pm2_5Sum / count;

        // Calculate combined average based on selected parameters
        let combinedAverage = 0;
        if (selectedParameters.has('pm10') && selectedParameters.has('pm2_5')) {
          combinedAverage = Math.max(pm10Average, pm2_5Average);
        } else if (selectedParameters.has('pm10')) {
          combinedAverage = pm10Average;
        } else if (selectedParameters.has('pm2_5')) {
          combinedAverage = pm2_5Average;
        }

        return {
          date,
          pm10Average,
          pm2_5Average,
          combinedAverage,
          readings: count
        };
      }).sort((a, b) => a.date.localeCompare(b.date))
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

export function getDustLevelColor(value: number): string {
  if (value <= 50) return '#10B981'; // Green
  if (value <= 100) return '#FBBF24'; // Yellow
  if (value <= 150) return '#F97316'; // Orange
  if (value <= 200) return '#EF4444'; // Red
  if (value <= 300) return '#9333EA'; // Purple
  return '#7F1D1D'; // Maroon
}

export function getDustLevelStatus(value: number): string {
  if (value <= 50) return 'Good';
  if (value <= 100) return 'Moderate';
  if (value <= 150) return 'Unhealthy for Sensitive Groups';
  if (value <= 200) return 'Unhealthy';
  if (value <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}