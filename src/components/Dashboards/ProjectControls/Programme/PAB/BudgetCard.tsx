import React from 'react';
import { ReusableTable, formatCurrency } from '@common/Tables/ReusableTable';
import { BudgetData } from '@api/projectcontrols/programme';

interface BudgetCardProps {
  data: BudgetData;
}

export function BudgetCard({ data }: BudgetCardProps) {
  const sections = [
    {
      title: "",
      columns: [
        { field: "budgetItem", title: "", align: "left" }
      ]
    },
    {
      title: "LIFE TO DATE",
      colspan: 3,
      columns: [
        { field: "shared", title: "Shared", align: "right", formatter: formatCurrency },
        { field: "nonShared", title: "Non Shared", align: "right", formatter: formatCurrency },
        { field: "total", title: "Total", align: "right", formatter: formatCurrency }
      ]
    },
    {
      title: "MOVEMENT",
      colspan: 3,
      columns: [
        { field: "movementShared", title: "Shared", align: "right", formatter: formatCurrency },
        { field: "movementNonShared", title: "Non Shared", align: "right", formatter: formatCurrency },
        { field: "movementTotal", title: "Total", align: "right", formatter: formatCurrency }
      ]
    }
  ];

  return (
    <ReusableTable
      title="BUDGET"
      sections={sections}
      data={data.items}
    />
  );
}