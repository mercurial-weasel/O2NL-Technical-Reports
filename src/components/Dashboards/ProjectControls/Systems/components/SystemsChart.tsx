import React from 'react';
import { PivotCategory } from '../data/pivotData';
import { BusinessAreaChart } from './BusinessAreaChart';

interface SystemsChartProps {
  data: PivotCategory[];
  adoptionLevels: readonly string[];
}

export function SystemsChart({ data, adoptionLevels }: SystemsChartProps) {
  return (
    <div>
      {data.map(category => (
        <BusinessAreaChart
          key={category.category}
          category={category}
          adoptionLevels={adoptionLevels}
        />
      ))}
    </div>
  );
}