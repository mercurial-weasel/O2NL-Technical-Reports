import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { StaffSummary } from '../../../../../../api/staff-fte/transformations-staff-numbers2';
import { colorPalettes } from '../../StaffComponents/colors';

interface StaffNumbers2ChartProps {
  data: StaffSummary;
}

type ViewMode = 'organization' | 'discipline' | 'nop';

export function StaffNumbers2Chart({ data }: StaffNumbers2ChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('organization');

  // Get the appropriate data array and color palette based on viewMode
  const categoryData = viewMode === 'organization' ? data.organizations :
                      viewMode === 'discipline' ? data.disciplines :
                      data.nopTypes;
  
  const palette = viewMode === 'organization' ? colorPalettes.organization :
                 viewMode === 'discipline' ? colorPalettes.discipline :
                 colorPalettes.nop;

  // Create traces for each category
  const traces = categoryData.map(category => ({
    name: category.name,
    type: 'bar' as const,
    x: data.months,
    y: data.months.map(month => category.staffCounts[month].activeCount),
    marker: {
      color: palette[category.name as keyof typeof palette] || '#95A5A6'
    },
    hovertemplate: data.months.map(month => {
      const staffData = category.staffCounts[month];
      return `
        <b>${category.name}</b><br>
        Month: ${month}<br>
        Active Staff: ${staffData.activeCount}<br>
        ${staffData.staffNames.length > 0 ? '<br>Staff:<br>' + staffData.staffNames.join('<br>') : ''}
        <extra></extra>
      `
    }),
    hoverlabel: {
      align: 'left' as const
    }
  }));

  return (
    <div>
      {/* View Toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center bg-gray-800/50 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('organization')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'organization'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Organization
          </button>
          <button
            onClick={() => setViewMode('discipline')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'discipline'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Discipline
          </button>
          <button
            onClick={() => setViewMode('nop')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'nop'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            NOP Type
          </button>
        </div>
      </div>

      <Plot
        data={traces}
        layout={{
          title: {
            text: `Staff Numbers by ${viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}`,
            font: { color: '#FFFFFF', size: 16 }
          },
          barmode: 'stack',
          height: 500,
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
              text: 'Number of Staff',
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
            font: { color: '#FFFFFF' },
            align: 'left' as const
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
    </div>
  );
}