import React from 'react';
import { ReusableTable, formatCurrency } from '../../Common/Tables/ReusableTable';
import { TableRow } from '../../Common/Tables/ReusableTable/types';

export function BudgetCard() {
  const tableData: TableRow[] = [
    { budget: "Initial Target Cost L1 (M)", shared: 6, nonShared: 2, total: 5, ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Variations", shared: "", nonShared: "", total: "", ref: "Appx 3", comments: "Variations pending approval", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Approved", shared: -0.17, nonShared: 2, total: 4, ref: "", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: false },
    { budget: "Unapproved", shared: "", nonShared: "", total: "", ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Totals", shared: -0.17, nonShared: 2, total: 4, ref: "", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: true },
    { budget: "", shared: "", nonShared: "", total: "", ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Total Limb 1", shared: 5.83, nonShared: 4, total: 9, ref: "", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: true },
    { budget: "Limb 2", shared: 1, nonShared: 1.2, total: 1.6, ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Limb 3", shared: 3.5, nonShared: 1.4, total: 1.8, ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Final Target Cost (FTC)", shared: 10.33, nonShared: 6.6, total: 12.4, ref: "", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: true }
  ];

  const sections = [
    {
      title: "",
      columns: [
        { field: "budget", title: "", align: "left" }
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
      data={tableData}
    />
  );
}