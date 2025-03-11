import React, { useState, useMemo } from 'react';
import { BarChart2 } from 'lucide-react';
import Plot from 'react-plotly.js';
import { boxPlotConfig, boxPlotLayout } from '@constants/chartConfig';
import { SPTResult } from '@data/models';

interface StatisticalSummaryProps {
  sptResults: SPTResult[];
}

type ViewMode = 'chart' | 'table';

const MATERIAL_TYPES = [
  "Unidentified",
  "Alluvium",
  "Colluvium",
  "Engineering Fill",
  "Soil",
  "Non-eng Fill",
  "Not logged",
  "Tsoil"
];

export function StatisticalSummary({ sptResults }: StatisticalSummaryProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('chart');

  // Group SPT results by material type
  const materialData = useMemo(() => {
    const data: Record<string, number[]> = {};
    MATERIAL_TYPES.forEach(material => {
      data[material] = sptResults
        .filter(result => result.material === material)
        .map(result => result.num_test_blow_count);
    });
    return data;
  }, [sptResults]);

  // Create box plot traces
  const boxPlotTraces = useMemo(() => {
    return MATERIAL_TYPES.map(material => ({
      type: 'box' as const,
      y: materialData[material],
      name: material,
      boxpoints: 'all',
      jitter: 0.3,
      pointpos: -1.8,
      marker: { color: '#FFFFFF' }, // Updated to text-text-primary
      line: { color: '#FFFFFF' }, // Updated to text-text-primary
      whiskerwidth: 0.8,
      boxmean: true,
      hovertemplate: 
        'Material: ' + material +
        '<br>Value: %{y}<br>' +
        '<extra></extra>'
    }));
  }, [materialData]);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-brand-secondary" />
          <h3 className="text-lg font-medium text-brand-secondary">SPT Results by Material Type</h3>
        </div>
        <div className="flex items-center bg-gray-700/50 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
              viewMode === 'chart'
                ? 'bg-brand-secondary text-text-primary font-medium'
                : 'text-text-secondary hover:text-brand-secondary'
            }`}
          >
            Chart
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
              viewMode === 'table'
                ? 'bg-brand-secondary text-text-primary font-medium'
                : 'text-text-secondary hover:text-brand-secondary'
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <div className="h-[calc(100%-3rem)]">
          <Plot
            data={boxPlotTraces}
            layout={{
              ...boxPlotLayout,
              height: 400,
              showlegend: false,
              title: {
                text: 'SPT N-Count Distribution by Material Type',
                font: { size: 14, color: '#FFFFFF' }
              },
              xaxis: {
                title: { text: 'Material Type', font: { color: '#FFFFFF' } },
                gridcolor: '#333',
                zerolinecolor: '#333',
                tickangle: -45,
                tickfont: { color: '#FFFFFF' }
              },
              yaxis: {
                title: { text: 'SPT N-Count', font: { color: '#FFFFFF' } },
                gridcolor: '#333',
                zerolinecolor: '#333',
                range: [0, 250],
                autorange: false,
                tickfont: { color: '#FFFFFF' }
              },
              margin: {
                l: 50,
                r: 20,
                t: 40,
                b: 120
              }
            }}
            config={boxPlotConfig}
            style={{ width: '100%', height: '100%' }}
            useResizeHandler={true}
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="py-3 px-4 text-brand-secondary font-medium">Material Type</th>
                <th className="py-3 px-4 text-brand-secondary font-medium">Count</th>
                <th className="py-3 px-4 text-brand-secondary font-medium">Mean</th>
                <th className="py-3 px-4 text-brand-secondary font-medium">Min</th>
                <th className="py-3 px-4 text-brand-secondary font-medium">Q1</th>
                <th className="py-3 px-4 text-brand-secondary font-medium">Median</th>
                <th className="py-3 px-4 text-brand-secondary font-medium">Q3</th>
                <th className="py-3 px-4 text-brand-secondary font-medium">Max</th>
              </tr>
            </thead>
            <tbody>
              {MATERIAL_TYPES.map((material, index) => {
                const values = materialData[material];
                const stats = values.length > 0 ? {
                  count: values.length,
                  mean: values.reduce((a, b) => a + b, 0) / values.length,
                  min: Math.min(...values),
                  q1: values.sort((a, b) => a - b)[Math.floor(values.length * 0.25)],
                  median: values.sort((a, b) => a - b)[Math.floor(values.length * 0.5)],
                  q3: values.sort((a, b) => a - b)[Math.floor(values.length * 0.75)],
                  max: Math.max(...values)
                } : {
                  count: 0,
                  mean: 0,
                  min: 0,
                  q1: 0,
                  median: 0,
                  q3: 0,
                  max: 0
                };

                return (
                  <tr
                    key={material}
                    className={`border-b border-gray-700/50 hover:bg-gray-700/20 transition-colors ${
                      index % 2 === 0 ? 'bg-gray-800/20' : ''
                    }`}
                  >
                    <td className="py-2 px-4 text-text-secondary">{material}</td>
                    <td className="py-2 px-4 text-text-secondary">{stats.count}</td>
                    <td className="py-2 px-4 text-text-secondary">{stats.mean.toFixed(1)}</td>
                    <td className="py-2 px-4 text-text-secondary">{stats.min.toFixed(1)}</td>
                    <td className="py-2 px-4 text-text-secondary">{stats.q1.toFixed(1)}</td>
                    <td className="py-2 px-4 text-text-secondary">{stats.median.toFixed(1)}</td>
                    <td className="py-2 px-4 text-text-secondary">{stats.q3.toFixed(1)}</td>
                    <td className="py-2 px-4 text-text-secondary">{stats.max.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}