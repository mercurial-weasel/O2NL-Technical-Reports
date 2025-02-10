import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { O2NL_Staff } from '../../../../../api/staff-fte/types';
import { MonthColumn } from '../../StaffFTE/types';
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

  // Prepare data for the selected view
  const traces = useMemo(() => {
    let items: { name: string; values: { [key: string]: number } }[];
    let colors: { [key: string]: string };
    let xLabels: string[];

    // Get x-axis labels based on mode
    if (mode === 'fte' && monthColumns) {
      xLabels = monthColumns.map(m => m.label);
    } else {
      xLabels = summaries.dateRange.months.map(m => {
        const date = new Date(m);
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().slice(2)}`;
      });
    }

    // Get data based on view and mode
    switch (chartView) {
      case 'organization':
        items = mode === 'fte' 
          ? summaries.orgSummaries.map(({ org, totals }) => ({ name: org, values: totals }))
          : summaries.orgSummaries.map(({ org, userCounts }) => ({ name: org, values: userCounts }));
        colors = colorPalettes.organization;
        break;
      case 'discipline':
        items = mode === 'fte'
          ? summaries.disciplineSummaries.map(({ discipline, totals }) => ({ name: discipline, values: totals }))
          : summaries.disciplineSummaries.map(({ discipline, userCounts }) => ({ name: discipline, values: userCounts }));
        colors = colorPalettes.discipline;
        break;
      case 'nop':
        items = mode === 'fte'
          ? summaries.nopTypeSummaries.map(({ nopType, totals }) => ({ name: nopType, values: totals }))
          : summaries.nopTypeSummaries.map(({ nopType, userCounts }) => ({ name: nopType, values: userCounts }));
        colors = colorPalettes.nop;
        break;
    }

    return items.map(({ name, values }) => ({
      type: 'bar' as const,
      name,
      x: xLabels,
      y: mode === 'fte' && monthColumns
        ? monthColumns.map(m => values[m.key])
        : summaries.dateRange.months.map(m => values[m]),
      marker: {
        color: colors[name] || '#95A5A6' // Default gray if no color defined
      },
      hovertemplate: `
        <b>${name}</b><br>
        Month: %{x}<br>
        ${mode === 'fte' ? 'FTE: %{y:.2f}' : 'Staff Count: %{y}'}<br>
        <extra></extra>
      `
    }));
  }, [summaries, monthColumns, chartView, mode]);

  // Add total line trace
  const linePlot = {
    type: 'scatter' as const,
    name: mode === 'fte' ? 'Total FTE' : 'Total Staff',
    x: mode === 'fte' && monthColumns
      ? monthColumns.map(m => m.label)
      : summaries.dateRange.months.map(m => {
          const date = new Date(m);
          return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().slice(2)}`;
        }),
    y: mode === 'fte' && monthColumns
      ? monthColumns.map(m => summaries.grandTotal[m.key])
      : summaries.dateRange.months.map(m => summaries.totalUsers[m]),
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
      <b>${mode === 'fte' ? 'Total FTE' : 'Total Staff'}</b><br>
      Month: %{x}<br>
      ${mode === 'fte' ? 'FTE: %{y:.2f}' : 'Staff Count: %{y}'}<br>
      <extra></extra>
    `
  };

  return (
    <div>
      {/* View Toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center bg-gray-700/50 rounded-lg p-0.5">
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
        data={[...traces, linePlot]}
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