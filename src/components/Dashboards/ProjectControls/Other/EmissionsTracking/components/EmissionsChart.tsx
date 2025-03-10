import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { EmissionRecord } from '@api/emissions/types';
import { getUniqueCategories, getUniqueMonths } from '@api/emissions/transformations';

interface EmissionsChartProps {
  data: EmissionRecord[];
}

export function EmissionsChart({ data }: EmissionsChartProps) {
  const [showCarbonEstimate, setShowCarbonEstimate] = useState(true);

  const categories = getUniqueCategories(data);
  const months = getUniqueMonths(data);

  // Create traces for each category
  const traces = categories.map(category => {
    const categoryData = data.filter(record => record.category === category);
    return {
      name: category,
      type: 'bar' as const,
      x: months,
      y: categoryData.map(record => 
        showCarbonEstimate ? record.carbonEstimateKgCO2e : record.amount
      ),
      hovertemplate: `
        Category: ${category}<br>
        Month: %{x}<br>
        ${showCarbonEstimate ? 'Carbon Estimate: %{y:.2f} KgCO2e' : 'Amount: %{y}'}<br>
        <extra></extra>
      `
    };
  });

  return (
    <div>
      {/* Metric Toggle */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center bg-gray-800/50 rounded-lg p-0.5">
          <button
            onClick={() => setShowCarbonEstimate(false)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              !showCarbonEstimate
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Raw Amount
          </button>
          <button
            onClick={() => setShowCarbonEstimate(true)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              showCarbonEstimate
                ? 'bg-brand-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Carbon Estimate
          </button>
        </div>
      </div>

      <Plot
        data={traces}
        layout={{
          title: {
            text: showCarbonEstimate ? 'Carbon Emissions by Category' : 'Raw Amounts by Category',
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
              text: showCarbonEstimate ? 'Carbon Emissions (KgCO2e)' : 'Amount',
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