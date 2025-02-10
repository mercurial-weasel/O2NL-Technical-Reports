import React from 'react';
import Plot from 'react-plotly.js';
import { EmissionSourceType } from '../../../../../api/emissions/types';
import { MonthlyEmissions } from '../../../../../api/emissions/transformations';

interface EmissionsChartProps {
  data: MonthlyEmissions[];
}

// Professional color palette for emission sources
const sourceColors: Record<EmissionSourceType, string> = {
  'Materials': '#4C7389',      // Rich Blue
  'Transport': '#6CC24A',      // Vibrant Green
  'Equipment': '#3EB1C8',      // Bright Cyan
  'Site Operations': '#F5A623', // Warm Orange
  'Waste': '#E63946',          // Bold Red
  'Energy': '#9B59B6',         // Rich Purple
  'Other': '#95A5A6'           // Gray
};

export function EmissionsChart({ data }: EmissionsChartProps) {
  // Create traces for each emission source
  const traces = Object.keys(sourceColors).map(source => ({
    type: 'bar' as const,
    name: source,
    x: data.map(d => d.month),
    y: data.map(d => d.emissions[source as EmissionSourceType] || 0),
    marker: {
      color: sourceColors[source as EmissionSourceType]
    },
    hovertemplate: `
      <b>${source}</b><br>
      Month: %{x}<br>
      Emissions: %{y:.2f} tCO2e<br>
      <extra></extra>
    `
  }));

  return (
    <Plot
      data={traces}
      layout={{
        title: {
          text: 'Monthly Carbon Emissions by Source',
          font: { color: '#FFFFFF', size: 16 }
        },
        barmode: 'stack',
        height: 600,
        margin: { l: 60, r: 180, t: 60, b: 80 },
        showlegend: true,
        legend: {
          x: 1.02,
          y: 1,
          xanchor: 'left',
          yanchor: 'top',
          font: { color: '#FFFFFF', size: 12 },
          bgcolor: 'rgba(0,0,0,0)',
          bordercolor: 'rgba(255,255,255,0.2)',
          borderwidth: 1
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
          title: {
            text: 'Month',
            font: { color: '#FFFFFF' }
          },
          tickangle: -45,
          tickfont: { color: '#FFFFFF', size: 10 },
          gridcolor: '#333333',
          showgrid: true
        },
        yaxis: {
          title: {
            text: 'Carbon Emissions (tCO2e)',
            font: { color: '#FFFFFF' }
          },
          tickfont: { color: '#FFFFFF' },
          gridcolor: '#333333',
          showgrid: true,
          zeroline: true,
          zerolinecolor: '#666666'
        },
        hoverlabel: {
          bgcolor: '#1F2937',
          bordercolor: '#374151',
          font: { color: '#FFFFFF' }
        }
      }}
      config={{
        displayModeBar: true,
        responsive: true,
        displaylogo: false,
        modeBarButtonsToRemove: [
          'select2d',
          'lasso2d',
          'autoScale2d',
          'hoverClosestCartesian',
          'hoverCompareCartesian'
        ]
      }}
      style={{ width: '100%' }}
    />
  );
}