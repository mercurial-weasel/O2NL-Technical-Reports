import type { Meta, StoryObj } from '@storybook/react';
import { Chevron } from './Chevron';

const meta = {
  title: 'Common/Chevron',
  component: Chevron,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    indicator: {
      control: 'text',
    },
    backgroundColor: {
      control: 'color',
    },
    textColor: {
      control: 'color',
    },
    width: {
      control: { type: 'range', min: 50, max: 200, step: 10 },
    },
    height: {
      control: { type: 'range', min: 10, max: 50, step: 5 },
    },
    arrowWidth: {
      control: { type: 'range', min: 10, max: 50, step: 5 },
    },
  },
} satisfies Meta<typeof Chevron>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    indicator: '85%',
    backgroundColor: 'bg-blue-900',
    textColor: 'text-white',
    width: 100,
    height: 20,
    arrowWidth: 20,
  },
};

export const Success: Story = {
  args: {
    indicator: 'On Track',
    backgroundColor: 'bg-green-900',
    textColor: 'text-green-100',
    width: 120,
    height: 24,
    arrowWidth: 24,
  },
};

export const Warning: Story = {
  args: {
    indicator: 'At Risk',
    backgroundColor: 'bg-orange-900',
    textColor: 'text-orange-100',
    width: 100,
    height: 20,
    arrowWidth: 20,
  },
};

export const Error: Story = {
  args: {
    indicator: 'Delayed',
    backgroundColor: 'bg-red-900',
    textColor: 'text-red-100',
    width: 100,
    height: 20,
    arrowWidth: 20,
  },
};

export const CustomSize: Story = {
  args: {
    indicator: 'Custom',
    backgroundColor: 'bg-purple-900',
    textColor: 'text-white',
    width: 150,
    height: 30,
    arrowWidth: 30,
  },
};