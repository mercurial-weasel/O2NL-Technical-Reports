import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { O2NL_Staff } from '@api/projectcontrols/peopleculture';
import { MonthColumn } from '@features_ProjectControls/Staff';
import { calculateFTESummaries, calculateStaffNumbers } from '@api/projectcontrols/peopleculture';
import { colorPalettes } from './colors';

interface StaffChartProps {
  data: O2NL_Staff[];
  monthColumns?: MonthColumn[];
  mode: 'fte' | 'numbers';
}

type ChartView = 'organization' | 'discipline' | 'nop';

export function StaffChart({ data, monthColumns, mode }: StaffChartProps) {
  const [chartView, setChartView] = useState<ChartView>('organization');

  // Calculate summaries based on mode
  const summaries = React.useMemo(() => {
    if (mode === 'fte' && monthColumns) {
      return calculateFTESummaries(data, monthColumns);
    } else {
      return calculateStaffNumbers(data);
    }
  }, [data, monthColumns, mode]);

  // Get x-axis labels and data based on mode
  const { xLabels, items } = React.useMemo(() => {
    if (mode === 'fte' && monthColumns) {
      const xLabels = monthColumns.map(m => m.label);
      const items = chartView === 'organization' 
        ? summaries.orgSummaries.map(s => ({ name: s.org, values: s.totals, staffMembers: s.staffMembers }))
        : chartView === 'discipline'
        ? summaries.disciplineSummaries.map(s => ({ name: s.discipline, values: s.totals, staffMembers: s.staffMembers }))
        : summaries.nopTypeSummaries.map(s => ({ name: s.nopType, values: s.totals, staffMembers: s.staffMembers }));
      return { xLabels, items };
    } else {
      const xLabels = summaries.months;
      const items = chartView === 'organization'
        ? summaries.organizations.map(s => ({ 
            name: s.name, 
            values: Object.fromEntries(summaries.months.map(m => [m, s.staffCounts[m].activeCount]))
          }))
        : chartView === 'discipline'
        ? summaries.disciplines.map(s => ({ 
            name: s.name, 
            values: Object.fromEntries(summaries.months.map(m => [m, s.staffCounts[m].activeCount]))
          }))
        : summaries.nopTypes.map(s => ({ 
            name: s.name, 
            values: Object.fromEntries(summaries.months.map(m => [m, s.staffCounts[m].activeCount]))
          }));
      return { xLabels, items };
    }
  }, [summaries, chartView, mode, monthColumns]);

  // Create traces for each category
  const traces = items.map(({ name, values, staffMembers }) => ({
    name,
    type: 'bar' as const,
    x: xLabels,
    y: mode === 'fte' && monthColumns
      ? monthColumns.map(m => values[m.key])
      : summaries.months.map(m => values[m]),
    marker: {
      color: colorPalettes[chartView][name as keyof typeof colorPalettes[typeof chartView]] || '#95A5A6'
    },
    hovertemplate: mode === 'fte'
      ? monthColumns.map(m => {
          const value = values[m.key] || 0;
          const staffList = staffMembers[m.key] || [];
          
          // Create a list of staff with names and roles
          const staffDisplay = staffList.length > 0 
            ? '<br><br>Staff:<br>' + staffList.map(s => `${s.name} (${s.projectRoleTitle}) - ${s.fte.toFixed(2)}`).join('<br>')
            : '';
            
          return `
            <b>${name}</b><br>
            Month: ${m.label}<br>
            FTE: ${value.toFixed(2)}${staffDisplay}
            <extra></extra>
          `;
        })
      : `${name}<br>Month: %{x}<br>Staff Count: %{y}<extra></extra>`,
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
            onClick={() => setChartView('organization')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              chartView === 'organization'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Organization
          </button>
          <button
            onClick={() => setChartView('discipline')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              chartView === 'discipline'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Discipline
          </button>
          <button
            onClick={() => setChartView('nop')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              chartView === 'nop'
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
            text: `${mode === 'fte' ? 'FTE' : 'Staff Numbers'} by ${chartView.charAt(0).toUpperCase() + chartView.slice(1)}`,
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
              text: mode === 'fte' ? 'Full Time Equivalent (FTE)' : 'Number of Staff',
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
    </div>
  );
}