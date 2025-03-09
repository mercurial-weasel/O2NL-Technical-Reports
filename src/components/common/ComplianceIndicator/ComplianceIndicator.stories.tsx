import type { Meta, StoryObj } from '@storybook/react';
import { ComplianceIndicator } from './ComplianceIndicator';

const meta = {
  title: 'Common/ComplianceIndicator',
  component: ComplianceIndicator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'text',
      description: 'Compliance status'
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Indicator size'
    }
  },
} satisfies Meta<typeof ComplianceIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    status: 'Compliant',
    size: 'md'
  }
};

export const Warning: Story = {
  args: {
    status: 'Warning',
    size: 'md'
  }
};

export const NonCompliant: Story = {
  args: {
    status: 'Non-Compliant',
    size: 'md'
  }
};

export const UnderReview: Story = {
  args: {
    status: 'Under Review',
    size: 'md'
  }
};

export const Small: Story = {
  args: {
    status: 'Compliant',
    size: 'sm'
  }
};

export const Large: Story = {
  args: {
    status: 'Compliant',
    size: 'lg'
  }
};