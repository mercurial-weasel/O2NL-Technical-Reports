import React from 'react';
import Plot from 'react-plotly.js';
import { StaffMovement } from '@api/staff-fte/transformations';
import { O2NL_Staff } from '@api/staff-fte/types';
import { colorPalettes } from '@features_ProjectControls/Staff/colors';

interface StaffMovementChartProps {
  data: StaffMovement;
  groupBy: 'organization' | 'discipline' | 'nop';
}

// Function to darken a hex color
function darkenColor(hex: string, percent: number) {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Darken each component
  const darkR = Math.floor(r * (1 - percent / 100));
  const darkG = Math.floor(g * (1 - percent / 100));
  const darkB = Math.floor(b * (1 - percent / 100));
  
  // Convert back to hex
  return `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
}

export function StaffMovementChart({ data, groupBy }: StaffMovementChartProps) {
  // Get the appropriate data array and color palette based on groupBy
  const categoryData = groupBy === 'organization' ? data.organizations :
                      groupBy === 'discipline' ? data.disciplines :
                      data.nopTypes;
  
  const palette = groupBy === 'organization' ? colorPalettes.organization :
                 groupBy === 'discipline' ? colorPalettes.discipline :
                 colorPalettes.nop;

  // Helper function to format staff list
  const formatStaffList = (staffList: string[]) => {
    return staffList.map(name => name.trim() || 'Undefined').join('<br>');
  };

  // Create traces for each category
  const traces = categoryData.flatMap(category => {
    const baseColor = palette[category.name as keyof typeof palette] || '#95A5A6';
    const darkColor = darkenColor(baseColor, 30); // 30% darker for offboarding

    const onboardingTrace = {
      name: `${category.name} (Onboarding)`,
      type: 'bar' as const,
      x: data.months,
      y: data.months.map(month => category.movements[month]?.onboarding || 0),
      marker: {
        color: baseColor
      },
      hovertemplate: data.months.map(month => {
        const count = category.movements[month]?.onboarding || 0;
        const staffList = category.movements[month]?.onboardingStaff || [];
        return `
          <b>${category.name}</b><br>
          Month: ${month}<br>
          Onboarding: ${count}<br>
          ${count > 0 ? '<br>Staff:<br>' + formatStaffList(staffList) : ''}
          <extra></extra>
        `;
      }),
      hoverlabel: {
        align: 'left' as const
      }
    };

    const offboardingTrace = {
      name: `${category.name} (Offboarding)`,
      type: 'bar' as const,
      x: data.months,
      y: data.months.map(month => -1 * (category.movements[month]?.offboarding || 0)), // Negative values
      marker: {
        color: darkColor
      },
      hovertemplate: data.months.map(month => {
        const count = category.movements[month]?.offboarding || 0;
        const staffList = category.movements[month]?.offboardingStaff || [];
        return `
          <b>${category.name}</b><br>
          Month: ${month}<br>
          Offboarding: ${count}<br>
          ${count > 0 ? '<br>Staff:<br>' + formatStaffList(staffList) : ''}
          <extra></extra>
        `;
      }),
      hoverlabel: {
        align: 'left' as const
      }
    };

    return [onboardingTrace, offboardingTrace];
  });

  // Add net movement line
  const netMovementTrace = {
    name: 'Net Movement',
    type: 'scatter' as const,
    x: data.months,
    y: data.months.map(month => 
      (data.total[month].onboarding || 0) - (data.total[month].offboarding || 0)
    ),
    mode: 'lines+markers' as const,
    line: {
      color: '#2196F3',
      width: 2
    },
    marker: {
      size: 6,
      color: '#2196F3'
    },
    hovertemplate: data.months.map(month => {
      const onboarding = data.total[month].onboarding || 0;
      const offboarding = data.total[month].offboarding || 0;
      const net = onboarding - offboarding;
      const onboardingStaff = data.total[month].onboardingStaff || [];
      const offboardingStaff = data.total[month].offboardingStaff || [];
      
      return `
        <b>Net Movement</b><br>
        Month: ${month}<br>
        Net Change: ${net}<br>
        <br>Onboarding (${onboarding}):<br>${formatStaffList(onboardingStaff)}<br>
        <br>Offboarding (${offboarding}):<br>${formatStaffList(offboardingStaff)}
        <extra></extra>
      `;
    }),
    hoverlabel: {
      align: 'left' as const
    }
  };

  return (
    <Plot
      data={[...traces, netMovementTrace]}
      layout={{
        title: {
          text: `Staff Movement by ${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}`,
          font: { color: '#FFFFFF', size: 16 }
        },
        barmode: 'relative',
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
          namelength: -1
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