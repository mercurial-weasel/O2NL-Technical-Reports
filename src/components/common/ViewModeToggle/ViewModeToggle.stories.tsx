import type { Meta, StoryObj } from '@storybook/react';
import { ViewModeToggle } from './ViewModeToggle';

const meta = {
  title: 'Common/ViewModeToggle',
  component: ViewModeToggle,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    mode: {
      control: 'radio',
      options: ['table', 'chart', 'map'], // Changed 'calendar' to 'map'
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

export const MapMode: Story = { // Changed from CalendarMode to MapMode
  args: {
    mode: 'map' // Changed from 'calendar' to 'map'
  }
};