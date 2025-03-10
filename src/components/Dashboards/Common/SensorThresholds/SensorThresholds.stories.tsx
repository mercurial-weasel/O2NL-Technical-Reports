import type { Meta, StoryObj } from '@storybook/react';
import { SensorThresholds } from '@dashboards/Common/SensorThresholds';

const meta = {
  title: 'Dashboards/Common/SensorThresholds',
  component: SensorThresholds,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Thresholds section title'
    },
    thresholds: {
      control: 'object',
      description: 'Array of threshold definitions'
    }
  },
} satisfies Meta<typeof SensorThresholds>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Air Quality Thresholds',
    thresholds: [
      { label: 'Good', value: 50, unit: 'µg/m³', color: '#10B981' },
      { label: 'Moderate', value: 100, unit: 'µg/m³', color: '#F59E0B' },
      { label: 'Unhealthy', value: 150, unit: 'µg/m³', color: '#EF4444' }
    ]
  }
};

export const TemperatureThresholds: Story = {
  args: {
    title: 'Temperature Thresholds',
    thresholds: [
      { label: 'Cold', value: 15, unit: '°C', color: '#3B82F6' },
      { label: 'Normal', value: 25, unit: '°C', color: '#10B981' },
      { label: 'Hot', value: 35, unit: '°C', color: '#EF4444' }
    ]
  }
};

export const NoUnits: Story = {
  args: {
    title: 'Risk Thresholds',
    thresholds: [
      { label: 'Low Risk', value: 3, unit: '', color: '#10B981' },
      { label: 'Medium Risk', value: 6, unit: '', color: '#F59E0B' },
      { label: 'High Risk', value: 9, unit: '', color: '#EF4444' }
    ]
  }
};

export const ManyThresholds: Story = {
  args: {
    title: 'Detailed Thresholds',
    thresholds: [
      { label: 'Level 1', value: 10, unit: 'units', color: '#10B981' },
      { label: 'Level 2', value: 20, unit: 'units', color: '#34D399' },
      { label: 'Level 3', value: 30, unit: 'units', color: '#F59E0B' },
      { label: 'Level 4', value: 40, unit: 'units', color: '#F97316' },
      { label: 'Level 5', value: 50, unit: 'units', color: '#EF4444' }
    ]
  }
};