import React from 'react';
import { Atterbergs, getSoilClassification } from '@api/geotechnical/plasticity';

interface AtterbergsTableProps {
  data: Atterbergs[];
}

const AtterbergsTable: React.FC<AtterbergsTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">No Atterberg limits data available</div>;
  }

  return (
    <div className="overflow-auto">
      <table className="min-w-full border border-gray-300 divide-y divide-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Location</th>
            <th className="px-4 py-2 text-left">Depth (m)</th>
            <th className="px-4 py-2 text-left">Sample Ref</th>
            <th className="px-4 py-2 text-right">Liquid Limit</th>
            <th className="px-4 py-2 text-right">Plastic Limit</th>
            <th className="px-4 py-2 text-right">Plasticity Index</th>
            <th className="px-4 py-2 text-right">Water Content</th>
            <th className="px-4 py-2 text-left">Classification</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {data.map((sample, index) => (
            <tr key={sample.sample_unique_id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="px-4 py-2">{sample.location_id}</td>
              <td className="px-4 py-2">{sample.depth_to.toFixed(1)}</td>
              <td className="px-4 py-2">{sample.sample_reference}</td>
              <td className="px-4 py-2 text-right">{sample.liquid_limit}</td>
              <td className="px-4 py-2 text-right">{sample.plastic_limit}</td>
              <td className="px-4 py-2 text-right">{sample.plasticity_index}</td>
              <td className="px-4 py-2 text-right">{sample.water_content}</td>
              <td className="px-4 py-2">{getSoilClassification(sample)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AtterbergsTable;
