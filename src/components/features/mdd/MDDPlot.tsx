import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';
import { TestData, MDDResult } from '@api/geotechnical/mdd/types';

interface MDDPlotProps {
  data: TestData[];
  height?: string;
}

export const MDDPlot: React.FC<MDDPlotProps> = ({ data, height = '500px' }) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plotRef.current || !data || data.length === 0) return;

    // Create figure data array
    let traces = [];

    // Add MDD test data points and curves
    data.forEach((sample) => {
      const sampleId = sample.sample_reference;
      
      // Get valid test points (filter out zero values)
      const validPoints = sample.mdd_results.filter(point => 
        point.water_content > 0 && point.dry_density > 0
      );
      
      if (validPoints.length > 0) {
        const moistureContent = validPoints.map(point => point.water_content);
        const dryDensity = validPoints.map(point => point.dry_density);

        // Add scatter plot for test points
        traces.push({
          x: moistureContent,
          y: dryDensity,
          mode: "markers",
          name: `${sampleId} - Test Points`,
          marker: { size: 8 },
          showlegend: true
        });

        // Add line connecting test points (sorted by moisture content)
        const sortedPoints = [...validPoints].sort((a, b) => a.water_content - b.water_content);
        traces.push({
          x: sortedPoints.map(point => point.water_content),
          y: sortedPoints.map(point => point.dry_density),
          mode: "lines",
          name: `${sampleId} - Curve`,
          line: { width: 2 },
          showlegend: true
        });

        // Add point for optimum MDD and moisture content
        traces.push({
          x: [sample.water_content], // From the API data, this is the optimum water content
          y: [sample.optimum_dry_density],
          mode: "markers",
          name: `${sampleId} - Optimum Point`,
          marker: { 
            size: 12, 
            symbol: 'star',
            color: 'red' 
          },
          showlegend: true
        });
      }
    });

    // Layout settings
    const layout = {
      title: "Maximum Dry Density Test Results",
      xaxis: {
        title: "Moisture Content (%)",
        showgrid: true,
        gridcolor: "lightgrey",
      },
      yaxis: {
        title: "Dry Density (Mg/m³)",
        showgrid: true,
        gridcolor: "lightgrey",
      },
      legend: {
        title: "Sample References",
        x: 1.05,
        y: 0.5,
        xanchor: "left",
        yanchor: "middle",
        traceorder: "normal",
      },
      plot_bgcolor: "white",
      margin: { l: 50, r: 250, t: 50, b: 50 },
      autosize: true,
    };

    // Render the plot
    Plotly.newPlot(plotRef.current, traces, layout);

    // Clean up on unmount
    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  }, [data]);

  return <div ref={plotRef} style={{ width: '100%', height }} />;
};
