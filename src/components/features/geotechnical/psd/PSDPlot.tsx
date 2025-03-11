import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist';

interface ParticleSizeResult {
  sieve_size_mm: number;
  percent_passing: number;
}

export interface ParticleSizeDistributionTest {
  sample_id: string;
  sample_reference: string;
  point_id: string;
  depth_from: number;
  depth_to: number;
  test_date: string;
  material: string;
  particle_size_result: ParticleSizeResult[];
}

interface PSDPlotProps {
  data: ParticleSizeDistributionTest[];
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
      [0.001, 0, 100, 0], // horizontal top boundary at y=0
      [0.001, -5, 100, -5], // horizontal bottom boundary at y=-5
      [0.002, 0, 0.002, -5], // Clay/Silt boundary (vertical)
      [0.06, 0, 0.06, -5], // Silt/Sand boundary (vertical)
      [0.2, 0, 0.2, -2.5],
      [0.6, 0, 0.6, -2.5],
      [2, 0, 2, -5],
      [0.06, -2.5, 60, -2.5],
      [6, 0, 6, -2.5],
      [20, 0, 20, -2.5],
      [60, 0, 60, -5],
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

    // Corrected classification labels
    const classificationText = [
      [0.0015, -2.5, "Clay"],
      [0.01, -2.5, "Silt"],
      [0.4, -3.75, "Sand"],
      [11, -3.75, "Gravel"],
      [90, -2.5, "Cobbles"],
      [0.115, -1.25, "fine"],
      [0.35, -1.25, "medium"],
      [1.1, -1.25, "coarse"],
      [3.4, -1.25, "fine"],
      [11, -1.25, "medium"],
      [35, -1.25, "coarse"],
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
      title: "Particle Size Distribution",
      xaxis: {
        title: "Particle Size (mm) - Log Scale",
        type: "log",
        showgrid: true,
        gridcolor: "lightgrey",
        tickmode: "array",
        tickvals: [0.001, 0.01, 0.1, 1, 10, 100],
      },
      yaxis: {
        title: "Percent Passing (%)",
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
      margin: { l: 50, r: 250, t: 50, b: 50 },
      annotations: annotations,
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
