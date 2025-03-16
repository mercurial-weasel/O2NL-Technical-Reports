import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import { Atterbergs } from "@api/geotechnical/plasticity";

interface PlasticityPlotProps {
  data: Atterbergs[];
}

const PlasticityPlot: React.FC<PlasticityPlotProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [selectedPoints, setSelectedPoints] = useState<string[]>([]);

  // Update dimensions when container size changes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        // Maintain aspect ratio close to 4:3 for the chart
        const containerHeight = Math.min(containerWidth * 0.75, 600);
        setDimensions({
          width: containerWidth,
          height: containerHeight
        });
      }
    };

    // Initial dimensions
    updateDimensions();

    // Set up resize observer to update dimensions when container resizes
    const resizeObserver = new ResizeObserver(updateDimensions);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Clean up
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  // Split data into selected and unselected points
  const selectedData = data.filter(sample => 
    selectedPoints.includes(sample.sample_unique_id)
  );
  
  const unselectedData = data.filter(sample => 
    !selectedPoints.includes(sample.sample_unique_id)
  );

  // Create traces for unselected points
  const unselectedTraces = [{
    x: unselectedData.map(sample => sample.liquid_limit),
    y: unselectedData.map(sample => sample.plasticity_index),
    text: unselectedData.map(sample => `${sample.sample_reference} (Depth: ${sample.depth_to}m)`),
    hovertemplate: '<b>%{text}</b><br>LL: %{x}<br>PI: %{y}<extra></extra>',
    mode: "markers",
    name: "Samples",
    marker: { 
      size: 10,
      color: unselectedData.map(sample => {
        // Color by liquid limit range
        if (sample.liquid_limit < 35) return 'rgba(70, 130, 180, 0.7)'; // steelblue
        if (sample.liquid_limit < 50) return 'rgba(30, 144, 255, 0.7)'; // dodgerblue
        if (sample.liquid_limit < 70) return 'rgba(255, 165, 0, 0.7)';  // orange
        return 'rgba(255, 69, 0, 0.7)';                                // red-orange
      })
    }
  }];

  // Create traces for selected points (if any)
  const selectedTraces = selectedData.length > 0 ? [{
    x: selectedData.map(sample => sample.liquid_limit),
    y: selectedData.map(sample => sample.plasticity_index),
    text: selectedData.map(sample => `${sample.sample_reference} (Depth: ${sample.depth_to}m)`),
    hovertemplate: '<b>%{text}</b><br>LL: %{x}<br>PI: %{y}<extra></extra>',
    mode: "markers+text",
    textposition: "top center",
    name: "Selected",
    marker: { 
      size: 14,
      color: 'rgba(255, 0, 0, 0.9)',
      line: {
        color: 'black',
        width: 2
      }
    }
  }] : [];

  // Combine all traces
  const traces = [...unselectedTraces, ...selectedTraces];

  // Reference lines and classification boundaries
  const shapes = [
    // A-Line
    { type: "line", x0: 0, y0: 0, x1: 20, y1: 0, line: { color: "black", width: 1 } }, // x-axis extension
    { type: "line", x0: 20, y0: 0, x1: 50, y1: 22, line: { color: "black", width: 2 } }, // A-Line
    { type: "line", x0: 50, y0: 22, x1: 100, y1: 58, line: { color: "black", width: 2 } }, // A-Line extension
    
    // U-Line (approximate)
    { type: "line", x0: 16, y0: 0, x1: 80, y1: 47, line: { color: "black", width: 1, dash: "dot" } },
    
    // Vertical classification boundaries
    { type: "line", x0: 35, y0: 0, x1: 35, y1: 60, line: { color: "black", width: 1, dash: "dash" } },
    { type: "line", x0: 50, y0: 0, x1: 50, y1: 60, line: { color: "black", width: 1, dash: "dash" } },
    { type: "line", x0: 70, y0: 0, x1: 70, y1: 60, line: { color: "black", width: 1, dash: "dash" } },
    { type: "line", x0: 90, y0: 0, x1: 90, y1: 60, line: { color: "black", width: 1, dash: "dash" } },
  ];

  // Annotations for classification regions
  const annotations = [
    { x: 23, y: 4, text: "CL-ML" },
    { x: 27, y: 15, text: "CL" },
    { x: 42, y: 25, text: "CI" },
    { x: 60, y: 35, text: "CH" },
    { x: 80, y: 45, text: "CV" },
    { x: 27, y: 6, text: "ML" },
    { x: 42, y: 10, text: "MI" },
    { x: 60, y: 20, text: "MH" },
    { x: 80, y: 30, text: "MV" },
  ].map((ann) => ({ 
    x: ann.x, 
    y: ann.y, 
    text: ann.text, 
    showarrow: false, 
    font: { size: 10 },
    bgcolor: "rgba(255, 255, 255, 0.7)",
    borderpad: 2
  }));

  // Handle point selection
  const handlePointClick = (eventData: any) => {
    if (eventData && eventData.points && eventData.points.length > 0) {
      const clickedPoint = eventData.points[0];
      const pointIndex = clickedPoint.pointIndex;
      
      // Determine which trace was clicked (selected or unselected)
      let clickedSample;
      if (clickedPoint.curveNumber === 0) {
        clickedSample = unselectedData[pointIndex];
      } else {
        clickedSample = selectedData[pointIndex];
      }

      if (clickedSample) {
        const sampleId = clickedSample.sample_unique_id;
        
        // Toggle selection status
        if (selectedPoints.includes(sampleId)) {
          setSelectedPoints(selectedPoints.filter(id => id !== sampleId));
        } else {
          setSelectedPoints([...selectedPoints, sampleId]);
        }
      }
    }
  };

  // Add legend for sample color coding
  const colorLegendDiv = (
    <div className="mt-2 flex flex-wrap gap-4 items-center text-sm">
      <span className="font-medium">Sample colors:</span>
      <div className="flex items-center">
        <span className="inline-block w-4 h-4 mr-1 bg-[rgba(70,130,180,0.7)]"></span>
        <span>LL &lt; 35: Low plasticity</span>
      </div>
      <div className="flex items-center">
        <span className="inline-block w-4 h-4 mr-1 bg-[rgba(30,144,255,0.7)]"></span>
        <span>LL 35-50: Intermediate plasticity</span>
      </div>
      <div className="flex items-center">
        <span className="inline-block w-4 h-4 mr-1 bg-[rgba(255,165,0,0.7)]"></span>
        <span>LL 50-70: High plasticity</span>
      </div>
      <div className="flex items-center">
        <span className="inline-block w-4 h-4 mr-1 bg-[rgba(255,69,0,0.7)]"></span>
        <span>LL &gt; 70: Very high plasticity</span>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full">
        {dimensions.width > 0 && (
          <Plot
            data={traces}
            layout={{
              title: "Atterberg Plasticity Chart",
              xaxis: { 
                title: "Liquid Limit (LL)", 
                range: [0, 100], 
                showgrid: true, 
                gridcolor: "lightgrey" 
              },
              yaxis: { 
                title: "Plasticity Index (PI)", 
                range: [0, 60], 
                showgrid: true, 
                gridcolor: "lightgrey" 
              },
              shapes,
              annotations,
              plot_bgcolor: "white",
              margin: { l: 50, r: 50, t: 50, b: 50 },
              legend: { title: "Test Samples" },
              width: dimensions.width,
              height: dimensions.height,
              autosize: false,
              hovermode: "closest",
            }}
            config={{
              responsive: true,
              displayModeBar: true,
              displaylogo: false,
              modeBarButtonsToRemove: ['lasso2d', 'select2d', 'hoverCompareCartesian'],
              toImageButtonOptions: {
                format: 'png',
                filename: 'atterberg_plasticity_chart',
                scale: 2
              }
            }}
            onClick={handlePointClick}
            style={{ width: "100%", height: "100%" }}
          />
        )}
      </div>
      
      {colorLegendDiv}
      
      {selectedPoints.length > 0 && (
        <div className="mt-4 p-3 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Selected Samples: {selectedPoints.length}</h4>
            <button 
              onClick={() => setSelectedPoints([])}
              className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
            >
              Clear Selection
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {selectedData.map(sample => (
              <div 
                key={sample.sample_unique_id} 
                className="p-2 bg-white border rounded flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{sample.sample_reference}</div>
                  <div className="text-sm text-gray-600">LL: {sample.liquid_limit}, PI: {sample.plasticity_index}</div>
                </div>
                <button 
                  onClick={() => setSelectedPoints(selectedPoints.filter(id => id !== sample.sample_unique_id))}
                  className="text-gray-500 hover:text-red-500"
                  title="Remove from selection"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlasticityPlot;
