import React from 'react';
import Plot from 'react-plotly.js';
import { Card } from '../../../common/Card';
import { currentMonthData, projectSplitData, colors } from './data/fundingSplitData';

export function FundingSplitCard() {
  const commonLayout = {
    showlegend: true,
    legend: {
      orientation: 'h',
      y: -0.2,
      font: { color: '#FFFFFF' },
      bgcolor: 'rgba(0,0,0,0)',
      xanchor: 'center',
      x: 0.5
    },
    margin: { t: 30, b: 40, l: 20, r: 20 },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    height: 300,
    width: 300,
    modebar: {
      bgcolor: 'rgba(0,0,0,0)',
      color: '#FFFFFF',
      activecolor: '#4C7389'
    }
  };

  const commonConfig = {
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
  };

  // Function to get chart data with abbreviated names in chart and full names with values in legend
  const getChartData = (data: typeof currentMonthData) => ({
    values: data.map(d => d.value),
    labels: data.map(d => d.name === 'McConnell Dowell' ? 'McD' : d.name),
    type: 'pie' as const,
    hole: 0.4,
    marker: { colors },
    // Show both label and percentage in the pie slices
    textinfo: 'text+percent',
    textposition: 'inside',
    textfont: { 
      color: '#FFFFFF',
      size: 11
    },
    // Custom text for pie slices (abbreviated name)
    text: data.map(d => d.name === 'McConnell Dowell' ? 'McD' : d.name),
    hovertemplate: '%{customdata}: %{value}%<extra></extra>',
    customdata: data.map(d => d.name), // Store full names for hover
    name: '',
    showlegend: true,
    legendgroup: 'companies',
    // Custom legend text with full names and values
    legendtext: data.map(d => `${d.name}: ${d.value}%`),
    // Custom legend formatting
    legendgrouptitle: {
      font: { color: '#FFFFFF' }
    }
  });

  return (
    <Card className="p-4" hover glow>
      <div className="w-full bg-purple-900 text-text-primary text-center py-1 px-3 mb-4 rounded-lg font-semibold text-base">
        FUNDING SPLIT
      </div>
      
      <div className="flex justify-between items-start gap-4">
        {/* Current Month Split */}
        <div className="w-1/2">
          <h3 className="text-sm font-medium text-text-primary text-center mb-2">
            Current Month Split
          </h3>
          <Plot
            data={[getChartData(currentMonthData)]}
            layout={{
              ...commonLayout,
              title: {
                text: '',
                font: { color: '#FFFFFF', size: 14 }
              }
            }}
            config={commonConfig}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>

        {/* Project Split */}
        <div className="w-1/2">
          <h3 className="text-sm font-medium text-text-primary text-center mb-2">
            Project Split
          </h3>
          <Plot
            data={[getChartData(projectSplitData)]}
            layout={{
              ...commonLayout,
              title: {
                text: '',
                font: { color: '#FFFFFF', size: 14 }
              }
            }}
            config={commonConfig}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
      </div>
    </Card>
  );
}