import React from 'react';
import { LineChart } from 'lucide-react';
import Plot from 'react-plotly.js';
import { boxPlotConfig, boxPlotLayout } from '../../../../constants/chartConfig';
import { SPTResult, Point } from '../../../../data/models';
import { materials } from '../../../../constants/materials';

interface SPTPlotsProps {
  sptResults: SPTResult[];
  points: Point[];
}

const descriptiveTerms = ['V-Loose', 'Loose', 'Med-Dense', 'Dense', 'V-Dense'];
const descriptiveRanges = [0, 4, 10, 30, 50, 80];

export function SPTPlots({ sptResults, points }: SPTPlotsProps) {
  const plotConfig = {
    displayModeBar: true,
    responsive: true,
    displaylogo: false,
    modeBarButtonsToRemove: [
      'select2d',
      'lasso2d',
      'autoScale2d',
      'hoverClosestCartesian',
      'hoverCompareCartesian',
      'toggleSpikelines'
    ],
    toImageButtonOptions: {
      format: 'png',
      filename: 'spt_plot',
      height: 500,
      width: 700,
      scale: 2
    },
    scrollZoom: true,
    showTips: false
  };

  const commonLayoutProps = {
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    font: { color: '#FFFFFF' }, // Updated to text-text-primary
    showlegend: true,
    legend: {
      bgcolor: 'rgba(0,0,0,0.5)',
      bordercolor: '#FFFFFF', // Updated to text-text-primary
      borderwidth: 1,
      font: { color: '#FFFFFF' } // Updated to text-text-primary
    },
    margin: { l: 50, r: 20, t: 40, b: 50 },
    modebar: {
      bgcolor: 'rgba(0,0,0,0)',
      color: '#FFFFFF', // Updated to text-text-primary
      activecolor: '#FFFFFF', // Updated to text-text-primary
      orientation: 'v'
    },
    hoverlabel: {
      bgcolor: '#1a1a1a',
      bordercolor: '#FFFFFF', // Updated to text-text-primary
      font: { color: '#FFFFFF' } // Updated to text-text-primary
    },
    dragmode: 'zoom',
    hovermode: 'closest',
    selectdirection: 'any'
  };

  // Create traces for each material type
  const uniqueMaterials = [...new Set(sptResults.map(r => r.material))];
  const depthPlotTraces = uniqueMaterials.map(material => {
    const filteredResults = sptResults.filter(r => r.material === material);
    return {
      type: 'scatter',
      mode: 'markers',
      x: filteredResults.map(r => r.num_test_blow_count),
      y: filteredResults.map(r => r.top),
      name: material,
      marker: {
        symbol: 'circle',
        size: 10,
        color: materials.find(m => m.name === material)?.color || '#FFFFFF'
      },
      hovertemplate: 
        'Depth: %{y}m<br>' +
        'SPT N-Count: %{x}<br>' +
        'Material: ' + material +
        '<extra></extra>'
    };
  });

  const descriptivePlotTraces = uniqueMaterials.map(material => {
    const filteredResults = sptResults.filter(r => r.material === material);
    return {
      type: 'scatter',
      mode: 'markers',
      x: descriptiveTerms.map((_, i) => i),
      y: filteredResults.map(r => r.num_test_blow_count),
      name: material,
      marker: {
        symbol: 'circle',
        size: 10,
        color: materials.find(m => m.name === material)?.color || '#FFFFFF'
      },
      hovertemplate: 
        'Term: %{text}<br>' +
        'SPT N-Count: %{y}<br>' +
        'Material: ' + material +
        '<extra></extra>',
      text: descriptiveTerms
    };
  });

  // Add reference lines for descriptive terms
  const referenceLines = descriptiveRanges.map((value, i) => ({
    type: 'scatter',
    mode: 'lines',
    x: [i - 0.5, i - 0.5],
    y: [0, 80],
    line: {
      color: '#FFFFFF', // Updated to text-text-primary
      width: 1,
      dash: 'dash'
    },
    showlegend: false,
    hoverinfo: 'none'
  }));

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-4">
        <LineChart className="w-5 h-5 text-brand-secondary" />
        <h3 className="text-lg font-medium text-brand-secondary">SPT Plots</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Plot
          data={depthPlotTraces}
          layout={{
            ...commonLayoutProps,
            height: 400,
            title: {
              text: 'SPT N-Count vs Depth',
              font: { size: 14, color: '#FFFFFF' } // Updated to text-text-primary
            },
            xaxis: {
              title: { text: 'SPT N-Count', font: { color: '#FFFFFF' } }, // Updated to text-text-primary
              gridcolor: '#333',
              zerolinecolor: '#333',
              range: [0, 80],
              showspikes: false,
              spikecolor: '#FFFFFF', // Updated to text-text-primary
              spikethickness: 1,
              tickfont: { color: '#FFFFFF' } // Updated to text-text-primary
            },
            yaxis: {
              title: { text: 'Depth (m)', font: { color: '#FFFFFF' } }, // Updated to text-text-primary
              gridcolor: '#333',
              zerolinecolor: '#333',
              range: [35, 0],
              autorange: false,
              showspikes: false,
              spikecolor: '#FFFFFF', // Updated to text-text-primary
              spikethickness: 1,
              tickfont: { color: '#FFFFFF' } // Updated to text-text-primary
            }
          }}
          config={plotConfig}
          className="w-full"
        />
        <Plot
          data={[...descriptivePlotTraces, ...referenceLines]}
          layout={{
            ...commonLayoutProps,
            height: 400,
            title: {
              text: 'SPT-Count vs Strength Class',
              font: { size: 14, color: '#FFFFFF' } // Updated to text-text-primary
            },
            xaxis: {
              title: { text: 'Strength Class', font: { color: '#FFFFFF' } }, // Updated to text-text-primary
              gridcolor: '#333',
              zerolinecolor: '#333',
              ticktext: descriptiveTerms,
              tickvals: descriptiveTerms.map((_, i) => i),
              range: [-0.5, 4.5],
              showspikes: false,
              tickfont: { color: '#FFFFFF' } // Updated to text-text-primary
            },
            yaxis: {
              title: { text: 'SPT N-Count', font: { color: '#FFFFFF' } }, // Updated to text-text-primary
              gridcolor: '#333',
              zerolinecolor: '#333',
              range: [0, 80],
              showspikes: false,
              tickfont: { color: '#FFFFFF' } // Updated to text-text-primary
            }
          }}
          config={plotConfig}
          className="w-full"
        />
      </div>
    </div>
  );
}