import React from 'react';
import { O2NL_Staff } from '../../../../../api/staff-fte/types';
import { StaffChart } from '../StaffComponents/StaffChart';

interface StaffNumbersChartProps {
  data: O2NL_Staff[];
}

export function StaffNumbersChart({ data }: StaffNumbersChartProps) {
  return (
    <StaffChart 
      data={data} 
      mode="numbers" 
    />
  );
}