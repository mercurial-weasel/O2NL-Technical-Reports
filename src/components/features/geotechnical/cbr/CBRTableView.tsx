import React, { useState } from 'react';
import { GeoCBR } from '@api/geotechnical/cbr';

interface SortConfig {
  key: keyof GeoCBR;
  direction: 'ascending' | 'descending';
}

interface CBRTableViewProps {
  data: GeoCBR[];
  sortConfig: SortConfig;
  requestSort: (key: keyof GeoCBR) => void;
}

export const CBRTableView: React.FC<CBRTableViewProps> = ({ 
  data, 
  sortConfig, 
  requestSort 
}) => {
  // State to track expanded rows
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Helper to get sort direction indicator
  const getSortDirectionIndicator = (key: keyof GeoCBR) => {
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
  const renderTableHeader = (title: string, key: keyof GeoCBR) => {
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
            {renderTableHeader('Sample ID', 'sample_id')}
            {renderTableHeader('Investigation ID', 'investigation_id')}
            {renderTableHeader('Depth (m)', 'depth_to')}
            {renderTableHeader('Geological Unit', 'geological_unit')}
            {renderTableHeader('CBR (%)', 'cbr_perc')}
            {renderTableHeader('Dry Density', 'dry_density')}
            {renderTableHeader('Water Content', 'water_content_compacted')}
            {renderTableHeader('Swell (%)', 'swell_perc')}
            <th className="px-4 py-2 text-sm font-medium text-gray-700 text-center">Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((result, index) => (
            <React.Fragment key={result.id || index}>
              <tr className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                <td className="px-4 py-2 text-sm text-gray-700">{result.sample_id}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.investigation_id}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.depth_to}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.geological_unit}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.cbr_perc !== null ? result.cbr_perc.toFixed(1) : 'N/A'}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.dry_density !== null ? result.dry_density.toFixed(3) : 'N/A'}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {result.water_content_compacted !== null ? result.water_content_compacted.toFixed(1) : 'N/A'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700">{result.swell_perc !== null ? result.swell_perc.toFixed(1) : 'N/A'}</td>
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
                        <p><span className="font-medium">Sample ID:</span> {result.sample_id}</p>
                        <p><span className="font-medium">Investigation ID:</span> {result.investigation_id}</p>
                        <p><span className="font-medium">Full Investigation ID:</span> {result.full_investigation_id}</p>
                        <p><span className="font-medium">Stage:</span> {result.o2nl_stage || 'N/A'}</p>
                        <p><span className="font-medium">Treatment:</span> {result.treatment || 'N/A'}</p>
                        <p><span className="font-medium">Surcharge Mass:</span> {result.surcharge_mass !== null ? `${result.surcharge_mass} kg` : 'N/A'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Test Results</h4>
                        <p><span className="font-medium">CBR (%):</span> {result.cbr_perc !== null ? result.cbr_perc.toFixed(1) : 'N/A'}</p>
                        <p><span className="font-medium">Penetration:</span> {result.penetration || 'N/A'}</p>
                        <p><span className="font-medium">Swell (%):</span> {result.swell_perc !== null ? result.swell_perc.toFixed(1) : 'N/A'}</p>
                        <p><span className="font-medium">Dry Density (t/m³):</span> {result.dry_density !== null ? result.dry_density.toFixed(3) : 'N/A'}</p>
                        <p><span className="font-medium">Bulk Density (t/m³):</span> {result.bulk_density !== null ? result.bulk_density.toFixed(3) : 'N/A'}</p>
                        <p><span className="font-medium">Water Content (Compacted) (%):</span> {result.water_content_compacted !== null ? result.water_content_compacted.toFixed(1) : 'N/A'}</p>
                        <p><span className="font-medium">Water Content (Plunger) (%):</span> {result.water_content_plunger !== null ? result.water_content_plunger.toFixed(1) : 'N/A'}</p>
                        <p><span className="font-medium">Oversize Material (%):</span> {result.oversize_material_perc !== null ? result.oversize_material_perc.toFixed(1) : 'N/A'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Location</h4>
                        <p><span className="font-medium">Depth To (m):</span> {result.depth_to.toFixed(2)}</p>
                        <p><span className="font-medium">Depth Bottom (m):</span> {result.depth_bottom.toFixed(2)}</p>
                        {result.RL && <p><span className="font-medium">RL:</span> {result.RL.toFixed(2)}</p>}
                        {result.sample_depth_RL && <p><span className="font-medium">Sample Depth RL:</span> {result.sample_depth_RL.toFixed(2)}</p>}
                        {result.chainage && <p><span className="font-medium">Chainage:</span> {result.chainage.toFixed(1)}</p>}
                        {result.geological_unit && <p><span className="font-medium">Geological Unit:</span> {result.geological_unit}</p>}
                        {result.latLng && (
                          <>
                            <p><span className="font-medium">Latitude:</span> {result.latLng[0].toFixed(6)}</p>
                            <p><span className="font-medium">Longitude:</span> {result.latLng[1].toFixed(6)}</p>
                          </>
                        )}
                      </div>
                      {result.remarks && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3">
                          <h4 className="font-semibold mb-2">Remarks</h4>
                          <p className="text-gray-700">{result.remarks}</p>
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
