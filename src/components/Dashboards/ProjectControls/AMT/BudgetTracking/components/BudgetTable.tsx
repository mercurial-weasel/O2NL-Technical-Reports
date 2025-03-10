import React from 'react';
import { ReusableTable, formatCurrency } from '@common/Tables/ReusableTable';
import { AMTBudgetItem } from '@api/cost/amt-budgets/types';

interface BudgetTableProps {
  data: AMTBudgetItem[];
  onSort: (field: string) => void;
  sortConfig: { field: string; direction: 'asc' | 'desc' } | null;
  formatCurrency: (value: number) => string;
}

export function BudgetTable({ data, onSort, sortConfig, formatCurrency }: BudgetTableProps) {
  // Sort the data based on current sort configuration
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      
      // Handle numeric fields
      if (typeof a[sortConfig.field as keyof AMTBudgetItem] === 'number') {
        return ((a[sortConfig.field as keyof AMTBudgetItem] as number) - 
                (b[sortConfig.field as keyof AMTBudgetItem] as number)) * direction;
      }
      
      // Handle string fields (like WORKSTREAM)
      return String(a[sortConfig.field as keyof AMTBudgetItem])
        .localeCompare(String(b[sortConfig.field as keyof AMTBudgetItem])) * direction;
    });
  }, [data, sortConfig]);

  const sections = [
    {
      title: "",
      columns: [
        { 
          field: "WORKSTREAM", 
          title: "Workstream", 
          align: "left",
          sortable: true
        }
      ]
    },
    {
      title: "STAGE 2 BUILD UP",
      colspan: 2,
      columns: [
        { 
          field: "HOURS1", 
          title: "Hours", 
          align: "right", 
          formatter: (value: number) => value?.toLocaleString(),
          sortable: true
        },
        { 
          field: "TOTAL1", 
          title: "Total", 
          align: "right",
          formatter: formatCurrency,
          sortable: true 
        }
      ]
    },
    {
      title: "VARIED VALUE",
      colspan: 2,
      columns: [
        { 
          field: "HOURS2", 
          title: "Hours", 
          align: "right", 
          formatter: (value: number) => value?.toLocaleString(),
          sortable: true
        },
        { 
          field: "TOTAL2", 
          title: "Total", 
          align: "right",
          formatter: formatCurrency,
          sortable: true 
        }
      ]
    },
    {
      title: "DIFFERENCE",
      colspan: 2,
      columns: [
        { 
          field: "HOURS_DIFF", 
          title: "Hours", 
          align: "right",
          sortable: true,
          formatter: (value: number) => (
            <span className={value < 0 ? 'text-green-400' : value > 0 ? 'text-red-400' : ''}>
              {value?.toLocaleString()}
            </span>
          )
        },
        { 
          field: "TOTAL_DIFF", 
          title: "Total", 
          align: "right",
          sortable: true,
          formatter: (value: number) => (
            <span className={
              value > 0 ? 'text-red-400' : 
              value === 0 ? '' : 
              'text-green-400'
            }>
              {formatCurrency(value)}
            </span>
          )
        }
      ]
    }
  ];

  return (
    <ReusableTable
      title="Budget Details"
      sections={sections}
      data={sortedData}
      config={{
        headerColor: 'bg-blue-900',
        textColor: 'text-text-primary',
        highlightColor: 'bg-gray-800/50',
        highlightTextColor: 'text-text-primary'
      }}
      onSort={onSort}
      sortConfig={sortConfig}
    />
  );
}