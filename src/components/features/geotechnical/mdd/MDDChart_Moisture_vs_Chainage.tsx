import React, { useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-dist';
import { GeoMDD } from '@api/geotechnical/mdd';

interface MDDChart_Moisture_vs_ChainageProps {
  data: GeoMDD[];
}

export const MDDChart_Moisture_vs_Chainage: React.FC<MDDChart_Moisture_vs_ChainageProps> = ({ data }) => {
  const plotRef = useRef<HTMLDivElement>(null);

  // Group data by geological unit
  const groupedData = useMemo(() => {
    const groups: Record<string, Array<[number, number, string]>> = {};
    
    data.forEach(test => {
      const chainage = test.chainage;
      const nmc = test.NMC;
      const locationId = test.POINT_ID || "Unknown";
      const geologicalUnit = test.geological_unit || "Unknown";
      
      if (chainage !== null && chainage !== undefined && 
          nmc !== null && nmc !== undefined) {
        if (!groups[geologicalUnit]) {
          groups[geologicalUnit] = [];
        }
        groups[geologicalUnit].push([chainage, nmc, locationId]);
      }
    });
    
    // Sort each group by chainage
    Object.keys(groups).forEach(unit => {
      groups[unit].sort((a, b) => a[0] - b[0]);
    });
    
    return groups;
  }, [data]);

  useEffect(() => {
    if (!plotRef.current || Object.keys(groupedData).length === 0) return;

    // Create figure data array
    const traces = [];

    // Add a trace for each geological unit
    Object.entries(groupedData).forEach(([unit, points]) => {
      const x = points.map(p => p[0]); // Chainage
      const y = points.map(p => p[1]); // NMC
      const text = points.map(p => 
        `Location: ${p[2]}<br>Chainage: ${p[0]}<br>NMC: ${p[1].toFixed(1)}%`
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
        text: 'Natural Moisture Content vs Chainage (Colored by Geological Unit)',
        font: { size: 18, weight: 'bold' }
      },
      xaxis: {
        title: {
          text: 'Chainage (m)',
          font: { size: 14 }
        },
        showgrid: true
      },
      yaxis: {
        title: {
          text: 'Natural Moisture Content (%)',
          font: { size: 14 }
        },
        showgrid: true
      },
      legend: {
        title: {
          text: 'Geological Unit'
        },
        x: 0,
        y: 1.05
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
        filename: 'nmc_vs_chainage',
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

  // If no data has valid chainage and NMC values
  if (Object.keys(groupedData).length === 0) {
    return (
      <div className="flex justify-center items-center h-[500px]">
        <p className="text-gray-500">No valid data available for plotting NMC vs Chainage.</p>
      </div>
    );
  }

  return <div ref={plotRef} style={{ width: '100%', height: '600px' }} />;
};
