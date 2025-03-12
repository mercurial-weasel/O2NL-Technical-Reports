import React from 'react';
import { MDDPlot } from '@features/mdd/MDDPlot';
import { TestData } from '@api/geotechnical/mdd/types';

interface MDDChartViewProps {
  data: TestData[]; 
}

export const MDDChartView: React.FC<MDDChartViewProps> = ({ data }) => {
  return (
    <div className="h-[600px]">
      <MDDPlot data={data} />
    </div>
  );
};
