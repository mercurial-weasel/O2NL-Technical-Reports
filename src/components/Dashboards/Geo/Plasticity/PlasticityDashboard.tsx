import React, { useState, useEffect } from 'react';
import { fetchAtterbergsData, Atterbergs, AtterbergsFilters } from '@api/geotechnical/plasticity';
import PlasticityPlot from '@components/features/geotechnical/plasticity/PlasticityPlot';
import AtterbergsTable from '@components/features/geotechnical/plasticity/AtterbergsTable';
import AtterbergsFilterPanel from '@components/features/geotechnical/plasticity/AtterbergsFilters';
import PlasticityStats from '@components/features/geotechnical/plasticity/PlasticityStats';
import MapComponent from '@components/features/geotechnical/plasticity/MapComponent';
import DashboardLayout from './DashboardLayout';
import { LatLngBounds } from 'leaflet';
import proj4 from 'proj4';

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
    // Return a default location in New Zealand as fallback
    return [-41.2865, 174.7762]; // Wellington, NZ
  }
};

const PlasticityDashboard: React.FC = () => {
  const [atterbergsData, setAtterbergsData] = useState<Atterbergs[]>([]);
  const [filteredData, setFilteredData] = useState<Atterbergs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'table' | 'map'>('chart');
  const [attributeFilters, setAttributeFilters] = useState<AtterbergsFilters>({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeItem, setActiveItem] = useState<Atterbergs | null>(null);
  
  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const response = await fetchAtterbergsData();
        setAtterbergsData(response.data);
        setFilteredData(response.data);
      } catch (err) {
        console.error('Error loading Atterbergs data:', err);
        setError('Failed to load Atterberg limits data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    let filtered = [...atterbergsData];
    
    // Apply attribute filters
    if (attributeFilters.location_id) {
      filtered = filtered.filter(item => item.location_id === attributeFilters.location_id);
    }
    
    if (attributeFilters.adit_id) {
      filtered = filtered.filter(item => item.adit_id === attributeFilters.adit_id);
    }
    
    if (attributeFilters.sample_unique_id) {
      filtered = filtered.filter(item => item.sample_unique_id === attributeFilters.sample_unique_id);
    }
    
    if (attributeFilters.construction_subzone) {
      filtered = filtered.filter(item => item.construction_subzone === attributeFilters.construction_subzone);
    }
    
    setFilteredData(filtered);
  }, [atterbergsData, attributeFilters]);
  
  // Handle attribute filter changes
  const handleFilterChange = (filters: AtterbergsFilters) => {
    setAttributeFilters(filters);
  };
  
  // Handle item selection with different modes
  const handleItemSelect = (itemId: string, mode: 'add' | 'remove' | 'toggle') => {
    setSelectedItems(prevSelected => {
      const newSelected = new Set(prevSelected);
      
      if (mode === 'add') {
        newSelected.add(itemId);
      } else if (mode === 'remove') {
        newSelected.delete(itemId);
      } else if (mode === 'toggle') {
        if (newSelected.has(itemId)) {
          newSelected.delete(itemId);
        } else {
          newSelected.add(itemId);
        }
      }
      
      return newSelected;
    });
  };
  
  // Handle popup open in map view
  const handlePopupOpen = (item: Atterbergs) => {
    setActiveItem(item);
  };
  
  // Clear all selections
  const clearSelections = () => {
    setSelectedItems(new Set());
    setActiveItem(null);
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading Atterberg limits data...</div>;
  }
  
  if (error) {
    return <div className="text-red-600 p-4 text-center">{error}</div>;
  }
  
  return (
    <DashboardLayout title="Atterberg Limits Dashboard">
      <div className="p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Atterberg Limits Analysis</h1>
          <p className="text-gray-600">
            Analysis of soil plasticity characteristics based on Atterberg limits test data.
          </p>
        </div>
        
        <PlasticityStats data={filteredData} />
        
        <AtterbergsFilterPanel 
          data={atterbergsData} 
          onFilterChange={handleFilterChange}
          onClearSelections={clearSelections}
          selectedItemsCount={selectedItems.size}
        />
        
        {selectedItems.size > 0 && (
          <div className="bg-blue-50 p-3 mb-4 border border-blue-200 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {selectedItems.size} sample{selectedItems.size !== 1 ? 's' : ''} selected
              </span>
              <button
                className="px-2 py-1 bg-white border border-blue-300 rounded text-sm hover:bg-blue-50"
                onClick={clearSelections}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
        
        <div className="bg-white p-4 border border-gray-300 rounded-md">
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`py-2 px-4 ${activeTab === 'chart' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-600'}`}
              onClick={() => setActiveTab('chart')}
            >
              Plasticity Chart
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'map' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-600'}`}
              onClick={() => setActiveTab('map')}
            >
              Map View
            </button>
            <button
              className={`py-2 px-4 ${activeTab === 'table' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-600'}`}
              onClick={() => setActiveTab('table')}
            >
              Data Table
            </button>
          </div>
          
          <div className="mb-4">
            {filteredData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No data matches your current filter criteria. Try adjusting your filters.
              </div>
            ) : activeTab === 'chart' ? (
              <div className="w-full">
                <PlasticityPlot 
                  data={filteredData} 
                  selectedItems={selectedItems}
                  onItemSelect={handleItemSelect} 
                />
              </div>
            ) : activeTab === 'map' ? (
              <MapComponent 
                data={filteredData} 
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
                onPopupOpen={handlePopupOpen}
              />
            ) : (
              <AtterbergsTable 
                data={filteredData} 
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
              />
            )}
          </div>
        </div>
        
        <div className="mt-6 text-gray-500 text-sm">
          <h4 className="font-medium mb-1">About Atterberg Limits</h4>
          <p>
            Atterberg limits define the water content boundaries between different soil behavior states.
            The liquid limit (LL) is the water content at which soil transitions from plastic to liquid state.
            The plastic limit (PL) is the water content at which soil transitions from semi-solid to plastic state.
            The plasticity index (PI = LL - PL) indicates the range of water content in which the soil exhibits plastic behavior.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlasticityDashboard;
