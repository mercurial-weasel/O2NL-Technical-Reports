import type { Meta, StoryObj } from '@storybook/react';
import { WindRose } from './WindRose';
import { WindRoseData } from '../../../../../../api/sensors/dust/transformations';

const meta = {
  title: 'Dashboards/Environmental/Sensors/WindRose',
  component: WindRose,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Wind rose data'
    }
  },
} satisfies Meta<typeof WindRose>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample wind rose data
const sampleData: WindRoseData = {
  bins: Array.from({ length: 12 }, (_, i) => ({
    direction: (i * 30).toString(),
    speedRanges: [
      { percentage: Math.random() * 10 },
      { percentage: Math.random() * 8 },
      { percentage: Math.random() * 6 },
      { percentage: Math.random() * 4 },
      { percentage: Math.random() * 2 },
      { percentage: Math.random() * 1 }
    ]
  })),
  speedRanges: ['0-3', '3-6', '6-9', '9-12', '12-15', '15+'],
  maxPercentage: 10
};

export const Default: Story = {
  args: {
    data: sampleData
  },
  parameters: {
    docs: {
      description: {
        story: 'Default wind rose chart showing wind direction and speed distribution'
      }
    }
  }
};

export const LowWindSpeeds: Story = {
  args: {
    data: {
      ...sampleData,
      bins: sampleData.bins.map(bin => ({
        ...bin,
        speedRanges: bin.speedRanges.map((range, i) => ({
          percentage: i < 2 ? range.percentage * 2 : 0
        }))
      }))
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Wind rose showing predominantly low wind speeds'
      }
    }
  }
};

export const HighWindSpeeds: Story = {
  args: {
    data: {
      ...sampleData,
      bins: sampleData.bins.map(bin => ({
        ...bin,
        speedRanges: bin.speedRanges.map((range, i) => ({
          percentage: i > 3 ? range.percentage * 3 : 0
        }))
      }))
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Wind rose showing predominantly high wind speeds'
      }
    }
  }
};

export const DominantDirection: Story = {
  args: {
    data: {
      ...sampleData,
      bins: sampleData.bins.map((bin, i) => ({
        ...bin,
        speedRanges: bin.speedRanges.map(range => ({
          percentage: i === 3 ? range.percentage * 3 : range.percentage * 0.5
        }))
      }))
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Wind rose showing a dominant wind direction'
      }
    }
  }
};

export const EvenDistribution: Story = {
  args: {
    data: {
      ...sampleData,
      bins: sampleData.bins.map(bin => ({
        ...bin,
        speedRanges: bin.speedRanges.map(() => ({
          percentage: 5
        }))
      }))
    }
  },
  parameters: {
    docs: {
      description: {
        story: 'Wind rose showing an even distribution of wind speeds and directions'
      }
    }
  }
};