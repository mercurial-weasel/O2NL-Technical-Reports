import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';
import { TestData } from '@api/geotechnical/mdd/types';

interface MDDPlotProps {
  data: TestData[];
  height?: string;
}

export const MDDPlot: React.FC<MDDPlotProps> = ({ data, height = '500px' }) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plotRef.current || !data || data.length === 0) return;

    let traces = [];

    // Iterate over each sample in the data
    data.forEach(sample => {
        const sampleId = sample.sample_reference;
        const mddResults = sample.mdd_results || [];

        // Filter out results with zero values (assuming they are not valid)
        const filteredResults = mddResults.filter(res => res.water_content > 0 && res.dry_density > 0);
        if (filteredResults.length === 0) return;

        // Extract moisture content and dry density values for the sample
        const moistureValues = filteredResults.map(res => res.water_content);
        const dryDensityValues = filteredResults.map(res => res.dry_density);

        // Create a trace for each sample
        traces.push({
            x: moistureValues,
            y: dryDensityValues,
            mode: 'lines+markers',
            name: sampleId,
            type: 'scatter',
            line: { width: 2 },
            marker: { size: 8 }
        });
        
        // Add point for optimum MDD and moisture content
        traces.push({
          x: [sample.water_content], // From the API data, this is the optimum water content
          y: [sample.optimum_dry_density],
          mode: "markers",
          name: `${sampleId} - Optimum`,
          marker: { 
            size: 12, 
            symbol: 'star',
            color: 'red' 
          },
          showlegend: true
        });
    });

    // Define the layout with matching style to PSDPlot
    const layout = {
        title: {
            text: "Moisture Content vs Dry Density",
            font: { size: 18, weight: 'bold' },
            y: 0.95, // Position slightly lower
        },
        xaxis: {
            title: {
                text: "Moisture Content (%)",
                font: { size: 14 },
                standoff: 15, // Extra space for axis title
            },
            showgrid: true,
            gridcolor: 'lightgrey',
        },
        yaxis: {
            title: {
                text: "Dry Density (kN/m³)",
                font: { size: 14 },
                standoff: 15, // Extra space for axis title
            },
            showgrid: true,
            gridcolor: 'lightgrey'
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
        margin: { l: 80, r: 250, t: 80, b: 80 }, // Increased margins to match PSDPlot
        autosize: true
    };

    // Render the plot with improved config - matching PSDPlot
    Plotly.newPlot(plotRef.current, traces, layout, {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'moisture_content_vs_dry_density',
        height: 800,
        width: 1200,
        scale: 2
      }
    });

    // Clean up on unmount
    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  }, [data]);

  return <div ref={plotRef} style={{ width: '100%', height }} />;
};
