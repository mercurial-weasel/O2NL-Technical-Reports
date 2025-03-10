import React from 'react';
import Plot from 'react-plotly.js';
import { WindRoseData, calculateWindRoseData } from '@api/sensors/dust/transformations';

interface WindRoseProps {
  data: WindRoseData;
}

export function WindRose({ data }: WindRoseProps) {
  // Create traces for each speed range
  const traces = data.speedRanges.map((range, i) => ({
    name: `${range} m/s`,
    type: 'scatterpolar' as const,
    r: data.bins.map(bin => 
      bin.speedRanges[i].percentage
    ),
    theta: data.bins.map(bin => bin.direction),
    fill: 'toself' as const,
    hovertemplate: `
      Direction: %{theta}<br>
      Speed: ${range} m/s<br>
      Percentage: %{r:.1f}%<br>
      <extra></extra>
    `
  }));

  return (
    <Plot
      data={traces}
      layout={{
        title: {
          text: 'Wind Rose',
          font: { color: '#FFFFFF', size: 16 }
        },
        showlegend: true,
        legend: {
          font: { color: '#FFFFFF' },
          bgcolor: 'rgba(0,0,0,0)',
          bordercolor: 'rgba(255,255,255,0.2)',
          borderwidth: 1
        },
        polar: {
          radialaxis: {
            visible: true,
            range: [0, data.maxPercentage * 1.1],
            tickfont: { color: '#FFFFFF' },
            gridcolor: '#333333',
            ticksuffix: '%'
          },
          angularaxis: {
            direction: 'clockwise',
            tickfont: { color: '#FFFFFF' },
            gridcolor: '#333333'
          },
          bgcolor: 'rgba(0,0,0,0)'
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 50, b: 30, l: 30, r: 30 },
        font: { color: '#FFFFFF' }
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
      style={{ width: '100%', height: '100%' }}
    />
  );
}