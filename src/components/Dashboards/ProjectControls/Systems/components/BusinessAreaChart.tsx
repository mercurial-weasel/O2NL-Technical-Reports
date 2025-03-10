import React from 'react';
import Plot from 'react-plotly.js';
import { PivotCategory } from '@api/systems/transformations';

// Fixed colors for each adoption level
const adoptionColors: Record<string, string> = {
  '1 - poor': '#FF0000',           // Bright red
  '2 - average': '#FFD700',        // Yellow
  '3 - good': '#FFA500',           // Orange
  '4 - very good': '#90EE90',      // Light green
  '5 - comprehensive': '#00FF00',   // Bright green
  '7 - Unknown': '#808080',        // Grey
  '8 - Not commenced': '#FFC0CB',  // Pink
  '9 - N/A': '#D3D3D3'            // Light grey
};

interface BusinessAreaChartProps {
  category: PivotCategory;
  adoptionLevels: readonly string[];
}

export function BusinessAreaChart({ category, adoptionLevels }: BusinessAreaChartProps) {
  // Sort items in reverse alphabetical order
  const sortedItems = [...category.items].sort((a, b) => b.name.localeCompare(a.name));

  // Get systems for each category and adoption level
  const systemsByCategoryAndLevel = sortedItems.reduce((acc, subcategory) => {
    if (!acc[subcategory.name]) {
      acc[subcategory.name] = {};
    }
    subcategory.subcategoryItems?.forEach(system => {
      const adoptionLevel = adoptionLevels[system.values.findIndex(v => v === 1)];
      if (!acc[subcategory.name][adoptionLevel]) {
        acc[subcategory.name][adoptionLevel] = [];
      }
      acc[subcategory.name][adoptionLevel].push(system.name);
    });
    return acc;
  }, {} as Record<string, Record<string, string[]>>);

  // Create y-axis labels with sorted categories
  const yLabels = sortedItems.map(item => item.name);
  const yFonts = yLabels.map(() => ({ size: 11, color: '#ABABAB' }));

  // Calculate dynamic height based on number of rows
  const rowHeight = 50;
  const minHeight = 300;
  const calculatedHeight = Math.max(minHeight, yLabels.length * rowHeight);

  // Create traces for each adoption level
  const traces = adoptionLevels.map(level => {
    const x: number[] = [];
    const y: string[] = [];
    const hovertext: string[] = [];
    const text: string[] = [];

    yLabels.forEach(subcategory => {
      const systems = systemsByCategoryAndLevel[subcategory]?.[level] || [];
      const count = systems.length;
      
      x.push(count);
      y.push(subcategory);
      text.push(count > 0 ? count.toString() : '');
      hovertext.push(systems.join('<br>'));
    });

    return {
      name: level,
      type: 'bar' as const,
      orientation: 'h' as const,
      y,
      x,
      text,
      textposition: 'outside' as const,
      hoverinfo: 'text' as const,
      hovertext,
      customdata: y.map(label => ({ label, level })),
      marker: {
        color: adoptionColors[level] || '#808080'
      },
      showlegend: true,
      hovertemplate: '%{hovertext}<extra></extra>',
      width: 0.6
    };
  });

  return (
    <div className="mb-8 last:mb-0">
      <h3 className="text-lg font-semibold text-text-primary mb-4">{category.category}</h3>
      <Plot
        data={traces}
        layout={{
          barmode: 'stack',
          height: calculatedHeight,
          margin: { l: 250, r: 150, t: 10, b: 50 },
          showlegend: true,
          legend: {
            orientation: 'v',
            y: 1,
            x: 1.05,
            xanchor: 'left',
            yanchor: 'top',
            font: { color: '#FFFFFF' },
            bgcolor: 'rgba(0,0,0,0)'
          },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: '#FFFFFF' },
          xaxis: {
            title: {
              text: 'Number of Systems',
              font: { color: '#FFFFFF', size: 12 },
              standoff: 20
            },
            gridcolor: '#333333',
            zerolinecolor: '#333333',
            tickfont: { color: '#FFFFFF', size: 10 },
            showticklabels: true,
            tickmode: 'linear',
            dtick: 1,
            tickangle: 0
          },
          yaxis: {
            title: '',
            gridcolor: '#333333',
            zerolinecolor: '#333333',
            ticktext: yLabels,
            tickvals: yLabels.map((_, i) => i),
            tickmode: 'array' as const,
            tickfont: yFonts as any
          },
          hoverlabel: {
            bgcolor: '#1F2937',
            bordercolor: '#374151',
            font: { 
              color: '#FFFFFF',
              size: 14
            },
            align: 'left',
            width: 400
          },
          bargap: 0.3,
          bargroupgap: 0.02
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
    </div>
  );
}