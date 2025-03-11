import React from 'react';
import { PSDPlot } from '@features/geotechnical/PSD/PSDPlot';

interface PSDChartViewProps {
  data: any[]; // Using the PSDPlot component's expected data format
}

export const PSDChartView: React.FC<PSDChartViewProps> = ({ data }) => {
  return (
    <div className="h-[600px]">
      <PSDPlot data={data} />
    </div>
  );
};
