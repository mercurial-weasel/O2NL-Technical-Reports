import React from 'react';
import { Atterbergs } from '@api/geotechnical/plasticity';

interface StatsProps {
  data: Atterbergs[];
}

// Helper function to calculate statistics
const calculateStats = (values: number[]) => {
  if (values.length === 0) return { min: 0, max: 0, avg: 0 };
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = Number((sum / values.length).toFixed(1));
  
  return { min, max, avg };
};

const PlasticityStats: React.FC<StatsProps> = ({ data }) => {
  // Calculate statistics
  const llValues = data.map(item => item.liquid_limit);
  const piValues = data.map(item => item.plasticity_index);
  const plValues = data.map(item => item.plastic_limit);
  const wcValues = data.map(item => item.water_content);
  
  const llStats = calculateStats(llValues);
  const piStats = calculateStats(piValues);
  const plStats = calculateStats(plValues);
  const wcStats = calculateStats(wcValues);
  
  const locationCount = new Set(data.map(item => item.location_id)).size;
  
  // Style for stat cards
  const statCardClass = "bg-white p-4 rounded-md border border-gray-300 shadow-sm";
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className={statCardClass}>
        <h3 className="text-lg font-medium mb-2">Liquid Limit (LL)</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm text-gray-500">Min</div>
            <div className="text-xl font-bold">{llStats.min}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Max</div>
            <div className="text-xl font-bold">{llStats.max}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Avg</div>
            <div className="text-xl font-bold">{llStats.avg}</div>
          </div>
        </div>
      </div>
      
      <div className={statCardClass}>
        <h3 className="text-lg font-medium mb-2">Plasticity Index (PI)</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm text-gray-500">Min</div>
            <div className="text-xl font-bold">{piStats.min}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Max</div>
            <div className="text-xl font-bold">{piStats.max}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Avg</div>
            <div className="text-xl font-bold">{piStats.avg}</div>
          </div>
        </div>
      </div>
      
      <div className={statCardClass}>
        <h3 className="text-lg font-medium mb-2">Plastic Limit (PL)</h3>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm text-gray-500">Min</div>
            <div className="text-xl font-bold">{plStats.min}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Max</div>
            <div className="text-xl font-bold">{plStats.max}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Avg</div>
            <div className="text-xl font-bold">{plStats.avg}</div>
          </div>
        </div>
      </div>
      
      <div className={statCardClass}>
        <h3 className="text-lg font-medium mb-2">Summary</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="text-sm text-gray-500">Locations</div>
            <div className="text-xl font-bold">{locationCount}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Samples</div>
            <div className="text-xl font-bold">{data.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlasticityStats;
