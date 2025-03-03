import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../Card';

const meta = {
  title: 'Common/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    hover: {
      control: 'boolean',
    },
    glow: {
      control: 'boolean',
    },
    className: {
      control: 'text',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Default Card</h3>
        <p className="text-text-secondary">This is a basic card component with some sample content.</p>
      </div>
    ),
  },
};

export const WithHover: Story = {
  args: {
    hover: true,
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Hover Card</h3>
        <p className="text-text-secondary">This card has hover effects enabled. Try hovering over it!</p>
      </div>
    ),
  },
};

export const WithGlow: Story = {
  args: {
    hover: true,
    glow: true,
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-2">Glowing Card</h3>
        <p className="text-text-secondary">This card has both hover and glow effects enabled.</p>
      </div>
    ),
  },
};

export const CustomStyle: Story = {
  args: {
    className: 'p-8 max-w-md',
    hover: true,
    children: (
      <div>
        <h3 className="text-xl font-bold text-text-primary mb-4">Custom Styled Card</h3>
        <p className="text-text-secondary mb-4">
          This card demonstrates custom styling through className props.
        </p>
        <button className="px-4 py-2 bg-brand-primary text-white rounded-lg">
          Action Button
        </button>
      </div>
    ),
  },
};

export const NestedCards: Story = {
  args: {
    className: 'p-6 max-w-xl',
    hover: true,
    children: (
      <div>
        <h3 className="text-xl font-bold text-text-primary mb-4">Parent Card</h3>
        <div className="grid grid-cols-2 gap-4">
          <Card hover>
            <div className="p-4">
              <h4 className="text-lg font-semibold text-text-primary mb-2">Child Card 1</h4>
              <p className="text-text-secondary">Nested card example</p>
            </div>
          </Card>
          <Card hover>
            <div className="p-4">
              <h4 className="text-lg font-semibold text-text-primary mb-2">Child Card 2</h4>
              <p className="text-text-secondary">Nested card example</p>
            </div>
          </Card>
        </div>
      </div>
    ),
  },
};