import React from 'react';
import Plot from 'react-plotly.js';
import { Card } from '@common/Card/Card';
import { FundingSplitData } from '@api/projectcontrols/programme';

interface FundingSplitCardProps {
  data: FundingSplitData;
}

// Custom colors for the pie charts
const colors = [
  '#4C7389', // Blue
  '#6CC24A', // Green
  '#FFD700', // Gold
  '#E63946'  // Red
];

export function FundingSplitCard({ data }: FundingSplitCardProps) {
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
  const getChartData = (data: typeof data.currentMonth) => ({
    values: data.map(d => d.value),
    labels: data.map(d => d.name === 'McConnell Dowell' ? 'McD' : d.name),
    type: 'pie' as const,
    hole: 0.4,
    marker: { colors },
    textinfo: 'text+percent',
    textposition: 'inside',
    textfont: { 
      color: '#FFFFFF',
      size: 11
    },
    text: data.map(d => d.name === 'McConnell Dowell' ? 'McD' : d.name),
    hovertemplate: '%{customdata}: %{value}%<extra></extra>',
    customdata: data.map(d => d.name),
    name: '',
    showlegend: true,
    legendgroup: 'companies',
    legendtext: data.map(d => `${d.name}: ${d.value}%`),
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
            data={[getChartData(data.currentMonth)]}
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
            data={[getChartData(data.projectSplit)]}
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