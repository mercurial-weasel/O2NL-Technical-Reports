import React from 'react';
import { ReusableTable, formatCurrency } from '../../Common/Tables/ReusableTable';
import { CostData } from '../../../../api/cost/pab/types';

interface CostCardProps {
  data: CostData;
}

export function CostCard({ data }: CostCardProps) {
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
      data={data.items}
      config={config}
    />
  );
}