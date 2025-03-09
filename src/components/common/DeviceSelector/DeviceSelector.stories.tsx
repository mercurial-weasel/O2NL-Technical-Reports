import type { Meta, StoryObj } from '@storybook/react';
import { DeviceSelector } from './DeviceSelector';

const meta = {
  title: 'Common/DeviceSelector',
  component: DeviceSelector,
  parameters: {
    layout: 'centered',
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
    onChange: {
      action: 'changed'
    }
  },
} satisfies Meta<typeof DeviceSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleDevices = [
  { id: 'device1', name: 'Device 1', model: 'Model A' },
  { id: 'device2', name: 'Device 2', model: 'Model B' },
  { id: 'device3', name: 'Device 3', model: 'Model A' },
  { id: 'device4', name: 'Device 4', model: 'Model C' }
];

export const Default: Story = {
  args: {
    devices: sampleDevices,
    selectedDevices: new Set(['all'])
  }
};

export const WithSelections: Story = {
  args: {
    devices: sampleDevices,
    selectedDevices: new Set(['device1', 'device2'])
  }
};

export const NoDevices: Story = {
  args: {
    devices: [],
    selectedDevices: new Set()
  }
};

export const ManyDevices: Story = {
  args: {
    devices: Array.from({ length: 20 }, (_, i) => ({
      id: `device${i + 1}`,
      name: `Device ${i + 1}`,
      model: `Model ${String.fromCharCode(65 + (i % 5))}`
    })),
    selectedDevices: new Set(['all'])
  }
};