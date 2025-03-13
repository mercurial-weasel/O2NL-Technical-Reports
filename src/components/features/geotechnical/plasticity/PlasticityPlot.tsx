import React from "react";
import Plot from "react-plotly.js";
import { Atterbergs } from "@api/geotechnical/plasticity";

interface PlasticityPlotProps {
  data: Atterbergs[];
}

const PlasticityPlot: React.FC<PlasticityPlotProps> = ({ data }) => {
  const traces = data.map((sample) => ({
    x: [sample.liquid_limit],
    y: [sample.plasticity_index],
    mode: "markers+text",
    name: `${sample.sample_reference} (Depth: ${sample.depth_to}m)`,
    text: [sample.sample_reference],
    textposition: "top center",
    marker: { size: 10 },
  }));

  const shapes = [
    { type: "line", x0: 0, y0: 6, x1: 28, y1: 6, line: { color: "black", width: 2 } },
    { type: "line", x0: 28, y0: 6, x1: 120, y1: 75, line: { color: "black", width: 2 } },
    ...[35, 50, 70, 90].map((x) => ({
      type: "line", x0: x, y0: 0, x1: x, y1: 90, line: { color: "black", width: 1, dash: "dash" },
    })),
  ];

  const annotations = [
    { x: 8, y: 8, text: "A-Line" },
    { x: 18, y: 85, text: "Low Plasticity" },
    { x: 42.5, y: 86, text: "Intermediate" },
    { x: 42.5, y: 83, text: "Plasticity" },
    { x: 60, y: 85, text: "High Plasticity" },
    { x: 80, y: 86, text: "Very High" },
    { x: 80, y: 83, text: "Plasticity" },
    { x: 105, y: 85, text: "Very High Plasticity" },
    { x: 25, y: 15, text: "CL - ML" },
    { x: 43, y: 32, text: "CL or OL" },
    { x: 60, y: 42, text: "CH or OH" },
    { x: 43, y: 5, text: "ML or OL" },
    { x: 80, y: 32, text: "MH or OH" },
    { x: 133, y: 21, text: "Primary Letter" },
    { x: 130, y: 18, text: "M: Silt" },
    { x: 130.9, y: 15, text: "C: Clay" },
    { x: 133.5, y: 12, text: "O: Organics" },
    { x: 134.5, y: 6, text: "Secondary Letter" },
    { x: 138, y: 3, text: "L: of Low Plasticity" },
    { x: 138.3, y: 0, text: "H: of High Plasticity" },
  ].map((ann) => ({ x: ann.x, y: ann.y, text: ann.text, showarrow: false, font: { size: 10 } }));

  return (
    <Plot
      data={traces}
      layout={{
        title: "Atterberg Plasticity Chart",
        xaxis: { title: "Liquid Limit", range: [0, 120], showgrid: true, gridcolor: "lightgrey" },
        yaxis: { title: "Plasticity Index", range: [0, 90], showgrid: true, gridcolor: "lightgrey" },
        shapes,
        annotations,
        plot_bgcolor: "white",
        margin: { l: 50, r: 250, t: 50, b: 50 },
        legend: { title: "Test Samples" },
      }}
    />
  );
};

export default PlasticityPlot;
