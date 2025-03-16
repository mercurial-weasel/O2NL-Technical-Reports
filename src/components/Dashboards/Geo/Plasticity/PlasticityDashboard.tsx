import React, { useState, useEffect } from 'react';
import { fetchAtterbergsData, Atterbergs, AtterbergsFilters } from '@api/geotechnical/plasticity';
import PlasticityPlot from '@components/features/geotechnical/plasticity/PlasticityPlot';
import AtterbergsTable from '@components/features/geotechnical/plasticity/AtterbergsTable';
import AtterbergsFilterPanel from '@components/features/geotechnical/plasticity/AtterbergsFilters';
import PlasticityStats from '@components/features/geotechnical/plasticity/PlasticityStats';
import MapComponent from '@components/features/geotechnical/plasticity/MapComponent';
import { Header } from '@common/Header/Header';
import { Footer } from '@common/Footer/Footer';
import { Section } from '@common/Section/Section';
import { Card } from '@common/Card/Card';
import { ViewModeToggle } from '@common/ViewModeToggle/ViewModeToggle';
import { DashboardHeader } from '@features/geotechnical/common/DashboardHeader';

const PlasticityDashboard: React.FC = () => {
  const [atterbergsData, setAtterbergsData] = useState<Atterbergs[]>([]);
  const [filteredData, setFilteredData] = useState<Atterbergs[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chart' | 'table' | 'map'>('chart');
  const [attributeFilters, setAttributeFilters] = useState<AtterbergsFilters>({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [activeItem, setActiveItem] = useState<Atterbergs | null>(null);
  const [lastLoadTime, setLastLoadTime] = useState<Date | null>(null);
  
  // Load data
  useEffect(() => {
    loadData();
  }, []);
  
  // Function to load data (also used for reload)
  const loadData = async () => {
    try {
      setLoading(true);
      setIsReloading(true);
      const response = await fetchAtterbergsData();
      setAtterbergsData(response.data);
      setFilteredData(response.data);
      setLastLoadTime(new Date());
      setError(null);
    } catch (err) {
      console.error('Error loading Atterbergs data:', err);
      setError('Failed to load Atterberg limits data. Please try again later.');
    } finally {
      setLoading(false);
      setIsReloading(false);
    }
  };
  
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
  
  // Handle tab change using ViewModeToggle
  const handleViewModeChange = (mode: 'chart' | 'table' | 'map') => {
    // No need to transform 'calendar' to 'map' anymore
    setActiveTab(mode as 'chart' | 'table' | 'map');
  };
  
  return (
    <div className="min-h-screen bg-background-base flex flex-col">
      <Header />
      
      <div className="pt-24 pb-16">
        <Section>
          <DashboardHeader
            title="Atterberg Limits Dashboard"
            backTo="/geotechnical"
            backText="Back to Geotechnical Tests"
            isLoading={loading}
            isReloading={isReloading}
            lastLoadTime={lastLoadTime}
            onReload={loadData}
            error={error}
          />
          
          {!error && (
            <>
              <div className="mb-6">
                <PlasticityStats data={filteredData} />
              </div>
              
              <Card title="Plasticity Data Analysis">
                <AtterbergsFilterPanel 
                  data={atterbergsData} 
                  onFilterChange={handleFilterChange}
                  onClearSelections={clearSelections}
                  selectedItemsCount={selectedItems.size}
                />
                
                {selectedItems.size > 0 && (
                  <div className="px-4 py-3 mb-4 bg-brand-primary/10 border-t border-b border-brand-primary/20">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-text-primary">
                        {selectedItems.size} sample{selectedItems.size !== 1 ? 's' : ''} selected
                      </span>
                      <button
                        className="px-2 py-1 bg-white border border-brand-primary/30 rounded text-sm hover:bg-gray-50 text-text-primary"
                        onClick={clearSelections}
                      >
                        Clear Selection
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="px-4 border-t border-border-primary">
                  <div className="py-4 flex justify-between items-center">
                    <h3 className="font-medium text-text-primary">View Options</h3>
                    
                    <ViewModeToggle 
                      mode={activeTab} // No transformation needed
                      onChange={handleViewModeChange}
                    />
                  </div>
                  
                  <div className="mb-4">
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-brand-primary border-t-transparent mb-2"></div>
                          <p className="text-text-secondary">Loading Atterberg limits data...</p>
                        </div>
                      </div>
                    ) : filteredData.length === 0 ? (
                      <div className="text-center py-8 text-text-secondary bg-background-card-from/50 rounded-lg border border-border-primary">
                        <p>No data matches your current filter criteria.</p>
                        <p className="text-sm mt-2">Try adjusting your filters or clearing the selection.</p>
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
                
                <div className="px-4 py-3 border-t border-border-primary text-text-secondary text-sm">
                  <h4 className="font-medium mb-1 text-text-primary">About Atterberg Limits</h4>
                  <p>
                    Atterberg limits define the water content boundaries between different soil behavior states.
                    The liquid limit (LL) is the water content at which soil transitions from plastic to liquid state.
                    The plastic limit (PL) is the water content at which soil transitions from semi-solid to plastic state.
                    The plasticity index (PI = LL - PL) indicates the range of water content in which the soil exhibits plastic behavior.
                  </p>
                </div>
              </Card>
            </>
          )}
        </Section>
        <Footer />
      </div>
    </div>
  );
};

export default PlasticityDashboard;
