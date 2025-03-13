import React, { useState, useEffect } from 'react';
import { fetchAtterbergsData, Atterbergs, AtterbergsFilters } from '@api/geotechnical/plasticity';
import PlasticityPlot from '@components/features/geotechnical/plasticity/PlasticityPlot';
import AtterbergsTable from '@components/features/geotechnical/plasticity/AtterbergsTable';
import AtterbergsFilterPanel from '@components/features/geotechnical/plasticity/AtterbergsFilters';
import PlasticityStats from '@components/features/geotechnical/plasticity/PlasticityStats';
import DashboardLayout from './DashboardLayout';

const PlasticityDashboard: React.FC = () => {
  const [atterbergsData, setAtterbergsData] = useState<Atterbergs[]>([]);
  const [filteredData, setFilteredData] = useState<Atterbergs[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');
  
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
  
  // Handle filter changes
  const handleFilterChange = (filters: AtterbergsFilters) => {
    let filtered = [...atterbergsData];
    
    if (filters.location_id) {
      filtered = filtered.filter(item => item.location_id === filters.location_id);
    }
    
    if (filters.adit_id) {
      filtered = filtered.filter(item => item.adit_id === filters.adit_id);
    }
    
    if (filters.sample_unique_id) {
      filtered = filtered.filter(item => item.sample_unique_id === filters.sample_unique_id);
    }
    
    setFilteredData(filtered);
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
        
        <AtterbergsFilterPanel data={atterbergsData} onFilterChange={handleFilterChange} />
        
        <div className="bg-white p-4 border border-gray-300 rounded-md">
          <div className="flex border-b border-gray-200 mb-4">
            <button
              className={`py-2 px-4 ${activeTab === 'chart' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-600'}`}
              onClick={() => setActiveTab('chart')}
            >
              Plasticity Chart
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
                <PlasticityPlot data={filteredData} />
              </div>
            ) : (
              <AtterbergsTable data={filteredData} />
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
