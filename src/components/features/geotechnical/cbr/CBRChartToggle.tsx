import React from 'react';

export type CBRChartType = 'cbr-vs-property' | 'cbr-vs-chainage';

interface CBRChartToggleProps {
  currentChart: CBRChartType;
  setCurrentChart: (chart: CBRChartType) => void;
}

export const CBRChartToggle: React.FC<CBRChartToggleProps> = ({ currentChart, setCurrentChart }) => {
  return (
    <div className="flex justify-center mb-4">
      <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1" role="group">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
            currentChart === 'cbr-vs-property'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setCurrentChart('cbr-vs-property')}
        >
          CBR Trend Analysis
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
            currentChart === 'cbr-vs-chainage'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setCurrentChart('cbr-vs-chainage')}
        >
          CBR vs Chainage
        </button>
      </div>
    </div>
  );
};
