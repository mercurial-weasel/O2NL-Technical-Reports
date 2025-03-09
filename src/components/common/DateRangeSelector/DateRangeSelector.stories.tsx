import type { Meta, StoryObj } from '@storybook/react';
import { DateRangeSelector } from './DateRangeSelector';

const meta = {
  title: 'Common/DateRangeSelector',
  component: DateRangeSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    dateRange: {
      control: 'object',
      description: 'Selected date range [startDate, endDate]'
    },
    onChange: {
      action: 'changed'
    }
  },
} satisfies Meta<typeof DateRangeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dateRange: [null, null]
  }
};

export const WithPreselectedDates: Story = {
  args: {
    dateRange: [new Date(2025, 0, 1), new Date(2025, 11, 31)]
  }
};

export const WithStartDateOnly: Story = {
  args: {
    dateRange: [new Date(2025, 0, 1), null]
  }
};

export const WithEndDateOnly: Story = {
  args: {
    dateRange: [null, new Date(2025, 11, 31)]
  }
};