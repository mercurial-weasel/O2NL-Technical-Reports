import React from 'react';

export type MDDChartType = 'moisture-chainage' | 'moisture-depth' | 'moisture-density';

interface MDDChartToggleProps {
  currentChart: MDDChartType;
  setCurrentChart: (chart: MDDChartType) => void;
}

export const MDDChartToggle: React.FC<MDDChartToggleProps> = ({ currentChart, setCurrentChart }) => {
  return (
    <div className="flex justify-center mb-4">
      <div className="inline-flex rounded-md shadow-sm bg-gray-100 p-1" role="group">
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
            currentChart === 'moisture-chainage'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setCurrentChart('moisture-chainage')}
        >
          Moisture vs Chainage
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium ${
            currentChart === 'moisture-depth'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setCurrentChart('moisture-depth')}
        >
          Moisture vs Depth
        </button>
        <button
          type="button"
          className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
            currentChart === 'moisture-density'
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setCurrentChart('moisture-density')}
        >
          Moisture vs Dry Density
        </button>
      </div>
    </div>
  );
};
