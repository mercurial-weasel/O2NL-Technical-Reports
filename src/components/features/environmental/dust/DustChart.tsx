import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { DustData } from '@api/environmental/sensors/dust';
import { calculateTrends, calculateAverages } from '@api/environmental/sensors/dust';

interface DustChartProps {
  data: DustData;
}

type MetricType = 'pm10' | 'pm2_5' | 'temperature' | 'humidity' | 'windSpeed';

const metricLabels = {
  pm10: 'PM10 (µg/m³)',
  pm2_5: 'PM2.5 (µg/m³)',
  temperature: 'Temperature (°C)',
  humidity: 'Humidity (%)',
  windSpeed: 'Wind Speed (m/s)'
};

export function DustChart({ data }: DustChartProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('pm10');

  // Create traces for each device
  const traces = data.devices.map(device => {
    const trends = calculateTrends(device);
    
    return {
      name: device.deviceName,
      x: trends.map(t => t.timestamp),
      y: trends.map(t => t[selectedMetric]),
      type: 'scatter' as const,
      mode: 'lines+markers' as const,
      hovertemplate: `
        <b>${device.deviceName}</b><br>
        ${metricLabels[selectedMetric]}: %{y:.2f}<br>
        Time: %{x}<br>
        <extra></extra>
      `
    };
  });

  return (
    <div>
      {/* Metric Selector */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center bg-gray-800/50 rounded-lg p-0.5">
          {Object.entries(metricLabels).map(([metric, label]) => (
            <button
              key={metric}
              onClick={() => setSelectedMetric(metric as MetricType)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === metric
                  ? 'bg-brand-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <Plot
        data={traces}
        layout={{
          title: {
            text: `${metricLabels[selectedMetric]} Over Time`,
            font: { color: '#FFFFFF', size: 16 }
          },
          height: 600,
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
              text: 'Time',
              font: { color: '#FFFFFF' }
            },
            tickfont: { color: '#FFFFFF' },
            gridcolor: '#333333',
            showgrid: true
          },
          yaxis: {
            title: {
              text: metricLabels[selectedMetric],
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