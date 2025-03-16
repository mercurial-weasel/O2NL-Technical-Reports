import React, { useState } from 'react';
import { Atterbergs, getSoilClassification } from '@api/geotechnical/plasticity';
import proj4 from 'proj4';

interface AtterbergsTableProps {
  data: Atterbergs[];
  selectedItems: Set<string>;
  onItemSelect: (itemId: string, mode: 'add' | 'remove' | 'toggle') => void;
}

// Set up coordinate system definitions
// NZTM2000 (EPSG:2193) definition
proj4.defs('EPSG:2193', '+proj=tmerc +lat_0=0 +lon_0=173 +k=0.9996 +x_0=1600000 +y_0=10000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs +type=crs');

// Function to convert NZTM2000 coordinates to WGS84 latitude/longitude
const convertNZTM2000ToLatLng = (x: number, y: number): [number, number] => {
  try {
    // proj4 expects [x, y] and returns [longitude, latitude]
    const [lng, lat] = proj4('EPSG:2193', 'EPSG:4326', [x, y]);
    return [lat, lng]; // Return as [lat, lng] for Leaflet
  } catch (error) {
    console.error('Error converting coordinates:', error);
    return [0, 0]; // Return zeros as fallback
  }
};

const AtterbergsTable: React.FC<AtterbergsTableProps> = ({ data, selectedItems, onItemSelect }) => {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  
  if (!data || data.length === 0) {
    return <div className="text-center py-4">No Atterberg limits data available</div>;
  }

  const toggleRowExpansion = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  const handleRowClick = (id: string, e: React.MouseEvent) => {
    if (e.shiftKey) {
      // Shift+Click: Add to selection
      onItemSelect(id, 'add');
      e.preventDefault();
    } else if (e.ctrlKey || e.metaKey) {
      // Ctrl/Cmd+Click: Remove from selection
      onItemSelect(id, 'remove');
      e.preventDefault();
    }
    // Normal click handled by the Details button
  };

  return (
    <div className="overflow-auto">
      <div className="mb-3 bg-blue-50 p-2 rounded text-sm">
        <p>
          <span className="font-medium">Tip:</span> Use Shift+Click on a row to add to selection, or Ctrl+Click to remove from selection
        </p>
      </div>
      
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
            <th className="px-4 py-2 text-center">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300">
          {data.map((sample, index) => {
            // Calculate WGS84 coordinates for display in the details panel
            const [lat, lng] = sample.latLng || [0, 0];
            
            // Check if this sample is in the selected items
            const isSelected = selectedItems.has(sample.sample_unique_id);
            
            return (
              <React.Fragment key={sample.sample_unique_id || index}>
                <tr 
                  className={`${isSelected ? 'bg-green-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}
                  onClick={(e) => handleRowClick(sample.sample_unique_id, e)}
                  style={{ cursor: 'pointer' }}
                >
                  <td className="px-4 py-2">{sample.location_id}</td>
                  <td className="px-4 py-2">{sample.depth_to.toFixed(1)}</td>
                  <td className="px-4 py-2">{sample.sample_reference}</td>
                  <td className="px-4 py-2 text-right">{sample.liquid_limit}</td>
                  <td className="px-4 py-2 text-right">{sample.plastic_limit}</td>
                  <td className="px-4 py-2 text-right">{sample.plasticity_index}</td>
                  <td className="px-4 py-2 text-right">{sample.water_content}</td>
                  <td className="px-4 py-2">{getSoilClassification(sample)}</td>
                  <td className="px-4 py-2 text-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRowExpansion(sample.sample_unique_id);
                      }}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {expandedRow === sample.sample_unique_id ? 'Hide' : 'Show'}
                    </button>
                  </td>
                </tr>
                {expandedRow === sample.sample_unique_id && (
                  <tr className="bg-gray-100">
                    <td colSpan={9} className="px-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">Test Information</h4>
                          <p><span className="font-medium">Test Type:</span> {sample.test_type_name}</p>
                          <p><span className="font-medium">Method:</span> {sample.test_type_method}</p>
                          <p><span className="font-medium">AGS Code:</span> {sample.ags_code}</p>
                          <p><span className="font-medium">Test No:</span> {sample.test_no}</p>
                          <p><span className="font-medium">Display Name:</span> {sample.display_name}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Sample Information</h4>
                          <p><span className="font-medium">Adit ID:</span> {sample.adit_id}</p>
                          <p><span className="font-medium">Sample Type:</span> {sample.sample_type}</p>
                          <p><span className="font-medium">Unique ID:</span> {sample.sample_unique_id}</p>
                          <p><span className="font-medium">Date Sampled:</span> {sample.date_sampled}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Test Dates</h4>
                          <p><span className="font-medium">Tested:</span> {sample.date_tested}</p>
                          <p><span className="font-medium">Checked:</span> {sample.date_checked}</p>
                          <p><span className="font-medium">Approved:</span> {sample.date_approved || 'Not approved'}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Location</h4>
                          <p><span className="font-medium">NZTM X:</span> {sample.x_coordinate.toFixed(4)}</p>
                          <p><span className="font-medium">NZTM Y:</span> {sample.y_coordinate.toFixed(4)}</p>
                          {sample.latLng && (
                            <>
                              <p><span className="font-medium">Latitude:</span> {sample.latLng[0].toFixed(6)}</p>
                              <p><span className="font-medium">Longitude:</span> {sample.latLng[1].toFixed(6)}</p>
                            </>
                          )}
                          <p><span className="font-medium">Chainage:</span> {sample.chainage}</p>
                          <p><span className="font-medium">Distance to Alignment:</span> {sample.distance_to_alignment.toFixed(2)}</p>
                          <p><span className="font-medium">Angle to Alignment:</span> {sample.angle_to_alignment_deg_cc.toFixed(2)}°</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Construction</h4>
                          <p><span className="font-medium">Subzone:</span> {sample.construction_subzone}</p>
                        </div>
                        {sample.remark_dot_test_remarks && (
                          <div className="col-span-1 md:col-span-2 lg:col-span-3">
                            <h4 className="font-semibold mb-2">Remarks</h4>
                            <p>{sample.remark_dot_test_remarks}</p>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AtterbergsTable;
