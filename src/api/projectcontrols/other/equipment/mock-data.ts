import { EquipmentData } from './types';

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
  
  return {
    easting: easting + perpX * offset,
    northing: northing + perpY * offset
  };
}

// Helper function to generate random equipment status
function getRandomStatus(): 'operational' | 'maintenance' | 'fault' | 'offline' {
  const statuses = ['operational', 'maintenance', 'fault', 'offline'];
  const weights = [0.7, 0.1, 0.1, 0.1]; // 70% operational, 10% each for others
  const random = Math.random();
  let sum = 0;
  for (let i = 0; i < weights.length; i++) {
    sum += weights[i];
    if (random < sum) {
      return statuses[i] as 'operational' | 'maintenance' | 'fault' | 'offline';
    }
  }
  return 'operational';
}

export const mockEquipmentData: EquipmentData = {
  lastUpdated: new Date().toISOString(),
  equipmentTypes: [
    {
      typeId: 'groundwater',
      name: 'Groundwater',
      description: 'Groundwater monitoring equipment',
      category: 'monitoring',
      equipment: Array.from({ length: 102 }, (_, i) => {
        const location = getProjectLocation();
        const status = getRandomStatus();
        return {
          equipmentId: `GW-${(i + 1).toString().padStart(3, '0')}`,
          serialNumber: `GEO-GW-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          easting: location.easting,
          northing: location.northing,
          lastUpdated: {
            date: '2025-02-15',
            time: '08:30:00'
          },
          elevation: 30 + Math.random() * 50,
          status,
          keyMetrics: `Water Level: ${(Math.random() * 10 + 2).toFixed(2)}m, Battery: ${Math.floor(Math.random() * 100)}%`,
          unit: 'meters',
          measurementType: 'water_level',
          ...(status !== 'operational' && {
            alert: {
              date: '2025-02-15',
              time: '08:30:00',
              comments: status === 'maintenance' ? 'Scheduled maintenance required' :
                       status === 'fault' ? 'Sensor reading error' :
                       'Device offline - check connection'
            }
          })
        };
      })
    },
    {
      typeId: 'noise',
      name: 'Noise',
      description: 'Noise monitoring equipment',
      category: 'monitoring',
      equipment: Array.from({ length: 15 }, (_, i) => {
        const location = getProjectLocation();
        const status = getRandomStatus();
        return {
          equipmentId: `NM-${(i + 1).toString().padStart(3, '0')}`,
          serialNumber: `ENV-NM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          easting: location.easting,
          northing: location.northing,
          lastUpdated: {
            date: '2025-02-15',
            time: '08:30:00'
          },
          elevation: 1.5, // Standard height for noise monitors
          status,
          keyMetrics: `Level: ${(Math.random() * 20 + 60).toFixed(1)}dB, Battery: ${Math.floor(Math.random() * 100)}%`,
          unit: 'dB',
          measurementType: 'noise_level',
          ...(status !== 'operational' && {
            alert: {
              date: '2025-02-15',
              time: '08:30:00',
              comments: status === 'maintenance' ? 'Calibration due' :
                       status === 'fault' ? 'High noise level detected' :
                       'Device offline - check power'
            }
          })
        };
      })
    },
    {
      typeId: 'dust',
      name: 'Dust',
      description: 'Dust monitoring equipment',
      category: 'monitoring',
      equipment: Array.from({ length: 10 }, (_, i) => {
        const location = getProjectLocation();
        const status = getRandomStatus();
        return {
          equipmentId: `DM-${(i + 1).toString().padStart(3, '0')}`,
          serialNumber: `ENV-DM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          easting: location.easting,
          northing: location.northing,
          lastUpdated: {
            date: '2025-02-15',
            time: '08:30:00'
          },
          elevation: 2.0,
          status,
          keyMetrics: `PM10: ${(Math.random() * 30 + 10).toFixed(1)}μg/m³, Battery: ${Math.floor(Math.random() * 100)}%`,
          unit: 'μg/m³',
          measurementType: 'particulate_matter',
          ...(status !== 'operational' && {
            alert: {
              date: '2025-02-15',
              time: '08:30:00',
              comments: status === 'maintenance' ? 'Filter replacement due' :
                       status === 'fault' ? 'High dust level alert' :
                       'Device offline - check connection'
            }
          })
        };
      })
    },
    {
      typeId: 'vibration',
      name: 'Vibration',
      description: 'Vibration monitoring equipment',
      category: 'monitoring',
      equipment: Array.from({ length: 40 }, (_, i) => {
        const location = getProjectLocation();
        const status = getRandomStatus();
        return {
          equipmentId: `VM-${(i + 1).toString().padStart(3, '0')}`,
          serialNumber: `ENV-VM-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          easting: location.easting,
          northing: location.northing,
          lastUpdated: {
            date: '2025-02-15',
            time: '08:30:00'
          },
          elevation: 0.5,
          status,
          keyMetrics: `PPV: ${(Math.random() * 5).toFixed(2)}mm/s, Battery: ${Math.floor(Math.random() * 100)}%`,
          unit: 'mm/s',
          measurementType: 'peak_particle_velocity',
          ...(status !== 'operational' && {
            alert: {
              date: '2025-02-15',
              time: '08:30:00',
              comments: status === 'maintenance' ? 'Sensor check required' :
                       status === 'fault' ? 'Vibration threshold exceeded' :
                       'Device offline - check power supply'
            }
          })
        };
      })
    },
    {
      typeId: 'weather',
      name: 'Weather',
      description: 'Weather monitoring stations',
      category: 'monitoring',
      equipment: Array.from({ length: 4 }, (_, i) => {
        const location = getProjectLocation();
        const status = getRandomStatus();
        return {
          equipmentId: `WS-${(i + 1).toString().padStart(3, '0')}`,
          serialNumber: `ENV-WS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          easting: location.easting,
          northing: location.northing,
          lastUpdated: {
            date: '2025-02-15',
            time: '08:30:00'
          },
          elevation: 10.0,
          status,
          keyMetrics: `Temp: ${(Math.random() * 10 + 15).toFixed(1)}°C, Wind: ${(Math.random() * 20).toFixed(1)}km/h`,
          unit: 'various',
          measurementType: 'weather_metrics',
          ...(status !== 'operational' && {
            alert: {
              date: '2025-02-15',
              time: '08:30:00',
              comments: status === 'maintenance' ? 'Annual calibration due' :
                       status === 'fault' ? 'Wind sensor malfunction' :
                       'Station offline - communications error'
            }
          })
        };
      })
    },
    {
      typeId: 'toe_displacement',
      name: 'Toe Displacement',
      description: 'Toe displacement monitoring equipment',
      category: 'monitoring',
      equipment: Array.from({ length: 5 }, (_, i) => {
        const location = getProjectLocation();
        const status = getRandomStatus();
        return {
          equipmentId: `TD-${(i + 1).toString().padStart(3, '0')}`,
          serialNumber: `GEO-TD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          easting: location.easting,
          northing: location.northing,
          lastUpdated: {
            date: '2025-02-15',
            time: '08:30:00'
          },
          elevation: 25.0,
          status,
          keyMetrics: `Displacement: ${(Math.random() * 5).toFixed(2)}mm, Battery: ${Math.floor(Math.random() * 100)}%`,
          unit: 'mm',
          measurementType: 'displacement',
          ...(status !== 'operational' && {
            alert: {
              date: '2025-02-15',
              time: '08:30:00',
              comments: status === 'maintenance' ? 'Sensor realignment needed' :
                       status === 'fault' ? 'Excessive movement detected' :
                       'Device offline - check connection'
            }
          })
        };
      })
    },
    {
      typeId: 'slope_displacement',
      name: 'Slope Displacement',
      description: 'Slope displacement monitoring equipment',
      category: 'monitoring',
      equipment: Array.from({ length: 56 }, (_, i) => {
        const location = getProjectLocation();
        const status = getRandomStatus();
        return {
          equipmentId: `SD-${(i + 1).toString().padStart(3, '0')}`,
          serialNumber: `GEO-SD-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          easting: location.easting,
          northing: location.northing,
          lastUpdated: {
            date: '2025-02-15',
            time: '08:30:00'
          },
          elevation: 35.0,
          status,
          keyMetrics: `Movement: ${(Math.random() * 2).toFixed(2)}mm/day, Battery: ${Math.floor(Math.random() * 100)}%`,
          unit: 'mm/day',
          measurementType: 'movement_rate',
          ...(status !== 'operational' && {
            alert: {
              date: '2025-02-15',
              time: '08:30:00',
              comments: status === 'maintenance' ? 'Regular maintenance check due' :
                       status === 'fault' ? 'Rapid movement detected' :
                       'Device offline - battery depleted'
            }
          })
        };
      })
    }
  ]
};