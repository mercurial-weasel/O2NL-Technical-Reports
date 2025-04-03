import React, { useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-dist';
import { GeoMDD } from '@api/geotechnical/mdd';

interface MDDChart_Moisture_vs_DepthProps {
  data: GeoMDD[];
}

export const MDDChart_Moisture_vs_Depth: React.FC<MDDChart_Moisture_vs_DepthProps> = ({ data }) => {
  const plotRef = useRef<HTMLDivElement>(null);

  // Group data by geological unit
  const groupedData = useMemo(() => {
    const groups: Record<string, Array<[number, number, number | undefined, string]>> = {};
    
    data.forEach(test => {
      const nmc = test.NMC;
      const depth = test.SAMPLE_TOP;
      const chainage = test.chainage;
      const locationId = test.POINT_ID || "Unknown";
      const geologicalUnit = test.geological_unit || "Unknown Unit";
      
      if (nmc !== null && nmc !== undefined && 
          depth !== null && depth !== undefined) {
        if (!groups[geologicalUnit]) {
          groups[geologicalUnit] = [];
        }
        groups[geologicalUnit].push([nmc, depth, chainage, locationId]);
      }
    });
    
    // Sort each group by depth
    Object.keys(groups).forEach(unit => {
      groups[unit].sort((a, b) => a[1] - b[1]);
    });
    
    return groups;
  }, [data]);

  useEffect(() => {
    if (!plotRef.current || Object.keys(groupedData).length === 0) return;

    // Create figure data array
    const traces = [];

    // Add a trace for each geological unit
    Object.entries(groupedData).forEach(([unit, points]) => {
      const x = points.map(p => p[0]); // NMC
      const y = points.map(p => p[1]); // Depth
      const text = points.map(p => 
        `Location: ${p[3]}<br>Chainage: ${p[2] !== undefined ? p[2] : 'N/A'}<br>Depth: ${p[1].toFixed(1)} m<br>NMC: ${p[0].toFixed(1)}%`
      );
      
      traces.push({
        x,
        y,
        mode: 'markers',
        name: unit,
        marker: { size: 8 },
        text,
        hoverinfo: 'text'
      });
    });

    // Layout settings
    const layout = {
      title: {
        text: 'Natural Moisture Content vs Depth (Grouped by Geological Unit)',
        font: { size: 18, weight: 'bold' }
      },
      xaxis: {
        title: {
          text: 'Natural Moisture Content (%)',
          font: { size: 14 }
        },
        showgrid: true,
        gridcolor: 'lightgrey'
      },
      yaxis: {
        title: {
          text: 'Depth (m)',
          font: { size: 14 }
        },
        showgrid: true,
        gridcolor: 'lightgrey',
        autorange: 'reversed' // Depth increases downward
      },
      legend: {
        title: {
          text: 'Geological Unit'
        },
        x: 0,
        y: 1
      },
      autosize: true,
      margin: { l: 80, r: 50, t: 80, b: 80 }
    };

    // Render the plot
    Plotly.newPlot(plotRef.current, traces, layout, {
      responsive: true,
      displayModeBar: true,
      displaylogo: false,
      toImageButtonOptions: {
        format: 'png',
        filename: 'nmc_vs_depth',
        height: 800,
        width: 1200,
        scale: 2
      }
    });

    // Clean up on unmount
    return () => {
      if (plotRef.current) {
        Plotly.purge(plotRef.current);
      }
    };
  }, [groupedData]);

  // If no data has valid NMC and depth values
  if (Object.keys(groupedData).length === 0) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <p className="text-gray-500">No valid data available for plotting NMC vs Depth.</p>
      </div>
    );
  }

  return <div ref={plotRef} style={{ width: '100%', height: '600px' }} />;
};
