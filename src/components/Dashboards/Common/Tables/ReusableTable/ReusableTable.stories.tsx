import type { Meta, StoryObj } from '@storybook/react';
import { ReusableTable } from './ReusableTable';

const meta = {
  title: 'Common/Tables/ReusableTable',
  component: ReusableTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ReusableTable>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockData = [
  {
    name: 'Project A',
    budget: 1000000,
    spent: 750000,
    remaining: 250000,
    status: 'On Track',
    ref: 'REF001',
    comments: 'Project is progressing well',
    highlight: false
  },
  {
    name: 'Project B',
    budget: 2000000,
    spent: 1800000,
    remaining: 200000,
    status: 'At Risk',
    ref: 'REF002',
    comments: 'Budget concerns',
    highlight: true
  },
  {
    name: 'Project C',
    budget: 500000,
    spent: 450000,
    remaining: 50000,
    status: 'Delayed',
    ref: 'REF003',
    comments: 'Timeline issues',
    highlight: false
  }
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const Default: Story = {
  args: {
    title: 'Project Status',
    sections: [
      {
        title: 'Project',
        columns: [
          { field: 'name', title: 'Name', align: 'left' }
        ]
      },
      {
        title: 'Financial',
        columns: [
          { field: 'budget', title: 'Budget', align: 'right', formatter: formatCurrency },
          { field: 'spent', title: 'Spent', align: 'right', formatter: formatCurrency },
          { field: 'remaining', title: 'Remaining', align: 'right', formatter: formatCurrency }
        ]
      },
      {
        title: 'Status',
        columns: [
          { 
            field: 'status', 
            title: 'Status', 
            align: 'center',
            formatter: (value: string) => (
              <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                value === 'On Track' ? 'bg-green-500/20 text-green-400' :
                value === 'At Risk' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {value}
              </span>
            )
          }
        ]
      }
    ],
    data: mockData,
  },
};

export const WithSorting: Story = {
  args: {
    ...Default.args,
    onSort: (field: string) => console.log(`Sorting by ${field}`),
    sortConfig: { field: 'name', direction: 'asc' }
  },
};

export const WithCustomConfig: Story = {
  args: {
    ...Default.args,
    config: {
      headerColor: 'bg-purple-900',
      textColor: 'text-text-primary',
      highlightColor: 'bg-purple-800',
      highlightTextColor: 'text-white'
    }
  },
};

export const WithFixedRows: Story = {
  args: {
    ...Default.args,
    data: [
      ...mockData,
      {
        name: 'Total',
        budget: 3500000,
        spent: 3000000,
        remaining: 500000,
        status: '',
        ref: '',
        comments: '',
        highlight: true
      }
    ],
    fixedRows: 1
  },
};

export const WithTooltips: Story = {
  args: {
    ...Default.args,
    getTooltipContent: (row) => {
      if (!row.ref && !row.comments) return null;
      let content = '';
      if (row.ref) content += `Reference: ${row.ref}\n`;
      if (row.comments) content += `Comments: ${row.comments}`;
      return content.trim();
    }
  },
};