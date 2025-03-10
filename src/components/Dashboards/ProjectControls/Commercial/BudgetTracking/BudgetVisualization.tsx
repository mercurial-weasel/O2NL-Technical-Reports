import React from 'react';
import Plot from 'react-plotly.js';
import { AMTBudgetItem } from '@api/cost/amt-budgets/types';

interface BudgetVisualizationProps {
  data: AMTBudgetItem[];
  mode: 'hours' | 'budget';
}

export function BudgetVisualization({ data, mode }: BudgetVisualizationProps) {
  // Sort data by actual difference value (not magnitude)
  const sortedData = [...data].sort((a, b) => {
    const aValue = mode === 'hours' ? a.HOURS_DIFF : a.TOTAL_DIFF;
    const bValue = mode === 'hours' ? b.HOURS_DIFF : b.TOTAL_DIFF;
    return aValue - bValue; // Sort from lowest to highest
  });

  // Prepare data for the chart
  const chartData = {
    workstreams: sortedData.map(item => item.WORKSTREAM),
    differences: mode === 'hours'
      ? sortedData.map(item => item.HOURS_DIFF)
      : sortedData.map(item => item.TOTAL_DIFF),
    colors: mode === 'hours'
      ? sortedData.map(item => item.HOURS_DIFF > 0 ? '#EF4444' : '#10B981')
      : sortedData.map(item => item.TOTAL_DIFF < 0 ? '#10B981' : '#EF4444')
  };

  const maxValue = Math.max(...chartData.differences.map(Math.abs));

  return (
    <Plot
      data={[
        {
          type: 'bar',
          x: chartData.differences,
          y: chartData.workstreams,
          orientation: 'h',
          marker: {
            color: chartData.colors
          },
          text: mode === 'hours'
            ? chartData.differences.map(val => val.toLocaleString())
            : chartData.differences.map(val => 
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(val)
              ),
          textposition: 'auto',
          hovertemplate: mode === 'hours'
            ? 'Difference: %{x:,.0f} hours<br>%{y}<extra></extra>'
            : 'Difference: %{text}<br>%{y}<extra></extra>'
        }
      ]}
      layout={{
        title: {
          text: mode === 'hours' ? 'Hours Variance by Workstream' : 'Budget Variance by Workstream',
          font: { color: '#FFFFFF' }
        },
        height: 600,
        margin: { l: 250, r: 50, t: 50, b: 50 },
        xaxis: {
          title: mode === 'hours' ? 'Hours Difference' : 'Budget Difference ($)',
          zeroline: true,
          zerolinecolor: '#FFFFFF',
          zerolinewidth: 2,
          range: [-maxValue * 1.1, maxValue * 1.1],
          gridcolor: '#333333',
          tickfont: { color: '#FFFFFF' }
        },
        yaxis: {
          tickfont: { color: '#FFFFFF' }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        showlegend: false,
        font: { color: '#FFFFFF' }
      }}
      config={{
        displayModeBar: true,
        responsive: true,
        displaylogo: false
      }}
      style={{ width: '100%' }}
    />
  );
}