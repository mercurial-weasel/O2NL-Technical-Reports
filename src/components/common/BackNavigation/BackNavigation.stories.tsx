import type { Meta, StoryObj } from '@storybook/react';
import { BackNavigation } from './BackNavigation';
import { BrowserRouter } from 'react-router-dom';

const meta = {
  title: 'Common/BackNavigation',
  component: BackNavigation,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    to: {
      control: 'text',
    },
    text: {
      control: 'text',
    },
  },
} satisfies Meta<typeof BackNavigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    to: '/',
    text: 'Back',
  },
};

export const CustomText: Story = {
  args: {
    to: '/dashboard',
    text: 'Back to Dashboard',
  },
};