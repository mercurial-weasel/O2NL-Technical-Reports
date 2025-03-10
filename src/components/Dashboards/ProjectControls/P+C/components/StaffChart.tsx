import React, { useState, useMemo } from 'react';
import Plot from 'react-plotly.js';
import { organizationColors, disciplineColors } from '@data/colors';
import { StaffMember } from '@api/staff/types';

interface StaffChartProps {
  data: StaffMember[];
  selectedOrganization: string;
  selectedDiscipline: string;
}

export function StaffChart({ data, selectedOrganization, selectedDiscipline }: StaffChartProps) {
  const [viewMode, setViewMode] = useState<'organization' | 'discipline'>('organization');

  // Filter data based on selections
  const filteredData = data.filter(month => {
    if (selectedOrganization !== 'all') {
      if (!month.organization) return false;
    }
    if (selectedDiscipline !== 'all') {
      if (!month.discipline) return false;
    }
    return true;
  });

  // Get staff members for a specific month and category
  const getStaffForMonthAndCategory = (month: string, category: string, isOrganization: boolean) => {
    return data.filter(staff => {
      const startDate = new Date(staff.startDate);
      const endDate = new Date(staff.endDate);
      const monthDate = new Date(month + '-01');
      
      // Check if staff member is active in this month
      const isActive = startDate <= monthDate && endDate >= monthDate;
      
      // Check if staff member belongs to this category
      const matchesCategory = isOrganization ? 
        staff.organization === category :
        staff.discipline === category;
      
      return isActive && matchesCategory;
    });
  };

  // Get unique categories and prepare traces based on view mode
  const { categories, traces } = React.useMemo(() => {
    const isOrganization = viewMode === 'organization';
    const categories = Array.from(
      new Set(filteredData.map(d => 
        isOrganization ? d.organization : d.discipline
      ))
    ).sort();

    const traces = categories.map(category => {
      const monthlyData = filteredData.map(d => {
        const value = isOrganization ? 
          d.organization === category ? 1 : 0 : 
          d.discipline === category ? 1 : 0;
        
        // Get staff members for this month and category
        const staffMembers = getStaffForMonthAndCategory(d.startDate.slice(0, 7), category, isOrganization);
        
        // Create hover text with staff list
        const hoverText = staffMembers.length > 0 ?
          `${category} - ${value}<br><br>` +
          staffMembers.map(s => `${s.firstName} ${s.lastName}`).join('<br>') :
          `${category} - ${value}`;

        return {
          value,
          hoverText
        };
      });

      return {
        type: 'bar' as const,
        name: category,
        x: filteredData.map(d => d.startDate.slice(0, 7)),
        y: monthlyData.map(d => d.value),
        text: monthlyData.map(d => d.hoverText),
        textposition: 'none' as const,
        hoverinfo: 'text' as const,
        hovertemplate: '%{text}<extra></extra>',
        marker: {
          color: (isOrganization ? organizationColors : disciplineColors)[category] || '#95A5A6'
        }
      };
    });

    return { categories, traces };
  }, [filteredData, viewMode, data]);

  return (
    <div>
      {/* View Toggle */}
      <div className="flex justify-end mb-4">
        <div className="inline-flex items-center bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setViewMode('organization')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'organization'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            By Organization
          </button>
          <button
            onClick={() => setViewMode('discipline')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'discipline'
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            By Discipline
          </button>
        </div>
      </div>

      {/* Chart */}
      <Plot
        data={traces}
        layout={{
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
          font: { color: '#FFFFFF' },
          showlegend: true,
          legend: {
            bgcolor: 'rgba(0,0,0,0.5)',
            bordercolor: '#FFFFFF',
            borderwidth: 1,
            font: { color: '#FFFFFF' }
          },
          xaxis: {
            gridcolor: '#333333',
            tickfont: { color: '#FFFFFF' },
            tickangle: -45,
            title: { 
              text: 'Month',
              font: { color: '#FFFFFF' }
            }
          },
          yaxis: {
            gridcolor: '#333333',
            tickfont: { color: '#FFFFFF' },
            title: { 
              text: 'Number of Staff',
              font: { color: '#FFFFFF' }
            }
          },
          height: 400,
          margin: { l: 60, r: 30, t: 30, b: 80 },
          barmode: 'stack' as const,
          hovermode: 'closest' as const,
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
        useResizeHandler={true}
      />
    </div>
  );
}