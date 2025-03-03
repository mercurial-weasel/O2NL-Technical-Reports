import type { Meta, StoryObj } from '@storybook/react';
import { MultiSelectFilter } from './MultiSelectFilter';
import { useState } from 'react';

const meta = {
  title: 'Common/Filters/MultiSelectFilter',
  component: MultiSelectFilter,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      control: 'object',
    },
    selectedValues: {
      control: 'object',
    },
    placeholder: {
      control: 'text',
    },
  },
} satisfies Meta<typeof MultiSelectFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'option4', label: 'Option 4' },
];

export const Default: Story = {
  args: {
    options,
    selectedValues: new Set(['option1']),
    placeholder: 'Select options',
  },
};

export const WithInteraction: Story = {
  render: () => {
    const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set(['option1']));
    
    const handleChange = (value: string) => {
      setSelectedValues(prev => {
        const next = new Set(prev);
        if (value === 'all') {
          return next.has('all') ? new Set() : new Set(['all']);
        }
        next.delete('all');
        if (next.has(value)) {
          next.delete(value);
          if (next.size === 0) next.add('all');
        } else {
          next.add(value);
        }
        return next;
      });
    };

    return (
      <MultiSelectFilter
        options={options}
        selectedValues={selectedValues}
        onChange={handleChange}
        placeholder="Select options"
      />
    );
  },
};

export const Empty: Story = {
  args: {
    options,
    selectedValues: new Set(),
    placeholder: 'Select options',
  },
};

export const AllSelected: Story = {
  args: {
    options,
    selectedValues: new Set(['all']),
    placeholder: 'Select options',
  },
};

export const MultipleSelected: Story = {
  args: {
    options,
    selectedValues: new Set(['option1', 'option2']),
    placeholder: 'Select options',
  },
};