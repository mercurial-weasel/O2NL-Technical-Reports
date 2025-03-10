import type { Meta, StoryObj } from '@storybook/react';
import { ChartContainer } from './ChartContainer';

const meta = {
  title: 'Common/ChartContainer',
  component: ChartContainer,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Chart data array'
    },
    layout: {
      control: 'object',
      description: 'Chart layout configuration'
    },
    title: {
      control: 'text',
      description: 'Chart title'
    },
    height: {
      control: 'number',
      description: 'Chart height in pixels'
    }
  },
} satisfies Meta<typeof ChartContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample line chart data
const lineChartData = [
  {
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Series A',
    x: [1, 2, 3, 4, 5],
    y: [1, 3, 2, 4, 3],
    marker: { color: '#6CC24A' }
  },
  {
    type: 'scatter',
    mode: 'lines+markers',
    name: 'Series B',
    x: [1, 2, 3, 4, 5],
    y: [2, 4, 1, 3, 5],
    marker: { color: '#0077FF' }
  }
];

// Sample bar chart data
const barChartData = [
  {
    type: 'bar',
    name: 'Category A',
    x: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    y: [20, 35, 25, 45, 30],
    marker: { color: '#6CC24A' }
  },
  {
    type: 'bar',
    name: 'Category B',
    x: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    y: [15, 25, 30, 35, 40],
    marker: { color: '#0077FF' }
  }
];

export const LineChart: Story = {
  args: {
    title: 'Line Chart Example',
    data: lineChartData,
    layout: {
      xaxis: {
        title: { text: 'X Axis' }
      },
      yaxis: {
        title: { text: 'Y Axis' }
      }
    },
    height: 400
  }
};

export const BarChart: Story = {
  args: {
    title: 'Bar Chart Example',
    data: barChartData,
    layout: {
      barmode: 'group',
      xaxis: {
        title: { text: 'Month' }
      },
      yaxis: {
        title: { text: 'Value' }
      }
    },
    height: 400
  }
};

export const CustomHeight: Story = {
  args: {
    ...LineChart.args,
    height: 600
  }
};

export const WithoutTitle: Story = {
  args: {
    data: lineChartData,
    layout: LineChart.args?.layout,
    height: 400
  }
};