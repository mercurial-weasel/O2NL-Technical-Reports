import React, { useMemo } from 'react';
import Plot from 'react-plotly.js';
import { O2NL_Staff } from '../../../../../api/staff-fte/types';
import { MonthColumn } from '../../../ProjectControls/StaffFTE/types';

interface StaffMovementChartProps {
  data: O2NL_Staff[];
  monthColumns: MonthColumn[];
}

interface MonthlyMovement {
  month: string;
  newStarters: string[];
  leavers: string[];
}

export function StaffMovementChart({ data, monthColumns }: StaffMovementChartProps) {
  // Calculate monthly staff movement
  const monthlyMovement = useMemo(() => {
    const movements: MonthlyMovement[] = [];
    
    // Process each month
    monthColumns.forEach(({ key }) => {
      const [month, year] = key.split('_');
      const currentDate = new Date(`${month} 1, 20${year}`);
      
      // Find starters and leavers for this month
      const newStarters = data.filter(staff => {
        const startDate = new Date(staff.RequiredStart);
        return startDate.getMonth() === currentDate.getMonth() && 
               startDate.getFullYear() === currentDate.getFullYear();
      }).map(staff => staff.Name);

      const leavers = data.filter(staff => {
        const endDate = new Date(staff.RequiredFinish);
        return endDate.getMonth() === currentDate.getMonth() && 
               endDate.getFullYear() === currentDate.getFullYear();
      }).map(staff => staff.Name);

      movements.push({
        month: key,
        newStarters,
        leavers
      });
    });

    return movements;
  }, [data, monthColumns]);

  // Create traces for the stacked bar chart
  const traces = [
    // New Starters (positive values)
    {
      name: 'New Starters',
      type: 'bar' as const,
      x: monthColumns.map(m => m.label),
      y: monthlyMovement.map(m => m.newStarters.length),
      marker: {
        color: '#10B981' // Green for new starters
      },
      hovertemplate: monthlyMovement.map(m => `
        <b>New Starters</b><br>
        Month: %{x}<br>
        Count: ${m.newStarters.length}<br>
        ${m.newStarters.length > 0 ? '<br>Staff:<br>' + m.newStarters.join('<br>') : ''}
        <extra></extra>
      `),
      hoverlabel: {
        align: 'left'
      }
    },
    // Leavers (negative values)
    {
      name: 'Leavers',
      type: 'bar' as const,
      x: monthColumns.map(m => m.label),
      y: monthlyMovement.map(m => -m.leavers.length), // Negative values for leavers
      marker: {
        color: '#EF4444' // Red for leavers
      },
      hovertemplate: monthlyMovement.map(m => `
        <b>Leavers</b><br>
        Month: %{x}<br>
        Count: ${m.leavers.length}<br>
        ${m.leavers.length > 0 ? '<br>Staff:<br>' + m.leavers.join('<br>') : ''}
        <extra></extra>
      `),
      hoverlabel: {
        align: 'left'
      }
    }
  ];

  return (
    <Plot
      data={traces}
      layout={{
        title: {
          text: 'Staff Movement by Month',
          font: { color: '#FFFFFF', size: 16 }
        },
        barmode: 'relative',
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