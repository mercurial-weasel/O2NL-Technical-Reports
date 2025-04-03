import React, { useState } from 'react';
import { GeoMDD } from '@api/geotechnical/mdd';

interface SortConfig {
  key: keyof GeoMDD;
  direction: 'ascending' | 'descending';
}

interface MDDTableViewProps {
  data: GeoMDD[];
  sortConfig: SortConfig;
  requestSort: (key: keyof GeoMDD) => void;
}

export const MDDTableView: React.FC<MDDTableViewProps> = ({ 
  data, 
  sortConfig, 
  requestSort 
}) => {
  // State to track expanded rows
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Helper to get sort direction indicator
  const getSortDirectionIndicator = (key: keyof GeoMDD) => {
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
  const renderTableHeader = (title: string, key: keyof GeoMDD) => {
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
            {renderTableHeader('Point ID', 'POINT_ID')}
            {renderTableHeader('Sample Ref', 'SAMPLE_REFERENCE')}
            {renderTableHeader('Sample Type', 'SAMPLE_TYPE')}
            {renderTableHeader('Depth (m)', 'SAMPLE_TOP')}
            {renderTableHeader('Specimen Ref', 'SPECIMEN_REFERENCE')}
            {renderTableHeader('Max Dry Density', 'DryDensity')}
            {renderTableHeader('NMC (%)', 'NMC')}
            {renderTableHeader('Date Tested', 'DateTested')}
            <th className="px-4 py-2 text-sm font-medium text-gray-700 text-center">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((result, index) => (
            <React.Fragment key={result.id || index}>
              <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                <td className="px-4 py-2 text-sm text-gray-700">{result.POINT_ID}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.SAMPLE_REFERENCE}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.SAMPLE_TYPE}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.SAMPLE_TOP}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.SPECIMEN_REFERENCE}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.DryDensity}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.NMC}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.DateTested}</td>
                <td className="px-4 py-2 text-center">
                  <button 
                    onClick={() => toggleRowExpansion(result.id)}
                    className="text-primary hover:text-primary-dark underline"
                  >
                    {expandedRow === result.id ? 'Hide' : 'Show'}
                  </button>
                </td>
              </tr>
              
              {/* Expanded details row */}
              {expandedRow === result.id && (
                <tr className="bg-gray-100">
                  <td colSpan={9} className="px-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Test Information</h4>
                        <p><span className="font-medium">Item:</span> {result.ITEM}</p>
                        <p><span className="font-medium">Sample ID:</span> {result.SAMPLE_ID}</p>
                        <p><span className="font-medium">MC (%):</span> {result.MC}</p>
                        <p><span className="font-medium">Sample Type:</span> {result.SAMPLE_TYPE}</p>
                        <p><span className="font-medium">Method:</span> {result.Method}</p>
                        <p><span className="font-medium">Method Name:</span> {result.MethodName}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Dates</h4>
                        <p><span className="font-medium">Sampled:</span> {result.DateSampled}</p>
                        <p><span className="font-medium">Tested:</span> {result.DateTested}</p>
                        <p><span className="font-medium">Checked:</span> {result.DateChecked}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Location</h4>
                        {result.x && result.y && (
                          <>
                            <p><span className="font-medium">NZTM X:</span> {Number(result.x).toFixed(4)}</p>
                            <p><span className="font-medium">NZTM Y:</span> {Number(result.y).toFixed(4)}</p>
                          </>
                        )}
                        {result.latLng && (
                          <>
                            <p><span className="font-medium">Latitude:</span> {result.latLng[0].toFixed(6)}</p>
                            <p><span className="font-medium">Longitude:</span> {result.latLng[1].toFixed(6)}</p>
                          </>
                        )}
                        {result.chainage && <p><span className="font-medium">Chainage:</span> {result.chainage}</p>}
                        {result.distance_to_alignment && <p><span className="font-medium">Distance to Alignment:</span> {result.distance_to_alignment.toFixed(2)}</p>}
                        {result.angle_to_alignment_deg_cc && <p><span className="font-medium">Angle to Alignment:</span> {result.angle_to_alignment_deg_cc.toFixed(2)}°</p>}
                        {result.geological_unit && <p><span className="font-medium">Geological Unit:</span> {result.geological_unit}</p>}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">MDD Results</h4>
                        <div className="max-h-60 overflow-y-auto">
                          <table className="min-w-full text-xs border border-gray-200">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="border border-gray-200 px-2 py-1">Test No</th>
                                <th className="border border-gray-200 px-2 py-1">Water Content (%)</th>
                                <th className="border border-gray-200 px-2 py-1">Dry Density (t/m³)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.mdd_results && result.mdd_results.map((mddResult, idx) => (
                                <tr key={idx}>
                                  <td className="border border-gray-200 px-2 py-1">{mddResult.test_no}</td>
                                  <td className="border border-gray-200 px-2 py-1">{mddResult.water_content}</td>
                                  <td className="border border-gray-200 px-2 py-1">{mddResult.dry_density}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      {result.Remarks && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                          <h4 className="font-semibold mb-2">Remarks</h4>
                          <p className="text-gray-700">{result.Remarks}</p>
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
