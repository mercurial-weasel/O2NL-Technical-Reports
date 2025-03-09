import type { Meta, StoryObj } from '@storybook/react';
import { DeviceStatusBadge } from './DeviceStatusBadge';

const meta = {
  title: 'Common/DeviceStatusBadge',
  component: DeviceStatusBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'text',
      description: 'Device status'
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Badge size'
    }
  },
} satisfies Meta<typeof DeviceStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'active',
    size: 'md'
  }
};

export const Maintenance: Story = {
  args: {
    status: 'maintenance',
    size: 'md'
  }
};

export const Fault: Story = {
  args: {
    status: 'fault',
    size: 'md'
  }
};

export const Offline: Story = {
  args: {
    status: 'offline',
    size: 'md'
  }
};

export const Small: Story = {
  args: {
    status: 'active',
    size: 'sm'
  }
};

export const Large: Story = {
  args: {
    status: 'active',
    size: 'lg'
  }
};