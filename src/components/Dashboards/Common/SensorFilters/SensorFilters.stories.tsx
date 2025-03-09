import type { Meta, StoryObj } from '@storybook/react';
import { SensorFilters } from '@components/SensorFilters';

const meta = {
  title: 'Dashboards/Common/SensorFilters',
  component: SensorFilters,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    devices: {
      control: 'object',
      description: 'Array of available devices'
    },
    selectedDevices: {
      control: 'object',
      description: 'Set of selected device IDs'
    },
    dateRange: {
      control: 'object',
      description: 'Selected date range'
    },
    selectedParameters: {
      control: 'object',
      description: 'Set of selected parameters'
    },
    parameters: {
      control: 'object',
      description: 'Available parameters'
    }
  },
} satisfies Meta<typeof SensorFilters>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleDevices = [
  { id: 'device1', name: 'Device 1', model: 'Model A' },
  { id: 'device2', name: 'Device 2', model: 'Model B' },
  { id: 'device3', name: 'Device 3', model: 'Model A' }
];

const sampleParameters = [
  { key: 'pm10', label: 'PM10' },
  { key: 'pm2_5', label: 'PM2.5' },
  { key: 'temperature', label: 'Temperature' }
];

export const Default: Story = {
  args: {
    devices: sampleDevices,
    selectedDevices: new Set(['all']),
    dateRange: [null, null],
    selectedParameters: new Set(['pm10', 'pm2_5']),
    parameters: sampleParameters,
    onDeviceChange: () => {},
    onDateRangeChange: () => {},
    onParameterChange: () => {}
  }
};

export const WithSelections: Story = {
  args: {
    devices: sampleDevices,
    selectedDevices: new Set(['device1', 'device2']),
    dateRange: [new Date(2025, 0, 1), new Date(2025, 11, 31)],
    selectedParameters: new Set(['pm10']),
    parameters: sampleParameters,
    onDeviceChange: () => {},
    onDateRangeChange: () => {},
    onParameterChange: () => {}
  }
};

export const NoDevices: Story = {
  args: {
    devices: [],
    selectedDevices: new Set(),
    dateRange: [null, null],
    selectedParameters: new Set(['pm10', 'pm2_5']),
    parameters: sampleParameters,
    onDeviceChange: () => {},
    onDateRangeChange: () => {},
    onParameterChange: () => {}
  }
};

export const ManyDevices: Story = {
  args: {
    devices: Array.from({ length: 20 }, (_, i) => ({
      id: `device${i + 1}`,
      name: `Device ${i + 1}`,
      model: `Model ${String.fromCharCode(65 + (i % 5))}`
    })),
    selectedDevices: new Set(['all']),
    dateRange: [null, null],
    selectedParameters: new Set(['pm10', 'pm2_5']),
    parameters: sampleParameters,
    onDeviceChange: () => {},
    onDateRangeChange: () => {},
    onParameterChange: () => {}
  }
};