import React, { useEffect, useRef, useState, useMemo } from 'react';
import Plotly from 'plotly.js-dist';
import { GeoCBR } from '@api/geotechnical/cbr';

interface CBRChart_vs_PropertyProps {
  data: GeoCBR[];
}

export const CBRChart_vs_Property: React.FC<CBRChart_vs_PropertyProps> = ({ data }) => {
  const plotRef = useRef<HTMLDivElement>(null);
  
  // State for property selection
  const [selectedProperty, setSelectedProperty] = useState<string>("dry_density");
  
  // List of properties to compare CBR against
  const properties = {
    "Dry Density (g/cm³)": "dry_density",
    "Water Content (Compacted) (%)": "water_content_compacted",
    "Water Content (Plunger) (%)": "water_content_plunger",
    "Oversize Material (%)": "oversize_material_perc",
    "Depth (m)": "depth_to"
  };
  
  // Get property label for display
  const getPropertyLabel = (propertyKey: string): string => {
    return Object.entries(properties).find(([_, value]) => value === propertyKey)?.[0] || propertyKey;
  };
  
  // Group data by geological unit for easier plotting
  const groupedData = useMemo(() => {
    const groups: Record<string, GeoCBR[]> = {};
    
    data.forEach(item => {
      const geoUnit = item.geological_unit || 'Unknown Unit';
      if (!groups[geoUnit]) {
        groups[geoUnit] = [];
      }
      groups[geoUnit].push(item);
    });
    
    return groups;
  }, [data]);
  
  // Create plot when data or selected property changes
  useEffect(() => {
    if (!plotRef.current) return;
    
    // Create traces for each geological unit
    const traces = [];
    
    Object.entries(groupedData).forEach(([geoUnit, unitData]) => {
      // Get valid data points where both CBR and selected property are present
      const validPoints = unitData.filter(item => 
        item.cbr_perc !== null && item.cbr_perc !== undefined && 
        item[selectedProperty] !== null && item[selectedProperty] !== undefined
      );
      
      if (validPoints.length === 0) return;
      
      // Create hover text with additional details
      const text = validPoints.map(item => 
        `Sample: ${item.sample_id}<br>` +
        `Investigation: ${item.investigation_id}<br>` +
        `Depth: ${item.depth_to.toFixed(2)}m<br>` +
        `CBR: ${item.cbr_perc?.toFixed(1)}%<br>` +
        `${getPropertyLabel(selectedProperty)}: ${item[selectedProperty]?.toFixed(3)}`
      );
      
      // Special case for depth - we reverse the axes
      if (selectedProperty === 'depth_to') {
        // For depth, CBR is on x-axis and depth on y-axis
        traces.push({
          x: validPoints.map(item => item.cbr_perc),
          y: validPoints.map(item => item.depth_to),
          mode: 'markers',
          type: 'scatter',
          name: geoUnit,
          text,
          hoverinfo: 'text',
          marker: {
            size: 10
          }
        });
      } else {
        // Normal case - selected property on x-axis, CBR on y-axis
        traces.push({
          x: validPoints.map(item => item[selectedProperty]),
          y: validPoints.map(item => item.cbr_perc),
          mode: 'markers',
          type: 'scatter',
          name: geoUnit,
          text,
          hoverinfo: 'text',
          marker: {
            size: 10
          }
        });
      }
    });
    
    const propertyLabel = getPropertyLabel(selectedProperty);
    
    // Create layout based on selected property
    let layout;
    if (selectedProperty === 'depth_to') {
      // For depth, we reverse the axes and invert the y-axis
      layout = {
        title: `CBR vs ${propertyLabel} by Geological Unit`,
        xaxis: {
          title: 'CBR (%)',
          showgrid: true,
          zeroline: true
        },
        yaxis: {
          title: `${propertyLabel}`,
          showgrid: true,
          zeroline: true,
          autorange: 'reversed' // Depth increases downward
        },
        legend: {
          title: {
            text: 'Geological Unit'
          }
        },
        hovermode: 'closest',
        margin: { l: 60, r: 30, t: 50, b: 50 }
      };
    } else {
      // Standard layout
      layout = {
        title: `CBR vs ${propertyLabel} by Geological Unit`,
        xaxis: {
          title: `${propertyLabel}`,
          showgrid: true,
          zeroline: true
        },
        yaxis: {
          title: 'CBR (%)',
          showgrid: true,
          zeroline: true
        },
        legend: {
          title: {
            text: 'Geological Unit'
          }
        },
        hovermode: 'closest',
        margin: { l: 60, r: 30, t: 50, b: 50 }
      };
    }
    
    // Render the plot
    Plotly.newPlot(plotRef.current, traces, layout, {
      responsive: true,
      displaylogo: false
    });
    
    // Clean up on unmount
    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  }, [data, selectedProperty, groupedData]);
  
  return (
    <div className="flex flex-col">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 mb-4 flex items-center justify-between">
        <label htmlFor="property-select" className="text-sm font-medium text-gray-700 mr-2">
          Compare CBR against:
        </label>
        <select
          id="property-select"
          className="rounded-md border border-gray-300 py-1 px-3 text-sm"
          value={selectedProperty}
          onChange={(e) => setSelectedProperty(e.target.value)}
        >
          {Object.entries(properties).map(([label, value]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>
      
      {data.length === 0 ? (
        <div className="flex justify-center items-center h-[500px]">
          <p className="text-gray-500">No data available for plotting.</p>
        </div>
      ) : (
        <div ref={plotRef} style={{ width: '100%', height: '600px' }} />
      )}
    </div>
  );
};
