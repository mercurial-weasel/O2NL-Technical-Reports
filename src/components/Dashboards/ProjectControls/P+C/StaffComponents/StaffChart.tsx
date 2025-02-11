import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { O2NL_Staff } from '../../../../../api/staff-fte/types';
import { MonthColumn } from '../../../StaffFTE/types';
import { calculateFTESummaries, calculateNumberUsersSummaries } from '../../../../../api/staff-fte/transformations';

interface StaffChartProps {
  data: O2NL_Staff[];
  monthColumns?: MonthColumn[];
  mode: 'fte' | 'numbers';
}

type ChartView = 'organization' | 'discipline' | 'nop';

// Professional color palettes for each view type
const colorPalettes = {
  organization: {
    'T&T': '#4C7389',        // Rich Blue
    'Beca': '#6CC24A',       // Vibrant Green
    'MCD/Downer': '#3EB1C8', // Bright Cyan
    'Downer': '#3EB1C8',     // Bright Cyan
    'MCD': '#F5A623',        // Warm Orange
    'DNZ': '#E63946',        // Bold Red
    'Other': '#9B59B6'       // Rich Purple
  },
  discipline: {
    'PSS': '#6A0DAD',      // Vivid Purple
    'POP': '#1F618D',      // Royal Blue
    'OS': '#229954',       // Emerald Green
    'LO': '#E67E22',       // Bright Orange
    'ENV': '#95A5A6',      // Medium Gray
    'ENG': '#D72638',      // Bold Red
    'DES': '#2ECC71',      // Fresh Green
    'CONST': '#FF5733',    // Bright Coral Red
    'COM': '#34495E',      // Deep Navy
    'AMT': '#F1C40F'       // Bright Yellow
  },
  nop: {
    'CNOP': '#3498DB',      // Blue
    'DNOP': '#E74C3C',      // Red
    'CNOP/DNOP': '#2ECC71'  // Green
  }
};

export function StaffChart({ data, monthColumns, mode }: StaffChartProps) {
  const [chartView, setChartView] = useState<ChartView>('organization');

  // Calculate summaries based on mode
  const summaries = useMemo(() => {
    if (mode === 'fte' && monthColumns) {
      return calculateFTESummaries(data, monthColumns);
    } else {
      return calculateNumberUsersSummaries(data);
    }
  }, [data, monthColumns, mode]);

  // Get x-axis labels and data based on mode
  const { xLabels, items } = useMemo(() => {
    if (mode === 'fte' && monthColumns) {
      const xLabels = monthColumns.map(m => m.label);
      const items = chartView === 'organization' 
        ? summaries.orgSummaries.map(s => ({ name: s.org, values: s.totals }))
        : chartView === 'discipline'
        ? summaries.disciplineSummaries.map(s => ({ name: s.discipline, values: s.totals }))
        : summaries.nopTypeSummaries.map(s => ({ name: s.nopType, values: s.totals }));
      return { xLabels, items };
    } else {
      const xLabels = summaries.dateRange.months.map(m => {
        const date = new Date(m);
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().slice(2)}`;
      });
      const items = chartView === 'organization'
        ? summaries.orgSummaries.map(s => ({ name: s.org, values: s.userCounts }))
        : chartView === 'discipline'
        ? summaries.disciplineSummaries.map(s => ({ name: s.discipline, values: s.userCounts }))
        : summaries.nopTypeSummaries.map(s => ({ name: s.nopType, values: s.userCounts }));
      return { xLabels, items };
    }
  }, [summaries, chartView, mode, monthColumns]);

  // Create traces for each category
  const traces = items.map(({ name, values }) => ({
    type: 'bar' as const,
    name,
    x: xLabels,
    y: mode === 'fte' && monthColumns
      ? monthColumns.map(m => values[m.key])
      : summaries.dateRange.months.map(m => values[m]),
    marker: {
      color: colorPalettes[chartView][name as keyof typeof colorPalettes[typeof chartView]] || '#95A5A6'
    },
    hovertemplate: `
      <b>${name}</b><br>
      Month: %{x}<br>
      ${mode === 'fte' ? 'FTE: %{y:.2f}' : 'Staff Count: %{y}'}<br>
      <extra></extra>
    `
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
            text: `Monthly ${mode === 'fte' ? 'FTE' : 'Staff Numbers'} by ${chartView.charAt(0).toUpperCase() + chartView.slice(1)}`,
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
              text: mode === 'fte' ? 'Full Time Equivalent (FTE)' : 'Staff Count',
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