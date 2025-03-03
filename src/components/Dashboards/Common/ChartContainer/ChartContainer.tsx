import React from 'react';
import Plot from 'react-plotly.js';

interface ChartContainerProps {
  data: any[];
  layout: Partial<Plotly.Layout>;
  title?: string;
  height?: number;
}

export function ChartContainer({ data, layout, title, height = 600 }: ChartContainerProps) {
  const defaultLayout: Partial<Plotly.Layout> = {
    title: title ? {
      text: title,
      font: { color: '#FFFFFF', size: 16 }
    } : undefined,
    height,
    margin: { l: 60, r: 180, t: 60, b: 50 },
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
    font: { color: '#FFFFFF' },
    hoverlabel: {
      bgcolor: '#1F2937',
      bordercolor: '#374151',
      font: { color: '#FFFFFF' }
    }
  };

  return (
    <Plot
      data={data}
      layout={{
        ...defaultLayout,
        ...layout,
        title: title ? {
          text: title,
          font: { color: '#FFFFFF', size: 16 }
        } : layout.title
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