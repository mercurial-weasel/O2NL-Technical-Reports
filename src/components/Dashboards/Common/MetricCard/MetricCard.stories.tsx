import type { Meta, StoryObj } from '@storybook/react';
import { MetricCard } from './MetricCard';
import { Thermometer, Wind, Droplets } from 'lucide-react';

const meta = {
  title: 'Dashboards/Common/MetricCard',
  component: MetricCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Metric title'
    },
    value: {
      control: 'number',
      description: 'Metric value'
    },
    unit: {
      control: 'text',
      description: 'Metric unit'
    },
    change: {
      control: 'number',
      description: 'Percentage change'
    },
    threshold: {
      control: 'object',
      description: 'Warning and critical thresholds'
    }
  },
} satisfies Meta<typeof MetricCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Temperature',
    value: 25.5,
    unit: '°C',
    icon: <Thermometer className="w-5 h-5 text-brand-primary" />
  }
};

export const WithChange: Story = {
  args: {
    title: 'Wind Speed',
    value: 15.2,
    unit: 'km/h',
    change: 5.3,
    icon: <Wind className="w-5 h-5 text-brand-primary" />
  }
};

export const WithThreshold: Story = {
  args: {
    title: 'Humidity',
    value: 75.5,
    unit: '%',
    threshold: {
      warning: 70,
      critical: 80
    },
    icon: <Droplets className="w-5 h-5 text-brand-primary" />
  }
};

export const BelowWarning: Story = {
  args: {
    title: 'Temperature',
    value: 22.5,
    unit: '°C',
    threshold: {
      warning: 25,
      critical: 30
    },
    icon: <Thermometer className="w-5 h-5 text-brand-primary" />
  }
};

export const AboveWarning: Story = {
  args: {
    title: 'Temperature',
    value: 27.5,
    unit: '°C',
    threshold: {
      warning: 25,
      critical: 30
    },
    icon: <Thermometer className="w-5 h-5 text-brand-primary" />
  }
};

export const AboveCritical: Story = {
  args: {
    title: 'Temperature',
    value: 32.5,
    unit: '°C',
    threshold: {
      warning: 25,
      critical: 30
    },
    icon: <Thermometer className="w-5 h-5 text-brand-primary" />
  }
};

export const NegativeChange: Story = {
  args: {
    title: 'Wind Speed',
    value: 12.5,
    unit: 'km/h',
    change: -3.2,
    icon: <Wind className="w-5 h-5 text-brand-primary" />
  }
};

export const NoChange: Story = {
  args: {
    title: 'Humidity',
    value: 65.0,
    unit: '%',
    change: 0,
    icon: <Droplets className="w-5 h-5 text-brand-primary" />
  }
};