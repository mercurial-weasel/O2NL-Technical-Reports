import React from 'react';
import { PSDPlot } from '@features/geotechnical/psd/PSDPlot';
import { ParticleSizeDistributionTest } from '@api/geotechnical/psd';

interface PSDChartViewProps {
  data: ParticleSizeDistributionTest[]; 
}

export const PSDChartView: React.FC<PSDChartViewProps> = ({ data }) => {
  // Transform data for the plot component
  const plotData = data.map(result => ({
    sample_id: result.sample_unique_id,
    sample_reference: result.sample_reference,
    point_id: result.location_id,
    depth_to: result.depth_to,
    test_date: result.date_tested,
    material: result.sample_type,
    particle_size_result: result.particle_size_result
  }));
  
  return (
    <div className="h-[600px]">
      <PSDPlot data={plotData} />
    </div>
  );
};
