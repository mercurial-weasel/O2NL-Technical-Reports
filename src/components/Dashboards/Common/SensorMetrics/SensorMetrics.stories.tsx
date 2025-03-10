import type { Meta, StoryObj } from '@storybook/react';
import { SensorMetrics } from '@dashboards/Common/SensorMetrics';
import { Thermometer, Wind, Droplets, Gauge } from 'lucide-react';

const meta = {
  title: 'Dashboards/Common/SensorMetrics',
  component: SensorMetrics,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    metrics: {
      control: 'object',
      description: 'Array of metric objects'
    }
  },
} satisfies Meta<typeof SensorMetrics>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    metrics: [
      {
        title: 'Temperature',
        value: 25.5,
        unit: '°C',
        change: 2.3,
        icon: <Thermometer className="w-5 h-5" />
      },
      {
        title: 'Wind Speed',
        value: 15.2,
        unit: 'km/h',
        change: -1.5,
        icon: <Wind className="w-5 h-5" />
      },
      {
        title: 'Humidity',
        value: 65.0,
        unit: '%',
        change: 0,
        icon: <Droplets className="w-5 h-5" />
      },
      {
        title: 'Pressure',
        value: 1013.2,
        unit: 'hPa',
        change: 0.5,
        icon: <Gauge className="w-5 h-5" />
      }
    ]
  }
};

export const WithThresholds: Story = {
  args: {
    metrics: [
      {
        title: 'Temperature',
        value: 32.5,
        unit: '°C',
        threshold: {
          warning: 30,
          critical: 35
        },
        icon: <Thermometer className="w-5 h-5" />
      },
      {
        title: 'Wind Speed',
        value: 25.5,
        unit: 'km/h',
        threshold: {
          warning: 20,
          critical: 30
        },
        icon: <Wind className="w-5 h-5" />
      },
      {
        title: 'Humidity',
        value: 85.0,
        unit: '%',
        threshold: {
          warning: 80,
          critical: 90
        },
        icon: <Droplets className="w-5 h-5" />
      },
      {
        title: 'Pressure',
        value: 980.0,
        unit: 'hPa',
        threshold: {
          warning: 990,
          critical: 970
        },
        icon: <Gauge className="w-5 h-5" />
      }
    ]
  }
};

export const NoChanges: Story = {
  args: {
    metrics: [
      {
        title: 'Temperature',
        value: 25.5,
        unit: '°C',
        icon: <Thermometer className="w-5 h-5" />
      },
      {
        title: 'Wind Speed',
        value: 15.2,
        unit: 'km/h',
        icon: <Wind className="w-5 h-5" />
      },
      {
        title: 'Humidity',
        value: 65.0,
        unit: '%',
        icon: <Droplets className="w-5 h-5" />
      },
      {
        title: 'Pressure',
        value: 1013.2,
        unit: 'hPa',
        icon: <Gauge className="w-5 h-5" />
      }
    ]
  }
};

export const SingleMetric: Story = {
  args: {
    metrics: [
      {
        title: 'Temperature',
        value: 25.5,
        unit: '°C',
        change: 2.3,
        threshold: {
          warning: 30,
          critical: 35
        },
        icon: <Thermometer className="w-5 h-5" />
      }
    ]
  }
};

export const ManyMetrics: Story = {
  args: {
    metrics: Array.from({ length: 8 }, (_, i) => ({
      title: `Metric ${i + 1}`,
      value: Math.random() * 100,
      unit: 'units',
      change: (Math.random() - 0.5) * 10,
      icon: <Gauge className="w-5 h-5" />
    }))
  }
};