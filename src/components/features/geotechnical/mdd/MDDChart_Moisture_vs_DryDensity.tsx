import React, { useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-dist';
import { GeoMDD } from '@api/geotechnical/mdd';

interface MDDChart_Moisture_vs_DryDensityProps {
  data: GeoMDD[];
}

export const MDDChart_Moisture_vs_DryDensity: React.FC<MDDChart_Moisture_vs_DryDensityProps> = ({ data }) => {
  const plotRef = useRef<HTMLDivElement>(null);

  // Create data series for the chart
  const plotData = useMemo(() => {
    // Default colors for the chart series
    const defaultColors = [
      "#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
      "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"
    ];
    
    return data
      .filter(sample => sample.mdd_results && sample.mdd_results.length > 0)
      .map((sample, idx) => {
        const sampleRef = sample.SAMPLE_REFERENCE || sample.POINT_ID || `Sample ${idx+1}`;
        const geologicalUnit = sample.geological_unit || "Unknown Unit";
        const legendLabel = `${sampleRef} (${geologicalUnit})`;
        
        // Get all test points
        const testPoints = sample.mdd_results
          .filter(res => res.water_content != null && res.dry_density != null)
          .map(res => ({
            water_content: res.water_content,
            dry_density: res.dry_density,
            is_optimum: false
          }))
          .sort((a, b) => a.water_content - b.water_content);
        
        // Add the optimum point if available
        if (sample.MC != null && sample.DryDensity != null) {
          testPoints.push({
            water_content: sample.MC,
            dry_density: sample.DryDensity,
            is_optimum: true
          });
        }
        
        if (testPoints.length === 0) return null;
        
        const color = defaultColors[idx % defaultColors.length];
        
        return {
          sampleRef,
          geologicalUnit,
          legendLabel,
          color,
          testPoints
        };
      })
      .filter(Boolean); // Remove null entries
  }, [data]);

  useEffect(() => {
    if (!plotRef.current || plotData.length === 0) return;

    // Create Plotly traces
    const traces = plotData.map(series => {
      const x = series.testPoints.map(p => p.water_content);
      const y = series.testPoints.map(p => p.dry_density);
      const marker_symbols = series.testPoints.map(p => p.is_optimum ? "diamond" : "circle");
      const marker_sizes = series.testPoints.map(p => p.is_optimum ? 12 : 8);
      
      return {
        x,
        y,
        mode: "lines+markers",
        name: series.legendLabel,
        line: {
          color: series.color,
          shape: "spline",
          smoothing: 0.5
        },
        marker: {
          color: series.color,
          size: marker_sizes,
          symbol: marker_symbols,
          line: {
            width: 2,
            color: series.color
          }
        }
      };
    });

    // Layout configuration
    const layout = {
      title: {
        text: "Moisture Content vs Dry Density (MDD Data)",
        font: { size: 18, weight: 'bold' }
      },
      xaxis: {
        title: {
          text: "Moisture Content (%)",
          font: { size: 14 }
        },
        showgrid: true,
        gridcolor: "lightgrey"
      },
      yaxis: {
        title: {
          text: "Dry Density (t/m³)",
          font: { size: 14 }
        },
        showgrid: true,
        gridcolor: "lightgrey"
      },
      legend: {
        title: {
          text: "Sample (Geological Unit)",
          font: { size: 12 }
        },
        x: 1.02,
        y: 1,
        xanchor: 'left',
        yanchor: 'top',
        traceorder: "normal"
      },
      margin: { l: 80, r: 250, t: 80, b: 80 }, // Extra space for the legend
      autosize: true
    };

    // Render the plot
    Plotly.newPlot(plotRef.current, traces, layout, {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'moisture_vs_dry_density',
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
  }, [plotData]);

  // If no data is available
  if (plotData.length === 0) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <p className="text-gray-500">No valid data available for plotting Moisture Content vs Dry Density.</p>
      </div>
    );
  }

  return <div ref={plotRef} style={{ width: '100%', height: '600px' }} />;
};
