import type { Meta, StoryObj } from '@storybook/react';
import { StaffChart } from './StaffChart';
import { O2NL_Staff } from '@api/staff-fte/types';
import { MonthColumn } from '../../../StaffFTE/types';

const meta = {
  title: 'Dashboards/ProjectControls/P+C/StaffChart',
  component: StaffChart,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: 'Staff data records'
    },
    monthColumns: {
      control: 'object',
      description: 'Month column definitions'
    },
    mode: {
      control: 'radio',
      options: ['fte', 'numbers'],
      description: 'Chart display mode'
    }
  },
} satisfies Meta<typeof StaffChart>;

export default meta;
type Story = StoryObj<typeof meta>;

// Generate sample month columns
const generateMonthColumns = (count: number = 12): MonthColumn[] => {
  const startDate = new Date(2024, 8); // Start from September 2024
  return Array.from({ length: count }, (_, i) => {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    const monthName = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear().toString().slice(-2);
    return {
      key: `${monthName}_${year}`,
      label: `${date.toLocaleString('default', { month: 'short' })} ${year}`
    };
  });
};

// Generate sample staff data
const generateStaffData = (
  count: number = 50,
  monthColumns: MonthColumn[]
): O2NL_Staff[] => {
  const organizations = ['TT', 'Beca', 'Downer', 'McConnell Dowell'];
  const disciplines = ['Design', 'Engineering', 'Construction', 'Digital', 'Legacy Outcomes'];
  const nopTypes = ['CNOP', 'DNOP', 'CNOP/DNOP'];
  const locations = ['Auckland', 'Wellington', 'Christchurch'];
  const phases = ['Phase 1', 'Phase 2', 'Phase 3'];
  const statuses = ['Active', 'Pending', 'Completed'];

  return Array.from({ length: count }, (_, i) => {
    const startDate = new Date(2024, 8); // September 2024
    const endDate = new Date(2026, 8); // September 2026

    const staffMember: O2NL_Staff = {
      Discipline_Manager: `Manager ${i + 1}`,
      Team: disciplines[Math.floor(Math.random() * disciplines.length)],
      Location: locations[Math.floor(Math.random() * locations.length)],
      NOP_Type: nopTypes[Math.floor(Math.random() * nopTypes.length)],
      Org: organizations[Math.floor(Math.random() * organizations.length)],
      Project_Role_Title: `Role ${i + 1}`,
      Phase: phases[Math.floor(Math.random() * phases.length)],
      Name: `Staff Member ${i + 1}`,
      Status: statuses[Math.floor(Math.random() * statuses.length)],
      Last_updated_conf: new Date().toISOString(),
      Split_Assignment_: '',
      Resource_Options: '',
      Site_Based_: '',
      Pricing_P_G___Prof___Direct_Works: '',
      FTE__AVE_: 0.8 + Math.random() * 0.4, // Random FTE between 0.8 and 1.2
      Required_Start: startDate,
      Required_Finish: endDate
    };

    // Add monthly FTE values
    monthColumns.forEach(month => {
      const baseValue = 0.8 + Math.random() * 0.4;
      staffMember[month.key as keyof O2NL_Staff] = baseValue;
    });

    return staffMember;
  });
};

// Sample month columns and data
const sampleMonthColumns = generateMonthColumns();
const sampleData = generateStaffData(50, sampleMonthColumns);

export const Default: Story = {
  args: {
    data: sampleData,
    monthColumns: sampleMonthColumns,
    mode: 'fte'
  },
  parameters: {
    docs: {
      description: {
        story: 'Default staff chart showing FTE distribution'
      }
    }
  }
};

export const StaffNumbers: Story = {
  args: {
    data: sampleData,
    monthColumns: sampleMonthColumns,
    mode: 'numbers'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff chart showing headcount numbers'
      }
    }
  }
};

export const SmallTeam: Story = {
  args: {
    data: generateStaffData(10, sampleMonthColumns),
    monthColumns: sampleMonthColumns,
    mode: 'fte'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff chart for a small team'
      }
    }
  }
};

export const LargeTeam: Story = {
  args: {
    data: generateStaffData(100, sampleMonthColumns),
    monthColumns: sampleMonthColumns,
    mode: 'fte'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff chart for a large team'
      }
    }
  }
};

export const ShortTimeframe: Story = {
  args: {
    data: sampleData,
    monthColumns: generateMonthColumns(6),
    mode: 'fte'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff chart showing a 6-month timeframe'
      }
    }
  }
};

export const LongTimeframe: Story = {
  args: {
    data: sampleData,
    monthColumns: generateMonthColumns(24),
    mode: 'fte'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff chart showing a 24-month timeframe'
      }
    }
  }
};

export const SingleOrganization: Story = {
  args: {
    data: generateStaffData(20, sampleMonthColumns).map(staff => ({
      ...staff,
      Org: 'TT'
    })),
    monthColumns: sampleMonthColumns,
    mode: 'fte'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff chart showing data for a single organization'
      }
    }
  }
};

export const SingleDiscipline: Story = {
  args: {
    data: generateStaffData(20, sampleMonthColumns).map(staff => ({
      ...staff,
      Team: 'Engineering'
    })),
    monthColumns: sampleMonthColumns,
    mode: 'fte'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff chart showing data for a single discipline'
      }
    }
  }
};

export const NoData: Story = {
  args: {
    data: [],
    monthColumns: sampleMonthColumns,
    mode: 'fte'
  },
  parameters: {
    docs: {
      description: {
        story: 'Staff chart with no data available'
      }
    }
  }
};