import React from 'react';
import { ParticleSizeDistributionTest } from '@api/geotechnical/psd';

interface SortConfig {
  key: keyof ParticleSizeDistributionTest;
  direction: 'ascending' | 'descending';
}

interface PSDTableViewProps {
  data: ParticleSizeDistributionTest[];
  sortConfig: SortConfig;
  requestSort: (key: keyof ParticleSizeDistributionTest) => void;
}

export const PSDTableView: React.FC<PSDTableViewProps> = ({ 
  data, 
  sortConfig, 
  requestSort 
}) => {
  // Helper to get sort direction indicator
  const getSortDirectionIndicator = (key: keyof ParticleSizeDistributionTest) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '';
  };

  // Render table column header with sort functionality
  const renderTableHeader = (title: string, key: keyof ParticleSizeDistributionTest) => {
    return (
      <th 
        className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
        onClick={() => requestSort(key)}
      >
        {title} {getSortDirectionIndicator(key)}
      </th>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {renderTableHeader('Adit ID', 'adit_id')}
            {renderTableHeader('Location ID', 'location_id')}
            {renderTableHeader('Sample Ref', 'sample_reference')}
            {renderTableHeader('Sample Type', 'sample_type')}
            {renderTableHeader('Sample ID', 'sample_unique_id')}
            {renderTableHeader('Test No', 'test_no')}
            {renderTableHeader('Depth (m)', 'depth_to')}
            {renderTableHeader('Date Sampled', 'date_sampled')}
            {renderTableHeader('Date Tested', 'date_tested')}
            {renderTableHeader('Date Checked', 'date_checked')}
            {renderTableHeader('Water Content', 'average_water_content')}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((result) => (
            <tr key={result.sample_unique_id} className="hover:bg-gray-50">
              <td className="px-4 py-2 text-sm text-gray-700">{result.adit_id}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.location_id}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.sample_reference}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.sample_type}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.sample_unique_id}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.test_no}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.depth_to}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.date_sampled}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.date_tested}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.date_checked}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.average_water_content}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
