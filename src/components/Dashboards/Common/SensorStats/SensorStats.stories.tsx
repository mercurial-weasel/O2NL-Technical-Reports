import type { Meta, StoryObj } from '@storybook/react';
import { SensorStats } from './SensorStats';

const meta = {
  title: 'Dashboards/Common/SensorStats',
  component: SensorStats,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Stats section title'
    },
    stats: {
      control: 'object',
      description: 'Array of stat items'
    }
  },
} satisfies Meta<typeof SensorStats>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Sensor Statistics',
    stats: [
      {
        label: 'Average Reading',
        value: 25.5,
        unit: 'µg/m³',
        change: 2.3,
        status: 'positive'
      },
      {
        label: 'Maximum Reading',
        value: 45.2,
        unit: 'µg/m³',
        change: -1.5,
        status: 'negative'
      },
      {
        label: 'Minimum Reading',
        value: 12.8,
        unit: 'µg/m³',
        change: 0,
        status: 'neutral'
      },
      {
        label: 'Total Readings',
        value: 1234,
        change: 5.2,
        status: 'positive'
      }
    ]
  }
};

export const NoChanges: Story = {
  args: {
    title: 'Basic Stats',
    stats: [
      {
        label: 'Average',
        value: 25.5,
        unit: 'units'
      },
      {
        label: 'Maximum',
        value: 45.2,
        unit: 'units'
      }
    ]
  }
};

export const AllPositive: Story = {
  args: {
    title: 'Positive Trends',
    stats: [
      {
        label: 'Metric 1',
        value: 100,
        change: 5.2,
        status: 'positive'
      },
      {
        label: 'Metric 2',
        value: 200,
        change: 3.1,
        status: 'positive'
      }
    ]
  }
};

export const AllNegative: Story = {
  args: {
    title: 'Negative Trends',
    stats: [
      {
        label: 'Metric 1',
        value: 100,
        change: -5.2,
        status: 'negative'
      },
      {
        label: 'Metric 2',
        value: 200,
        change: -3.1,
        status: 'negative'
      }
    ]
  }
};

export const MixedStatuses: Story = {
  args: {
    title: 'Mixed Trends',
    stats: [
      {
        label: 'Improving',
        value: 100,
        change: 5.2,
        status: 'positive'
      },
      {
        label: 'Declining',
        value: 200,
        change: -3.1,
        status: 'negative'
      },
      {
        label: 'Stable',
        value: 300,
        change: 0,
        status: 'neutral'
      }
    ]
  }
};