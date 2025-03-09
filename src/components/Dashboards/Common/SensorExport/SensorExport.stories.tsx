import type { Meta, StoryObj } from '@storybook/react';
import { SensorExport } from '@components/SensorExport';

const meta = {
  title: 'Dashboards/Common/SensorExport',
  component: SensorExport,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onExport: {
      action: 'exported'
    },
    loading: {
      control: 'boolean',
      description: 'Loading state'
    }
  },
} satisfies Meta<typeof SensorExport>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    loading: false
  }
};

export const Loading: Story = {
  args: {
    loading: true
  }
};