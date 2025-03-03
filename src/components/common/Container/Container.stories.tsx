import type { Meta, StoryObj } from '@storybook/react';
import { Container } from '../Container';
import { Card } from '../Card';
import { Button } from '../Button';
import { Download, BarChart2, Table2 } from 'lucide-react';

const meta = {
  title: 'Common/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes to apply to the container'
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Container Example</h2>
        <p className="text-text-secondary">
          This is a basic container that provides consistent horizontal padding and maximum width.
        </p>
      </div>
    ),
  },
};

export const WithCards: Story = {
  args: {
    children: (
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Container with Cards</h2>
          <Button variant="secondary" size="sm" icon={Download}>
            Download Report
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} hover>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">Card {i}</h3>
                <p className="text-text-secondary">This is a sample card with hover effect.</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
};

export const WithFilters: Story = {
  args: {
    children: (
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Container with Filters</h2>
          <div className="flex items-center gap-4">
            <select className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary">
              <option>Filter by Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <select className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary">
              <option>Filter by Type</option>
              <option>Type A</option>
              <option>Type B</option>
            </select>
          </div>
        </div>
        <Card hover>
          <div className="p-6">
            <p className="text-text-secondary">Content goes here...</p>
          </div>
        </Card>
      </div>
    ),
  },
};

export const WithViewToggle: Story = {
  args: {
    children: (
      <div className="py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Container with View Toggle</h2>
          <div className="flex items-center bg-gray-800/50 rounded-lg p-0.5">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-brand-primary text-white">
              <BarChart2 className="w-4 h-4" />
              <span>Chart</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary">
              <Table2 className="w-4 h-4" />
              <span>Table</span>
            </button>
          </div>
        </div>
        <Card hover>
          <div className="p-6">
            <p className="text-text-secondary">Content goes here...</p>
          </div>
        </Card>
      </div>
    ),
  },
};

export const WithMetrics: Story = {
  args: {
    children: (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Container with Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Users', value: '1,234' },
            { label: 'Active Users', value: '789' },
            { label: 'Conversion Rate', value: '12.3%' },
            { label: 'Revenue', value: '$45,678' }
          ].map((metric, i) => (
            <Card key={i} hover>
              <div className="p-6">
                <h3 className="text-sm font-medium text-text-secondary mb-1">{metric.label}</h3>
                <div className="text-2xl font-bold text-text-primary">{metric.value}</div>
              </div>
            </Card>
          ))}
        </div>
        <Card hover>
          <div className="p-6">
            <p className="text-text-secondary">Main content goes here...</p>
          </div>
        </Card>
      </div>
    ),
  },
};

export const WithNestedContainers: Story = {
  args: {
    children: (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Nested Containers</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card hover>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Main Content</h3>
                <p className="text-text-secondary">Primary content area with larger width.</p>
              </div>
            </Card>
          </div>
          <div>
            <Card hover>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-text-primary mb-4">Sidebar</h3>
                <p className="text-text-secondary">Secondary content area with smaller width.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    ),
  },
};

export const WithCustomBackground: Story = {
  args: {
    className: 'bg-background-darker',
    children: (
      <div className="py-12">
        <h2 className="text-2xl font-bold text-text-primary mb-6 text-center">Container with Background</h2>
        <Card hover glow>
          <div className="p-6">
            <p className="text-text-secondary">Content with custom container background...</p>
          </div>
        </Card>
      </div>
    ),
  },
};

export const WithResponsivePadding: Story = {
  args: {
    className: 'px-4 sm:px-6 lg:px-8',
    children: (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4">Responsive Padding</h2>
        <p className="text-text-secondary">
          This container has responsive horizontal padding that adjusts based on screen size.
        </p>
      </div>
    ),
  },
};