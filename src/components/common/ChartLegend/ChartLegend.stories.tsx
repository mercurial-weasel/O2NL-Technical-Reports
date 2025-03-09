import type { Meta, StoryObj } from '@storybook/react';
import { ChartLegend } from './ChartLegend';

const meta = {
  title: 'Common/ChartLegend',
  component: ChartLegend,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Legend title'
    },
    items: {
      control: 'object',
      description: 'Legend items array'
    }
  },
} satisfies Meta<typeof ChartLegend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Chart Legend',
    items: [
      { label: 'Series A', value: '45%', color: '#6CC24A', unit: '%' },
      { label: 'Series B', value: '30%', color: '#0077FF', unit: '%' },
      { label: 'Series C', value: '25%', color: '#F2CD00', unit: '%' }
    ]
  }
};

export const WithoutUnits: Story = {
  args: {
    title: 'Simple Legend',
    items: [
      { label: 'Category 1', value: '100' },
      { label: 'Category 2', value: '200' },
      { label: 'Category 3', value: '300' }
    ]
  }
};

export const WithCustomColors: Story = {
  args: {
    title: 'Status Legend',
    items: [
      { label: 'Active', value: '10', color: '#10B981' },
      { label: 'Inactive', value: '5', color: '#EF4444' },
      { label: 'Pending', value: '3', color: '#F59E0B' }
    ]
  }
};

export const LongLabels: Story = {
  args: {
    title: 'Detailed Legend',
    items: [
      { label: 'Very Long Category Name That Might Wrap', value: '1,234', color: '#6CC24A', unit: 'units' },
      { label: 'Another Long Category Description', value: '5,678', color: '#0077FF', unit: 'units' },
      { label: 'Third Lengthy Category Title Here', value: '9,012', color: '#F2CD00', unit: 'units' }
    ]
  }
};

export const ManyItems: Story = {
  args: {
    title: 'Multi-Item Legend',
    items: Array.from({ length: 8 }, (_, i) => ({
      label: `Category ${i + 1}`,
      value: `${Math.floor(Math.random() * 1000)}`,
      color: `hsl(${i * 45}, 70%, 50%)`,
      unit: 'units'
    }))
  }
};

export const WithLargeValues: Story = {
  args: {
    title: 'Large Values Legend',
    items: [
      { label: 'Revenue', value: '1,234,567', color: '#6CC24A', unit: 'USD' },
      { label: 'Expenses', value: '987,654', color: '#EF4444', unit: 'USD' },
      { label: 'Profit', value: '246,913', color: '#10B981', unit: 'USD' }
    ]
  }
};

export const WithPercentages: Story = {
  args: {
    title: 'Percentage Distribution',
    items: [
      { label: 'Complete', value: '65.5', color: '#10B981', unit: '%' },
      { label: 'In Progress', value: '25.3', color: '#F59E0B', unit: '%' },
      { label: 'Not Started', value: '9.2', color: '#EF4444', unit: '%' }
    ]
  }
};

export const WithoutColors: Story = {
  args: {
    title: 'Simple Metrics',
    items: [
      { label: 'Total Users', value: '1,234' },
      { label: 'Active Users', value: '789' },
      { label: 'New Users', value: '123' }
    ]
  }
};