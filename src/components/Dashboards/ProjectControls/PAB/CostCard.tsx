import React from 'react';
import { ReusableTable, formatCurrency } from '../../Common/Tables/ReusableTable';
import { TableRow } from '../../Common/Tables/ReusableTable/types';

export function CostCard() {
  const tableData: TableRow[] = [
    { budget: "L1 to Date (M)", shared: 5.6, nonShared: 5.3, total: 12.1, ref: "Appendix 1", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: true },
    { budget: "L1 to complete", shared: "", nonShared: "", total: "", ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Directs", shared: 0.2, nonShared: 0.4, total: 0.5, ref: "Appendix 1", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: false },
    { budget: "Risk & Opp", shared: 0.07, nonShared: 0.02, total: 0.1, ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Escalation", shared: 0.2, nonShared: 0.4, total: 0.5, ref: "Appendix 1", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Contingency", shared: "", nonShared: "", total: "", ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Sub Total", shared: 0.07, nonShared: 1.22, total: 0.5, ref: "Appendix 2", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: true },
    { budget: "Total Limb 1", shared: 6.27, nonShared: 6.52, total: 13.8, ref: "", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: false },
    { budget: "Limb 2", shared: 1.2, nonShared: 1.3, total: 1.05, ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Subtotal", shared: 7.47, nonShared: 7.82, total: 14.85, ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: true },
    { budget: "Limb 3", shared: "", nonShared: "", total: "", ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Cost Performance", shared: 0.5, nonShared: 0.4, total: 0.2, ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Non-Cost Performance", shared: 0.2, nonShared: 0.24, total: 0.15, ref: "", comments: "", movementShared: "", movementNonShared: "", movementTotal: "", highlight: false },
    { budget: "Final ACtual Cost (FAC)", shared: 8.17, nonShared: 8.46, total: 15.2, ref: "", comments: "", movementShared: 0, movementNonShared: 0, movementTotal: 0, highlight: true }
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

  const config = {
    headerColor: 'bg-blue-900',
    textColor: 'text-text-primary',
    highlightColor: 'bg-blue-800',
    highlightTextColor: 'text-white'
  };

  return (
    <ReusableTable
      title="COST"
      sections={sections}
      data={tableData}
      config={config}
    />
  );
}