export const boxPlotConfig = {
  displayModeBar: true,
  responsive: true,
  toImageButtonOptions: {
    format: 'png',
    filename: 'statistical_plot',
    height: 500,
    width: 700,
    scale: 2
  },
  modeBarButtonsToRemove: ['select2d', 'lasso2d', 'autoScale2d'],
  displaylogo: false
};

export const boxPlotLayout = {
  height: 400,
  margin: { l: 50, r: 20, t: 40, b: 50 },
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: { color: '#FFFFFF' }, // Updated to text-text-primary
  showlegend: false,
  xaxis: { 
    gridcolor: '#333', 
    zerolinecolor: '#333',
    showgrid: true,
    tickangle: -45,
    tickfont: { color: '#FFFFFF' }, // Updated to text-text-primary
    title: { font: { color: '#FFFFFF' } } // Updated to text-text-primary
  },
  yaxis: { 
    gridcolor: '#333', 
    zerolinecolor: '#333',
    showgrid: true,
    automargin: true,
    tickfont: { color: '#FFFFFF' }, // Updated to text-text-primary
    title: { font: { color: '#FFFFFF' } } // Updated to text-text-primary
  },
  modebar: {
    bgcolor: 'rgba(0,0,0,0)',
    color: '#FFFFFF', // Updated to text-text-primary
    activecolor: '#FFFFFF' // Updated to text-text-primary
  },
  autosize: true,
  title: {
    font: { color: '#FFFFFF' } // Updated to text-text-primary
  }
};