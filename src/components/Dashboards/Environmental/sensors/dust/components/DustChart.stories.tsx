import type { Meta, StoryObj } from '@storybook/react';
import { DustChart } from './DustChart';
import { DustData } from '../../../../../../api/sensors/dust/types';

const meta = {
  title: 'Dashboards/Environmental/Sensors/DustChart',
  component: DustChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Dust monitoring data'
    }
  },
} satisfies Meta<typeof DustChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample dust monitoring data
const sampleData: DustData = {
  devices: [
    {
      id: 'device1',
      deviceName: 'Dust Monitor 1',
      deviceModel: 'DM-2000',
      serialNumber: 'DM2000-001',
      manufacturer: 'DustTech',
      organisation: 'Environmental Protection Agency',
      timeStamp: new Date().toISOString(),
      deviceStatus: 'Active',
      latitude: -40.7500,
      longitude: 175.1500,
      childRecords: Array.from({ length: 24 }, (_, i) => ({
        id: `record${i}`,
        deviceName: 'Dust Monitor 1',
        dateTime: new Date(2025, 1, 20, i).toISOString(),
        dustLevel: Math.random() * 100,
        unit: 'µg/m³',
        pm10: Math.random() * 150,
        pm2_5: Math.random() * 90,
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 30,
        windSpeed: Math.random() * 20,
        windDirection: Math.random() * 360,
        complianceStatus: 'Compliant',
        staff: 'John Smith'
      }))
    },
    {
      id: 'device2',
      deviceName: 'Dust Monitor 2',
      deviceModel: 'DM-2000',
      serialNumber: 'DM2000-002',
      manufacturer: 'DustTech',
      organisation: 'Environmental Protection Agency',
      timeStamp: new Date().toISOString(),
      deviceStatus: 'Active',
      latitude: -40.7600,
      longitude: 175.1600,
      childRecords: Array.from({ length: 24 }, (_, i) => ({
        id: `record${i}`,
        deviceName: 'Dust Monitor 2',
        dateTime: new Date(2025, 1, 20, i).toISOString(),
        dustLevel: Math.random() * 100,
        unit: 'µg/m³',
        pm10: Math.random() * 150,
        pm2_5: Math.random() * 90,
        temperature: 20 + Math.random() * 10,
        humidity: 40 + Math.random() * 30,
        windSpeed: Math.random() * 20,
        windDirection: Math.random() * 360,
        complianceStatus: 'Compliant',
        staff: 'Emma Wilson'
      }))
    }
  ],
  lastUpdated: new Date().toISOString(),
  totalReadings: 48
};

export const Default: Story = {
  args: {
    data: sampleData
  },
  parameters: {
    docs: {
      description: {
        story: 'Default dust chart showing PM10 and PM2.5 levels over time'
      }
    }
  }
};

export const SingleDevice: Story = {
  args: {
    data: {
      ...sampleData,
      devices: [sampleData.devices[0]]
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Dust chart showing data from a single monitoring device'
      }
    }
  }
};

export const HighReadings: Story = {
  args: {
    data: {
      ...sampleData,
      devices: sampleData.devices.map(device => ({
        ...device,
        childRecords: device.childRecords.map(record => ({
          ...record,
          pm10: 100 + Math.random() * 50,
          pm2_5: 50 + Math.random() * 40
        }))
      }))
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Dust chart showing elevated PM10 and PM2.5 levels'
      }
    }
  }
};

export const LowReadings: Story = {
  args: {
    data: {
      ...sampleData,
      devices: sampleData.devices.map(device => ({
        ...device,
        childRecords: device.childRecords.map(record => ({
          ...record,
          pm10: Math.random() * 30,
          pm2_5: Math.random() * 15
        }))
      }))
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Dust chart showing low PM10 and PM2.5 levels'
      }
    }
  }
};

export const NoData: Story = {
  args: {
    data: {
      devices: [],
      lastUpdated: new Date().toISOString(),
      totalReadings: 0
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Dust chart with no data available'
      }
    }
  }
};