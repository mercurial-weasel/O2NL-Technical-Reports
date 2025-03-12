import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';
import { TestData } from '@api/geotechnical/mdd/types';

interface MDDPlotProps {
  data: TestData[];
  height?: string;
}

/**
 * Generates an interactive moisture content vs dry density plot using Plotly.
 * 
 * For each sample, the function extracts the moisture content and dry density values
 * from the 'mdd_results' array and plots them as a curve with markers.
 * 
 * @param {HTMLDivElement} plotDiv - The DOM element to render the plot into
 * @param {TestData[]} data - List of test results loaded from mdd api
 */
function plotMoistureContentVsDryDensity(plotDiv: HTMLDivElement, data: TestData[]) {
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

    // Define the layout
    const layout = {
        title: 'Maximum Dry Density Test Results',
        xaxis: {
            title: 'Moisture Content (%)',
            showgrid: true,
            gridcolor: 'lightgrey'
        },
        yaxis: {
            title: 'Dry Density (Mg/m³)',
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
        margin: { l: 50, r: 250, t: 50, b: 50 },
        autosize: true
    };

    // Plot the figure
    Plotly.newPlot(plotDiv, traces, layout);
}

export const MDDPlot: React.FC<MDDPlotProps> = ({ data, height = '500px' }) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plotRef.current || !data || data.length === 0) return;

    // Use the plotting function to render the plot
    plotMoistureContentVsDryDensity(plotRef.current, data);

    // Clean up on unmount
    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  }, [data]);

  return <div ref={plotRef} style={{ width: '100%', height }} />;
};
