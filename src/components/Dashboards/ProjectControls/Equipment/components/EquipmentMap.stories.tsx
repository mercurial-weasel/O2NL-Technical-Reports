import type { Meta, StoryObj } from '@storybook/react';
import { EquipmentMap } from './EquipmentMap';
import { EquipmentStatus } from '../../../../../api/equipment/types';
import 'leaflet/dist/leaflet.css';

const meta = {
  title: 'Dashboards/ProjectControls/Equipment/EquipmentMap',
  component: EquipmentMap,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    equipment: {
      control: 'object',
      description: 'Array of equipment status data'
    }
  },
} satisfies Meta<typeof EquipmentMap>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample equipment data
const sampleEquipment: EquipmentStatus[] = [
  {
    equipmentId: 'EQ001',
    serialNumber: 'SN001',
    easting: 1831416.0437707643,
    northing: 5485851.405896847,
    lastUpdated: {
      date: '2025-02-20',
      time: '08:30:00'
    },
    elevation: 30,
    status: 'operational',
    keyMetrics: 'Temperature: 25°C, Battery: 95%',
    unit: 'meters',
    measurementType: 'temperature'
  },
  {
    equipmentId: 'EQ002',
    serialNumber: 'SN002',
    easting: 1832416.0437707643,
    northing: 5486851.405896847,
    lastUpdated: {
      date: '2025-02-20',
      time: '08:30:00'
    },
    elevation: 35,
    status: 'maintenance',
    keyMetrics: 'Temperature: 24°C, Battery: 45%',
    unit: 'meters',
    measurementType: 'temperature',
    alert: {
      date: '2025-02-20',
      time: '08:30:00',
      comments: 'Scheduled maintenance required'
    }
  },
  {
    equipmentId: 'EQ003',
    serialNumber: 'SN003',
    easting: 1833416.0437707643,
    northing: 5487851.405896847,
    lastUpdated: {
      date: '2025-02-20',
      time: '08:30:00'
    },
    elevation: 40,
    status: 'fault',
    keyMetrics: 'Temperature: N/A, Battery: 10%',
    unit: 'meters',
    measurementType: 'temperature',
    alert: {
      date: '2025-02-20',
      time: '08:30:00',
      comments: 'Sensor malfunction detected'
    }
  }
];

export const Default: Story = {
  args: {
    equipment: sampleEquipment
  },
  parameters: {
    docs: {
      description: {
        story: 'Default equipment map showing multiple pieces of equipment with different statuses'
      }
    }
  }
};

export const SingleEquipment: Story = {
  args: {
    equipment: [sampleEquipment[0]]
  },
  parameters: {
    docs: {
      description: {
        story: 'Map showing a single piece of operational equipment'
      }
    }
  }
};

export const MaintenanceEquipment: Story = {
  args: {
    equipment: [sampleEquipment[1]]
  },
  parameters: {
    docs: {
      description: {
        story: 'Map showing equipment under maintenance'
      }
    }
  }
};

export const FaultyEquipment: Story = {
  args: {
    equipment: [sampleEquipment[2]]
  },
  parameters: {
    docs: {
      description: {
        story: 'Map showing equipment with a fault'
      }
    }
  }
};

export const NoEquipment: Story = {
  args: {
    equipment: []
  },
  parameters: {
    docs: {
      description: {
        story: 'Map with no equipment displayed'
      }
    }
  }
};

export const MixedStatuses: Story = {
  args: {
    equipment: [
      ...sampleEquipment,
      {
        equipmentId: 'EQ004',
        serialNumber: 'SN004',
        easting: 1834416.0437707643,
        northing: 5488851.405896847,
        lastUpdated: {
          date: '2025-02-20',
          time: '08:30:00'
        },
        elevation: 45,
        status: 'offline',
        keyMetrics: 'Temperature: N/A, Battery: 0%',
        unit: 'meters',
        measurementType: 'temperature',
        alert: {
          date: '2025-02-20',
          time: '08:30:00',
          comments: 'Device offline - check connection'
        }
      }
    ]
  },
  parameters: {
    docs: {
      description: {
        story: 'Map showing equipment in all possible status states'
      }
    }
  }
};