import type { Meta, StoryObj } from '@storybook/react';
import { EmissionsChart } from './EmissionsChart';
import { EmissionRecord } from '@api/emissions/types';

const meta = {
  title: 'Dashboards/ProjectControls/EmissionsTracking/EmissionsChart',
  component: EmissionsChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Emissions data records'
    }
  },
} satisfies Meta<typeof EmissionsChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to generate sample data
const generateSampleData = (
  months: number = 12,
  categories: string[] = ['Bridge', 'Drainage', 'Earthworks', 'Pavement']
): EmissionRecord[] => {
  const data: EmissionRecord[] = [];
  const startDate = new Date(2024, 0); // Start from January 2024

  for (let i = 0; i < months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    const yearMonth = date.toISOString().slice(0, 7); // YYYY-MM format

    categories.forEach(category => {
      const amount = 100 + Math.random() * 400; // Random amount between 100-500
      data.push({
        category,
        yearMonth,
        amount,
        carbonEstimateKgCO2e: amount * (1.2 + Math.random()) // Random multiplier between 1.2-2.2
      });
    });
  }

  return data;
};

// Default story with 12 months of data
export const Default: Story = {
  args: {
    data: generateSampleData()
  },
  parameters: {
    docs: {
      description: {
        story: 'Default emissions chart showing 12 months of data across multiple categories'
      }
    }
  }
};

// Story with high emissions
export const HighEmissions: Story = {
  args: {
    data: generateSampleData(12, ['Bridge', 'Drainage', 'Earthworks', 'Pavement']).map(record => ({
      ...record,
      amount: record.amount * 2,
      carbonEstimateKgCO2e: record.carbonEstimateKgCO2e * 2
    }))
  },
  parameters: {
    docs: {
      description: {
        story: 'Emissions chart showing elevated emission levels'
      }
    }
  }
};

// Story with low emissions
export const LowEmissions: Story = {
  args: {
    data: generateSampleData(12, ['Bridge', 'Drainage', 'Earthworks', 'Pavement']).map(record => ({
      ...record,
      amount: record.amount * 0.5,
      carbonEstimateKgCO2e: record.carbonEstimateKgCO2e * 0.5
    }))
  },
  parameters: {
    docs: {
      description: {
        story: 'Emissions chart showing reduced emission levels'
      }
    }
  }
};

// Story with single category
export const SingleCategory: Story = {
  args: {
    data: generateSampleData(12, ['Bridge'])
  },
  parameters: {
    docs: {
      description: {
        story: 'Emissions chart showing data for a single category'
      }
    }
  }
};

// Story with many categories
export const ManyCategories: Story = {
  args: {
    data: generateSampleData(12, [
      'Bridge',
      'Drainage',
      'Earthworks',
      'Pavement',
      'Retaining Walls',
      'Site Facilities',
      'Transport',
      'Waste Management',
      'Water Management'
    ])
  },
  parameters: {
    docs: {
      description: {
        story: 'Emissions chart showing data across many categories'
      }
    }
  }
};

// Story with short time period
export const ShortTimePeriod: Story = {
  args: {
    data: generateSampleData(3)
  },
  parameters: {
    docs: {
      description: {
        story: 'Emissions chart showing data over a short time period (3 months)'
      }
    }
  }
};

// Story with long time period
export const LongTimePeriod: Story = {
  args: {
    data: generateSampleData(24)
  },
  parameters: {
    docs: {
      description: {
        story: 'Emissions chart showing data over a long time period (24 months)'
      }
    }
  }
};

// Story with seasonal patterns
export const SeasonalPatterns: Story = {
  args: {
    data: generateSampleData(12).map(record => {
      const month = parseInt(record.yearMonth.split('-')[1]);
      const seasonalFactor = month >= 6 && month <= 8 ? 1.5 : 0.8; // Higher in winter months
      return {
        ...record,
        amount: record.amount * seasonalFactor,
        carbonEstimateKgCO2e: record.carbonEstimateKgCO2e * seasonalFactor
      };
    })
  },
  parameters: {
    docs: {
      description: {
        story: 'Emissions chart showing seasonal patterns in emissions data'
      }
    }
  }
};

// Story with no data
export const NoData: Story = {
  args: {
    data: []
  },
  parameters: {
    docs: {
      description: {
        story: 'Emissions chart with no data available'
      }
    }
  }
};