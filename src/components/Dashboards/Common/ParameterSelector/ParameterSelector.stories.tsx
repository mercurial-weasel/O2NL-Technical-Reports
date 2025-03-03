import type { Meta, StoryObj } from '@storybook/react';
import { ParameterSelector } from './ParameterSelector';

const meta = {
  title: 'Dashboards/Common/ParameterSelector',
  component: ParameterSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    selectedParameters: {
      control: 'object',
      description: 'Set of selected parameters'
    },
    onChange: {
      action: 'changed'
    }
  },
} satisfies Meta<typeof ParameterSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedParameters: new Set(['pm10', 'pm2_5'])
  }
};

export const PM10Only: Story = {
  args: {
    selectedParameters: new Set(['pm10'])
  }
};

export const PM25Only: Story = {
  args: {
    selectedParameters: new Set(['pm2_5'])
  }
};