import React from 'react';
import { TestData } from '@api/geotechnical/mdd/types';

interface SortConfig {
  key: keyof TestData;
  direction: 'ascending' | 'descending';
}

interface MDDTableViewProps {
  data: TestData[];
  sortConfig: SortConfig;
  requestSort: (key: keyof TestData) => void;
}

export const MDDTableView: React.FC<MDDTableViewProps> = ({ 
  data, 
  sortConfig, 
  requestSort 
}) => {
  // Helper to get sort direction indicator
  const getSortDirectionIndicator = (key: keyof TestData) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '';
  };

  // Render table column header with sort functionality
  const renderTableHeader = (title: string, key: keyof TestData) => {
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
            {renderTableHeader('Date Tested', 'date_tested')}
            {renderTableHeader('Date Checked', 'date_checked')}
            {renderTableHeader('Optimum Dry Density (Mg/m³)', 'optimum_dry_density')}
            {renderTableHeader('Optimum Water Content (%)', 'water_content')}
            {renderTableHeader('Natural Water Content (%)', 'natural_water_content')}
            {renderTableHeader('Test Method', 'test_type_method')}
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
              <td className="px-4 py-2 text-sm text-gray-700">{result.date_tested}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.date_checked}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.optimum_dry_density}</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.water_content}%</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.natural_water_content}%</td>
              <td className="px-4 py-2 text-sm text-gray-700">{result.test_type_method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
