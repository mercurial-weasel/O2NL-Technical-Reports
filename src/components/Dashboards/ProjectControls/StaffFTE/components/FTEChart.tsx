import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { O2NL_Staff } from '../../../../../api/staff-fte/types';
import { MonthColumn } from '../types';
import { calculateFTESummaries } from '../../../../../api/staff-fte/transformations';

interface FTEChartProps {
  data: O2NL_Staff[];
  monthColumns: MonthColumn[];
}

// Professional color palette for organizations with more vibrant colors
const orgColors = {
  'T&T': '#4C7389',        // Rich Blue
  'Beca': '#6CC24A',       // Vibrant Green
  'MCD/Downer': '#3EB1C8', // Bright Cyan
  'Downer': '#3EB1C8',     // Bright Cyan
  'MCD': '#F5A623',        // Warm Orange
  'DNZ': '#E63946',        // Bold Red
  'Other': '#9B59B6'       // Rich Purple
};

export function FTEChart({ data, monthColumns }: FTEChartProps) {
  // Get summaries from transformation layer
  const summaries = useMemo(() => 
    calculateFTESummaries(data, monthColumns), 
    [data, monthColumns]
  );

  // Prepare data for stacked bar chart
  const traces = useMemo(() => {
    const stackedTraces = summaries.orgSummaries.map(({ org, totals }) => ({
      type: 'bar' as const,
      name: org,
      x: monthColumns.map(m => m.label),
      y: monthColumns.map(m => totals[m.key]),
      marker: {
        color: orgColors[org as keyof typeof orgColors] || '#95A5A6'
      },
      hovertemplate: `
        <b>${org}</b><br>
        Month: %{x}<br>
        FTE: %{y:.2f}<br>
        <extra></extra>
      `
    }));

    // Add total line trace
    const linePlot = {
      type: 'scatter' as const,
      name: 'Total FTE',
      x: monthColumns.map(m => m.label),
      y: monthColumns.map(m => summaries.grandTotal[m.key]),
      mode: 'lines+markers' as const,
      line: {
        color: '#E74C3C',
        width: 2,
        dash: 'solid'
      },
      marker: {
        size: 6,
        color: '#E74C3C'
      },
      hovertemplate: `
        <b>Total FTE</b><br>
        Month: %{x}<br>
        FTE: %{y:.2f}<br>
        <extra></extra>
      `
    };

    return [...stackedTraces, linePlot];
  }, [summaries, monthColumns]);

  return (
    <Plot
      data={traces}
      layout={{
        title: {
          text: 'Monthly FTE by Organization',
          font: { color: '#FFFFFF', size: 16 }
        },
        barmode: 'stack',
        height: 600,
        margin: { l: 60, r: 180, t: 60, b: 80 }, // Increased right margin for legend
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
            text: 'Full Time Equivalent (FTE)',
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