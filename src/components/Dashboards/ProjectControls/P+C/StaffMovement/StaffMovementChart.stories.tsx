import type { Meta, StoryObj } from '@storybook/react';
import { StaffMovementChart } from './StaffMovementChart';
import { StaffMovement } from '../../../../../api/staff-fte/transformations';

const meta = {
  title: 'Dashboards/ProjectControls/P+C/StaffMovementChart',
  component: StaffMovementChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Staff movement data'
    },
    groupBy: {
      control: 'radio',
      options: ['organization', 'discipline', 'nop'],
      description: 'Grouping criteria'
    }
  },
} satisfies Meta<typeof StaffMovementChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to generate sample months
const generateMonths = (count: number = 12): string[] => {
  const months = [];
  const startDate = new Date(2024, 8); // Start from September 2024
  
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    months.push(`${date.toLocaleString('default', { month: 'short' })}_${date.getFullYear().toString().slice(-2)}`);
  }
  
  return months;
};

// Helper function to generate movement data
const generateMovementData = (
  categories: string[],
  months: string[],
  maxMovement: number = 10
): StaffMovement => {
  const categoryData = categories.map(name => ({
    name,
    movements: Object.fromEntries(
      months.map(month => [
        month,
        {
          onboarding: Math.floor(Math.random() * maxMovement),
          offboarding: Math.floor(Math.random() * maxMovement),
          onboardingStaff: Array.from(
            { length: Math.floor(Math.random() * 5) + 1 },
            (_, i) => `Staff ${i + 1}`
          ),
          offboardingStaff: Array.from(
            { length: Math.floor(Math.random() * 5) + 1 },
            (_, i) => `Staff ${i + 1}`
          )
        }
      ])
    )
  }));

  // Calculate totals
  const total = Object.fromEntries(
    months.map(month => [
      month,
      {
        onboarding: categoryData.reduce((sum, cat) => sum + cat.movements[month].onboarding, 0),
        offboarding: categoryData.reduce((sum, cat) => sum + cat.movements[month].offboarding, 0),
        onboardingStaff: categoryData.flatMap(cat => cat.movements[month].onboardingStaff),
        offboardingStaff: categoryData.flatMap(cat => cat.movements[month].offboardingStaff)
      }
    ])
  );

  return {
    organizations: categoryData,
    disciplines: [],
    nopTypes: [],
    total,
    months
  };
};

// Sample data for different scenarios
const months = generateMonths();
const organizations = ['TT', 'Beca', 'Downer', 'McConnell Dowell'];
const disciplines = ['Design', 'Engineering', 'Construction', 'Digital', 'Legacy Outcomes'];
const nopTypes = ['CNOP', 'DNOP', 'CNOP/DNOP'];

export const ByOrganization: Story = {
  args: {
    data: generateMovementData(organizations, months),
    groupBy: 'organization'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff movement chart grouped by organization'
      }
    }
  }
};

export const ByDiscipline: Story = {
  args: {
    data: {
      ...generateMovementData(disciplines, months),
      disciplines: generateMovementData(disciplines, months).organizations
    },
    groupBy: 'discipline'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff movement chart grouped by discipline'
      }
    }
  }
};

export const ByNOPType: Story = {
  args: {
    data: {
      ...generateMovementData(nopTypes, months),
      nopTypes: generateMovementData(nopTypes, months).organizations
    },
    groupBy: 'nop'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff movement chart grouped by NOP type'
      }
    }
  }
};

export const HighMovement: Story = {
  args: {
    data: generateMovementData(organizations, months, 20),
    groupBy: 'organization'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff movement chart showing high staff turnover'
      }
    }
  }
};

export const LowMovement: Story = {
  args: {
    data: generateMovementData(organizations, months, 5),
    groupBy: 'organization'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff movement chart showing low staff turnover'
      }
    }
  }
};

export const ShortTimeframe: Story = {
  args: {
    data: generateMovementData(organizations, generateMonths(6)),
    groupBy: 'organization'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff movement chart showing a 6-month timeframe'
      }
    }
  }
};

export const LongTimeframe: Story = {
  args: {
    data: generateMovementData(organizations, generateMonths(24)),
    groupBy: 'organization'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff movement chart showing a 24-month timeframe'
      }
    }
  }
};

export const SingleCategory: Story = {
  args: {
    data: generateMovementData(['TT'], months),
    groupBy: 'organization'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff movement chart showing data for a single category'
      }
    }
  }
};

export const ManyCategories: Story = {
  args: {
    data: generateMovementData([...organizations, 'Other 1', 'Other 2', 'Other 3'], months),
    groupBy: 'organization'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff movement chart showing data for many categories'
      }
    }
  }
};

export const SeasonalPatterns: Story = {
  args: {
    data: {
      ...generateMovementData(organizations, months),
      organizations: organizations.map(org => ({
        name: org,
        movements: Object.fromEntries(
          months.map((month, i) => [
            month,
            {
              onboarding: Math.floor(Math.sin(i / 6 * Math.PI) * 5 + 6),
              offboarding: Math.floor(Math.cos(i / 6 * Math.PI) * 5 + 6),
              onboardingStaff: Array.from(
                { length: Math.floor(Math.random() * 5) + 1 },
                (_, i) => `Staff ${i + 1}`
              ),
              offboardingStaff: Array.from(
                { length: Math.floor(Math.random() * 5) + 1 },
                (_, i) => `Staff ${i + 1}`
              )
            }
          ])
        )
      }))
    },
    groupBy: 'organization'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff movement chart showing seasonal patterns in staff movement'
      }
    }
  }
};

export const NoMovement: Story = {
  args: {
    data: {
      organizations: organizations.map(org => ({
        name: org,
        movements: Object.fromEntries(
          months.map(month => [
            month,
            {
              onboarding: 0,
              offboarding: 0,
              onboardingStaff: [],
              offboardingStaff: []
            }
          ])
        )
      })),
      disciplines: [],
      nopTypes: [],
      total: Object.fromEntries(
        months.map(month => [
          month,
          {
            onboarding: 0,
            offboarding: 0,
            onboardingStaff: [],
            offboardingStaff: []
          }
        ])
      ),
      months
    },
    groupBy: 'organization'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff movement chart with no staff movement'
      }
    }
  }
};