import React, { useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-dist';
import { GeoLabGrading } from '@api/geotechnical/labgrading';

interface LabGradingChartProps {
  data: GeoLabGrading[];
}

export const LabGradingChart: React.FC<LabGradingChartProps> = ({ data }) => {
  const plotRef = useRef<HTMLDivElement>(null);
  
  // Group data by sample reference and material_id
  const groupedData = useMemo(() => {
    // First, group by sample ID
    const bySample: Record<string, GeoLabGrading[]> = {};
    
    data.forEach(item => {
      const sampleRef = item.sample_reference || item.sample_id || `unknown-${item.id}`;
      if (!bySample[sampleRef]) {
        bySample[sampleRef] = [];
      }
      bySample[sampleRef].push(item);
    });
    
    // Process each sample group
    const samples = Object.entries(bySample).map(([sampleRef, items]) => {
      // Sort by item (particle size)
      const sortedItems = [...items].sort((a, b) => a.item - b.item);
      
      const pointId = sortedItems[0]?.point_id || 'Unknown';
      const materialId = sortedItems[0]?.material_id || 'Unknown';
      const sampleTop = sortedItems[0]?.sample_top || 0;
      
      // Create legend entry like in Python code
      const legend = `[${materialId}] ${pointId} - ${sampleTop} m`;
      
      return {
        legend,
        sampleRef,
        geologicalUnit: materialId,
        sieveSizes: sortedItems.map(item => item.item),
        percentPassing: sortedItems.map(item => item.perc_passing)
      };
    });
    
    // Sort by geological unit as in Python code
    return samples.sort((a, b) => a.geologicalUnit.localeCompare(b.geologicalUnit));
  }, [data]);
  
  // Create chart when data changes
  useEffect(() => {
    if (!plotRef.current || groupedData.length === 0) return;
    
    // Assign unique colors to each geological unit
    const uniqueGeologicalUnits = Array.from(
      new Set(groupedData.map(sample => sample.geologicalUnit))
    );
    
    const colorMap: Record<string, string> = {};
    uniqueGeologicalUnits.forEach((unit, i) => {
      const hue = i * (360 / uniqueGeologicalUnits.length);
      colorMap[unit] = `hsl(${hue}, 70%, 50%)`;
    });
    
    // Line styles and marker symbols like in Python code
    const lineStyles = ["solid", "dash", "dot", "dashdot"];
    const markerSymbols = ["circle", "square", "diamond", "x", "triangle-up", "triangle-down"];
    
    // Create traces for the particle size distribution
    const traces = groupedData.map((sample, i) => {
      return {
        x: sample.sieveSizes,
        y: sample.percentPassing,
        mode: 'lines+markers',
        name: sample.legend,
        line: {
          color: colorMap[sample.geologicalUnit],
          width: 2,
          dash: lineStyles[i % lineStyles.length]
        },
        marker: {
          size: 6,
          symbol: markerSymbols[i % markerSymbols.length]
        }
      };
    });
    
    // Add classification lines as in Python code
    const classificationLines = [
      {x: [0.001, 0.001], y: [0, -20]},
      {x: [0.002, 0.002], y: [0, -20]},
      {x: [0.06, 0.06], y: [0, -20]},
      {x: [0.2, 0.2], y: [0, -10]},
      {x: [0.6, 0.6], y: [0, -10]},
      {x: [2, 2], y: [0, -20]},
      {x: [0.06, 60], y: [-10, -10]},
      {x: [6, 6], y: [0, -10]},
      {x: [20, 20], y: [0, -10]},
      {x: [60, 60], y: [0, -20]},
      {x: [0.001, 100], y: [0, 0]},
      {x: [0.001, 100], y: [-20, -20]}
    ];
    
    const classificationTraces = classificationLines.map((line, i) => {
      return {
        x: line.x,
        y: line.y,
        mode: 'lines',
        line: {
          color: 'black',
          width: 1
        },
        showlegend: false,
        hoverinfo: 'none'
      };
    });
    
    // Add classification text annotations
    const classificationText = [
      {x: 0.0015, y: -10, text: "Clay"},
      {x: 0.01, y: -10, text: "Silt"},
      {x: 0.4, y: -15, text: "Sand"},
      {x: 11, y: -15, text: "Gravel"},
      {x: 90, y: -10, text: "Cobbles"},
      {x: 0.115, y: -5, text: "fine"},
      {x: 0.35, y: -5, text: "medium"},
      {x: 1.1, y: -5, text: "coarse"},
      {x: 3.4, y: -5, text: "fine"},
      {x: 11, y: -5, text: "medium"},
      {x: 35, y: -5, text: "coarse"}
    ];
    
    // Create layout
    const layout = {
      title: "Particle Size Distribution by Sample",
      xaxis: {
        title: "Particle Size (mm) - Log Scale",
        type: "log",
        showgrid: true,
        gridcolor: "lightgrey",
        tickmode: "array",
        tickvals: [0.001, 0.01, 0.1, 1, 10, 100]
      },
      yaxis: {
        title: "Percent Passing (%)",
        range: [-25, 105],
        showgrid: true,
        gridcolor: "lightgrey"
      },
      legend: {
        title: {text: "Grouped by Material ID"},
        x: 1.05,
        y: 0.5,
        xanchor: "left",
        yanchor: "middle",
        traceorder: "normal"
      },
      plot_bgcolor: "white",
      margin: {l: 50, r: 250, t: 50, b: 50},
      annotations: classificationText.map(item => ({
        x: item.x, 
        y: item.y, 
        text: item.text,
        showarrow: false,
        font: {
          size: 12,
          color: "black",
          family: "Arial"
        },
        align: "center",
        xanchor: "center",
        yanchor: "middle",
        bgcolor: "white",
      }))
    };
    
    // Combine all traces
    const allTraces = [...traces, ...classificationTraces];
    
    // Create plot
    Plotly.newPlot(plotRef.current, allTraces, layout, {
      responsive: true,
      displayModeBar: true,
      displaylogo: false
    });
    
    // Cleanup on unmount
    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  }, [groupedData]);
  
  return (
    <div className="flex flex-col">
      {data.length === 0 ? (
        <div className="flex justify-center items-center h-[500px]">
          <p className="text-gray-500">No data available for plotting.</p>
        </div>
      ) : (
        <div ref={plotRef} style={{ width: '100%', height: '700px' }} />
      )}
    </div>
  );
};
