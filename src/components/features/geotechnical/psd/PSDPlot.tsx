import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';
import { ParticleSizeDistributionTest, SieveItem } from '@api/geotechnical/psd';

interface PlotData {
  sample_id: string;
  sample_reference: string;
  point_id: string;
  depth_to: number;
  test_date: string;
  material: string;
  particle_size_result: SieveItem[];
}

interface PSDPlotProps {
  data: PlotData[];
  height?: string;
}

export const PSDPlot: React.FC<PSDPlotProps> = ({ data, height = '500px' }) => {
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plotRef.current || !data || data.length === 0) return;

    // Create figure data array
    let traces = [];

    // Add particle size distribution curves
    data.forEach((sample) => {
      const sampleId = sample.sample_reference;
      const sieveSizes = sample.particle_size_result.map((entry) => entry.sieve_size_mm);
      const percentPassing = sample.particle_size_result.map((entry) => entry.percent_passing);

      traces.push({
        x: sieveSizes,
        y: percentPassing,
        mode: "lines+markers",
        name: sampleId,
        marker: { size: 6 },
        line: { width: 1 },
      });
    });

    // Classification lines
    const classificationLines = [
      [0.001, 0, 100, 0],
      [0.001, -20, 100, -20],
      [0.002, 0, 0.002, -20],
      [0.06, 0, 0.06, -20],
      [0.2, 0, 0.2, -10],
      [0.6, 0, 0.6, -10],
      [2, 0, 2, -20],
      [0.06, -10, 60, -10],
      [6, 0, 6, -10],
      [20, 0, 20, -10],
      [60, 0, 60, -20]
    ];

    classificationLines.forEach(([x1, y1, x2, y2]) => {
      traces.push({
        x: [x1, x2],
        y: [y1, y2],
        mode: "lines",
        line: { color: "black", width: 1 },
        showlegend: false,
      });
    });

    // Classification labels
    const classificationText = [
      [0.0015, -10, "Clay"],
      [0.01, -10, "Silt"],
      [0.4, -15, "Sand"],
      [11, -15, "Gravel"],
      [90, -10, "Cobbles"],
      [0.115, -5, "fine"],
      [0.35, -5, "medium"],
      [1.1, -5, "coarse"],
      [3.4, -5, "fine"],
      [11, -5, "medium"],
      [35, -5, "coarse"]
    ];

    const annotations = classificationText.map(([x, y, text]) => ({
      x: Math.log10(x as number),
      y: y,
      text: text,
      showarrow: false,
      font: { size: 12, color: "black", family: "Arial", weight: "bold" },
      align: "center",
      xanchor: "center",
      yanchor: "middle",
      bgcolor: "white",
      xref: "x",
      yref: "y",
    }));

    // Layout settings
    const layout = {
      title: {
        text: "Particle Size Distribution",
        font: { size: 18, weight: 'bold' },
        y: 0.95, // Position slightly lower
      },
      xaxis: {
        title: {
          text: "Particle Size (mm) - Log scale",
          font: { size: 14 },
          standoff: 15, // Extra space for axis title
        },
        type: "log",
        showgrid: true,
        gridcolor: "lightgrey",
        tickmode: "array",
        tickvals: [0.001, 0.01, 0.1, 1, 10, 100],
      },
      yaxis: {
        title: {
          text: "Percentage passing (%)",
          font: { size: 14 },
          standoff: 15, // Extra space for axis title
        },
        range: [-5, 105],
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
      margin: { l: 80, r: 250, t: 80, b: 80 }, // Increased margins further
      annotations: annotations,
      autosize: true,
    };

    // Render the plot with improved config
    Plotly.newPlot(plotRef.current, traces, layout, {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'particle_size_distribution',
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
