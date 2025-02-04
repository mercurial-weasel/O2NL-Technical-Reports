import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { O2NL_Staff } from '../../../../../api/staff-fte/types';
import { MonthColumn } from '../../../ProjectControls/StaffFTE/types';
import { calculateNumberUsersSummaries, getActiveUsersForMonth } from '../../../../../api/staff-fte/transformations';

interface StaffNumbersChartProps {
  data: O2NL_Staff[];
  monthColumns: MonthColumn[];
}

// Professional color palette for organizations
const orgColors = {
  'T&T': '#4C7389',        // Rich Blue
  'Beca': '#6CC24A',       // Vibrant Green
  'MCD/Downer': '#3EB1C8', // Bright Cyan
  'Downer': '#3EB1C8',     // Bright Cyan
  'MCD': '#F5A623',        // Warm Orange
  'DNZ': '#E63946',        // Bold Red
  'Other': '#9B59B6'       // Rich Purple
};

export function StaffNumbersChart({ data, monthColumns }: StaffNumbersChartProps) {
  // Get summaries from transformation layer
  const summaries = useMemo(() => 
    calculateNumberUsersSummaries(data), 
    [data]
  );

  // Prepare data for stacked bar chart
  const traces = useMemo(() => {
    const stackedTraces = summaries.orgSummaries.map(({ org, userCounts }) => {
      // Get staff names for each month by organization
      const monthlyStaffNames = summaries.dateRange.months.map(month => {
        const activeUsers = getActiveUsersForMonth(data, month);
        const orgUsers = activeUsers.filter(user => user.Org === org);
        return orgUsers.map(user => user.Name).sort();
      });

      return {
        type: 'bar' as const,
        name: org,
        x: summaries.dateRange.months.map(m => {
          const date = new Date(m);
          return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().slice(2)}`;
        }),
        y: summaries.dateRange.months.map(m => userCounts[m]),
        marker: {
          color: orgColors[org as keyof typeof orgColors] || '#95A5A6'
        },
        hovertemplate: summaries.dateRange.months.map((_, index) => `
          <b>${org}</b><br>
          Month: %{x}<br>
          Staff Count: %{y}<br>
          <br>Staff Members:<br>
          ${monthlyStaffNames[index].join('<br>')}<br>
          <extra></extra>
        `),
        hoverlabel: {
          align: 'left'
        }
      };
    });

    // Add total line trace
    const linePlot = {
      type: 'scatter' as const,
      name: 'Total Staff',
      x: summaries.dateRange.months.map(m => {
        const date = new Date(m);
        return `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear().toString().slice(2)}`;
      }),
      y: summaries.dateRange.months.map(m => summaries.totalUsers[m]),
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
      hovertemplate: summaries.dateRange.months.map((month, index) => {
        const activeUsers = getActiveUsersForMonth(data, month);
        const staffNames = activeUsers.map(user => user.Name).sort();
        return `
          <b>Total Staff</b><br>
          Month: %{x}<br>
          Total Count: %{y}<br>
          <br>All Staff Members:<br>
          ${staffNames.join('<br>')}<br>
          <extra></extra>
        `;
      }),
      hoverlabel: {
        align: 'left'
      }
    };

    return [...stackedTraces, linePlot];
  }, [summaries, data]);

  return (
    <Plot
      data={traces}
      layout={{
        title: {
          text: 'Monthly Staff Numbers by Organization',
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
            text: 'Staff Count',
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
          align: 'left'
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