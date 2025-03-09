import type { Meta, StoryObj } from '@storybook/react';
import { StatusLegend } from '@components/StatusLegend';

const meta = {
  title: 'Dashboards/Common/StatusLegend',
  component: StatusLegend,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    title: {
      control: 'text',
      description: 'Legend title'
    },
    levels: {
      control: 'object',
      description: 'Status level definitions'
    }
  },
} satisfies Meta<typeof StatusLegend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Air Quality Index',
    levels: [
      { range: '0-50', label: 'Good', color: '#10B981' },
      { range: '51-100', label: 'Moderate', color: '#F59E0B' },
      { range: '101-150', label: 'Unhealthy for Sensitive Groups', color: '#F97316' },
      { range: '151-200', label: 'Unhealthy', color: '#EF4444' }
    ]
  }
};

export const RiskLevels: Story = {
  args: {
    title: 'Risk Levels',
    levels: [
      { range: 'Low Risk', label: '1-3', color: '#10B981' },
      { range: 'Medium Risk', label: '4-6', color: '#F59E0B' },
      { range: 'High Risk', label: '7-9', color: '#EF4444' },
      { range: 'Critical Risk', label: '10+', color: '#991B1B' }
    ]
  }
};

export const EquipmentStatus: Story = {
  args: {
    title: 'Equipment Status',
    levels: [
      { range: 'Operational', label: 'Normal operation', color: '#10B981' },
      { range: 'Maintenance', label: 'Under maintenance', color: '#F59E0B' },
      { range: 'Fault', label: 'Error detected', color: '#EF4444' },
      { range: 'Offline', label: 'Not connected', color: '#6B7280' }
    ]
  }
};

export const ComplianceStatus: Story = {
  args: {
    title: 'Compliance Status',
    levels: [
      { range: 'Compliant', label: 'Meets all requirements', color: '#10B981' },
      { range: 'Minor Issues', label: 'Minor violations', color: '#F59E0B' },
      { range: 'Major Issues', label: 'Major violations', color: '#EF4444' },
      { range: 'Under Review', label: 'Being assessed', color: '#6366F1' }
    ]
  }
};