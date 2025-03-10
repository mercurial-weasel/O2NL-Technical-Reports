import { v4 as uuidv4 } from 'uuid';
import { DustParent, DustChild } from './types';

const staffNames = [
  'John Smith',
  'Emma Wilson',
  'Michael Brown',
  'Sarah Davis',
  'David Taylor',
  'Lisa Anderson',
  'James Martin',
  'Rachel Thompson',
  'Daniel White',
  'Jessica Clark'
];

const manufacturers = [
  'DustTech Solutions',
  'AirQuality Systems',
  'EnviroMonitor',
  'EcoSense Technologies',
  'CleanAir Instruments'
];

const deviceModels = [
  'DM-2000',
  'AQM-500',
  'EM-X1',
  'ECO-DUST-PRO',
  'CAI-3000'
];

const organisations = [
  'Environmental Protection Agency',
  'City Council',
  'Construction Safety Ltd',
  'Air Quality Monitoring Services',
  'Environmental Consultants Inc'
];

const complianceStatuses = [
  'Compliant',
  'Non-Compliant',
  'Warning',
  'Under Review',
  'Requires Attention'
];

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomFloat(min: number, max: number): number {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

// Function to generate random points along O2NL project corridor
function getProjectLocation() {
  // Ōtaki and Levin coordinates in NZTM2000
  const otaki = {
    easting: 1831416.0437707643,
    northing: 5485851.405896847
  };
  
  const levin = {
    easting: 1842782.6674082244,
    northing: 5500694.8768536365
  };

  // Calculate a random point along the line with some randomness
  const t = Math.random(); // Random value between 0 and 1
  const randomOffset = 500; // Random offset up to 500m perpendicular to alignment

  // Linear interpolation between points
  const easting = otaki.easting + (levin.easting - otaki.easting) * t;
  const northing = otaki.northing + (levin.northing - otaki.northing) * t;

  // Add some random perpendicular offset
  // Calculate perpendicular vector
  const dx = levin.easting - otaki.easting;
  const dy = levin.northing - otaki.northing;
  const length = Math.sqrt(dx * dx + dy * dy);
  
  // Normalize and rotate 90 degrees
  const perpX = -dy / length;
  const perpY = dx / length;

  // Apply random offset
  const offset = (Math.random() - 0.5) * 2 * randomOffset;
  
  // Convert NZTM2000 to WGS84 (approximate conversion)
  // These conversion factors are specific to the Ōtaki-Levin region
  const lat = ((northing - 5485000) * 0.000009) + -40.7500;
  const lon = ((easting - 1831000) * 0.000009) + 175.1500;
  
  return {
    latitude: lat + perpY * offset * 0.000009,
    longitude: lon + perpX * offset * 0.000009
  };
}

function generateTimeSeriesData(startDate: Date, endDate: Date, numPoints: number): Date[] {
  const timePoints: Date[] = [];
  const totalMinutes = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
  const intervalMinutes = totalMinutes / (numPoints - 1);

  for (let i = 0; i < numPoints; i++) {
    const newDate = new Date(startDate.getTime() + (i * intervalMinutes * 60 * 1000));
    timePoints.push(newDate);
  }

  return timePoints;
}

export function generateMockDustData(numParents: number = 5, readingsPerParent: number = 200): {
  devices: DustParent[];
  totalReadings: number;
} {
  const startDate = new Date('2024-11-01');
  const endDate = new Date('2025-02-29');
  const devices: DustParent[] = [];

  for (let i = 0; i < numParents; i++) {
    const timePoints = generateTimeSeriesData(startDate, endDate, readingsPerParent);
    const childRecords: DustChild[] = timePoints.map(dateTime => ({
      id: uuidv4(),
      deviceName: `DUST-${i + 1}`,
      dateTime: dateTime.toISOString(),
      dustLevel: randomFloat(0, 100),
      unit: 'µg/m³',
      pm10: randomFloat(0, 150),
      pm2_5: randomFloat(0, 90),
      temperature: randomFloat(15, 35),
      humidity: randomFloat(30, 70),
      windSpeed: randomFloat(0, 20),
      windDirection: randomFloat(0, 360),
      complianceStatus: randomFromArray(complianceStatuses),
      staff: randomFromArray(staffNames),
      remarks: Math.random() > 0.7 ? `Observation at ${dateTime.toLocaleTimeString()}` : undefined
    }));

    // Get random location along project corridor
    const location = getProjectLocation();

    const device: DustParent = {
      id: uuidv4(),
      deviceName: `DUST-${i + 1}`,
      deviceModel: randomFromArray(deviceModels),
      serialNumber: `SN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      manufacturer: randomFromArray(manufacturers),
      organisation: randomFromArray(organisations),
      remarks: Math.random() > 0.7 ? 'Regular maintenance required' : undefined,
      timeStamp: new Date().toISOString(),
      deviceStatus: Math.random() > 0.2 ? 'Active' : 'Maintenance',
      latitude: location.latitude,
      longitude: location.longitude,
      childRecords
    };

    devices.push(device);
  }

  return {
    devices,
    totalReadings: devices.reduce((sum, device) => sum + device.childRecords.length, 0)
  };
}