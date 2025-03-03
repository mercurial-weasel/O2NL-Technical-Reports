import type { Meta, StoryObj } from '@storybook/react';
import { ViewModeToggle } from './ViewModeToggle';

const meta = {
  title: 'Dashboards/Common/ViewModeToggle',
  component: ViewModeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['table', 'chart', 'calendar'],
      description: 'Current view mode'
    },
    onChange: {
      action: 'changed'
    }
  },
} satisfies Meta<typeof ViewModeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mode: 'chart'
  }
};

export const TableMode: Story = {
  args: {
    mode: 'table'
  }
};

export const CalendarMode: Story = {
  args: {
    mode: 'calendar'
  }
};