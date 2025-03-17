import React, { useState } from 'react';
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
  // State to track expanded rows
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Helper to get sort direction indicator
  const getSortDirectionIndicator = (key: keyof ParticleSizeDistributionTest) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '▲' : '▼';
    }
    return '';
  };

  // Toggle row expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
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

  if (data.length === 0) {
    return <div className="text-center py-4">No data available</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {renderTableHeader('Adit ID', 'adit_id')}
            {renderTableHeader('Location ID', 'location_id')}
            {renderTableHeader('Sample Ref', 'sample_reference')}
            {renderTableHeader('Sample Type', 'sample_type')}
            {renderTableHeader('Depth (m)', 'depth_to')}
            {renderTableHeader('Water Content', 'average_water_content')}
            {renderTableHeader('Subzone', 'construction_subzone')}
            {renderTableHeader('Date Tested', 'date_tested')}
            <th className="px-4 py-2 text-sm font-medium text-gray-700 text-center">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((result, index) => (
            <React.Fragment key={result.sample_unique_id || index}>
              <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                <td className="px-4 py-2 text-sm text-gray-700">{result.adit_id}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.location_id}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.sample_reference}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.sample_type}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.depth_to}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.average_water_content}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.construction_subzone}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.date_tested}</td>
                <td className="px-4 py-2 text-center">
                  <button 
                    onClick={() => toggleRowExpansion(result.sample_unique_id)}
                    className="text-primary hover:text-primary-dark underline"
                  >
                    {expandedRow === result.sample_unique_id ? 'Hide' : 'Show'}
                  </button>
                </td>
              </tr>
              
              {/* Expanded details row */}
              {expandedRow === result.sample_unique_id && (
                <tr className="bg-gray-100">
                  <td colSpan={9} className="px-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Test Information</h4>
                        <p><span className="font-medium">Test No:</span> {result.test_no}</p>
                        <p><span className="font-medium">Sample ID:</span> {result.sample_unique_id}</p>
                        <p><span className="font-medium">Water Content:</span> {result.average_water_content}</p>
                        <p><span className="font-medium">Sample Type:</span> {result.sample_type}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Dates</h4>
                        <p><span className="font-medium">Sampled:</span> {result.date_sampled}</p>
                        <p><span className="font-medium">Tested:</span> {result.date_tested}</p>
                        <p><span className="font-medium">Checked:</span> {result.date_checked}</p>
                        <p><span className="font-medium">Approved:</span> {result.date_approved}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Location</h4>
                        <p><span className="font-medium">NZTM X:</span> {result.x_coordinate.toFixed(4)}</p>
                        <p><span className="font-medium">NZTM Y:</span> {result.y_coordinate.toFixed(4)}</p>
                        {result.latLng && (
                          <>
                            <p><span className="font-medium">Latitude:</span> {result.latLng[0].toFixed(6)}</p>
                            <p><span className="font-medium">Longitude:</span> {result.latLng[1].toFixed(6)}</p>
                          </>
                        )}
                        <p><span className="font-medium">Chainage:</span> {result.chainage}</p>
                        <p><span className="font-medium">Distance to Alignment:</span> {result.distance_to_alignment.toFixed(2)}</p>
                        <p><span className="font-medium">Angle to Alignment:</span> {result.angle_to_alignment_deg_cc.toFixed(2)}°</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Particle Size Results</h4>
                        <div className="max-h-60 overflow-y-auto">
                          <table className="min-w-full text-xs border border-gray-200">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-200 px-2 py-1">Size (mm)</th>
                                <th className="border border-gray-200 px-2 py-1">% Passing</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.particle_size_result.map((psd, idx) => (
                                <tr key={idx}>
                                  <td className="border border-gray-200 px-2 py-1">{psd.sieve_size_mm}</td>
                                  <td className="border border-gray-200 px-2 py-1">{psd.percent_passing}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {result.remark_dot_test_remarks && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                          <h4 className="font-semibold mb-2">Remarks</h4>
                          <p className="text-gray-700">{result.remark_dot_test_remarks}</p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
