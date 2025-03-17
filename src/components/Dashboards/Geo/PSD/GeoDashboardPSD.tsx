import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '@common/Header/Header';
import { Footer } from '@common/Footer/Footer';
import { Section } from '@common/Section/Section';
import { Card } from '@common/Card/Card';

// Import components
import { DashboardHeader } from '@features/geotechnical/common/DashboardHeader';
import { PSDFilterControls } from '@features/geotechnical/psd/PSDFilterControls';
import { PSDFilterSummary } from '@features/geotechnical/psd/PSDFilterSummary';
import { PSDTableView } from '@features/geotechnical/psd/PSDTableView';
import { PSDChartView } from '@features/geotechnical/psd/PSDChartView';
import PSDMap from '@features/geotechnical/psd/PSDMap';
import { usePSDData } from '@features/geotechnical/psd/hooks/usePSDData';
import { DepthRangeSlider } from '@features/geotechnical/common/DepthRangeSlider';

// Import types
import { ParticleSizeDistributionTest } from '@api/geotechnical/psd';

// Define view modes
type ViewMode = 'chart' | 'table' | 'map';

// Define sort configuration
interface SortConfig {
  key: keyof ParticleSizeDistributionTest;
  direction: 'ascending' | 'descending';
}

function GeoDashboardPSD() {
  // Load data using custom hook
  const {
    data,
    isReloading,
    handleReload,
    uniqueAditIds,
    uniqueLocationIds,
    uniqueSampleTypes
  } = usePSDData();
  
  // State for filters
  const [selectedAditIds, setSelectedAditIds] = useState<string[]>([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [selectedSampleType, setSelectedSampleType] = useState<string>('');
  const [selectedSubzones, setSelectedSubzones] = useState<string[]>([]); // Changed from string to string[]
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  // Calculate min and max depth from actual data
  const [minDepth, setMinDepth] = useState<number>(0);
  const [maxDepth, setMaxDepth] = useState<number>(40);
  const [depthRange, setDepthRange] = useState<[number, number]>([0, 40]);
  
  // Scan dataset for actual min and max depths when data loads
  useEffect(() => {
    if (data.psdResults && data.psdResults.length > 0) {
      // Extract all depth_to values from the dataset
      const depths = data.psdResults.map(result => 
        typeof result.depth_to === 'number' ? result.depth_to : parseFloat(String(result.depth_to))
      ).filter(depth => !isNaN(depth)); // Filter out any NaN values
      
      if (depths.length > 0) {
        // Calculate min and max, with floor/ceil to get clean values
        const calculatedMinDepth = Math.floor(Math.min(...depths));
        const calculatedMaxDepth = Math.ceil(Math.max(...depths));
        
        // Update state values
        setMinDepth(calculatedMinDepth);
        setMaxDepth(calculatedMaxDepth);
        
        // Reset the depth range filter to match the actual data range
        setDepthRange([calculatedMinDepth, calculatedMaxDepth]);
        
        console.log(`Depth range in dataset: ${calculatedMinDepth} to ${calculatedMaxDepth}`);
      }
    }
  }, [data.psdResults]);
  
  // State for view mode and sorting
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'sample_reference',
    direction: 'ascending'
  });

  // Get unique construction subzones
  const uniqueSubzones = useMemo(() => {
    if (!data.psdResults || data.psdResults.length === 0) return [];
    return [...new Set(data.psdResults.map(item => item.construction_subzone))]
      .filter(Boolean)
      .sort();
  }, [data.psdResults]);

  // Reset all filters - now uses calculated depth bounds
  const handleResetFilters = () => {
    setSelectedAditIds([]);
    setSelectedLocationIds([]);
    setSelectedSampleType('');
    setSelectedSubzones([]); // Reset subzone filter (now an array)
    setDepthRange([minDepth, maxDepth]); // Reset to calculated min/max depths
  };

  // Handle item selection for map markers
  const handleItemSelect = (itemId: string, mode: 'add' | 'remove' | 'toggle') => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (mode === 'add') {
        newSet.add(itemId);
      } else if (mode === 'remove') {
        newSet.delete(itemId);
      } else {
        // toggle
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
      }
      return newSet;
    });
  };

  // Sort function for table data
  const requestSort = (key: keyof ParticleSizeDistributionTest) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter PSD results based on selected filters
  const filteredPSDResults = useMemo(() => {
    // Handle case when data is not yet loaded
    const results = data.psdResults || [];
    
    if (results.length === 0) {
      return [];
    }

    let filtered = [...results];

    if (selectedAditIds.length > 0) {
      filtered = filtered.filter(result => selectedAditIds.includes(result.adit_id));
    }

    if (selectedLocationIds.length > 0) {
      filtered = filtered.filter(result => selectedLocationIds.includes(result.location_id));
    }

    if (selectedSampleType) {
      filtered = filtered.filter(result => result.sample_type === selectedSampleType);
    }

    // Add construction subzone filter
    if (selectedSubzones.length > 0) {
      filtered = filtered.filter(result => selectedSubzones.includes(result.construction_subzone));
    }

    // Filter by depth range
    filtered = filtered.filter(
      result => {
        // Safe conversion to number with fallback
        const depth = typeof result.depth_to === 'number' 
          ? result.depth_to 
          : parseFloat(String(result.depth_to));
        
        return !isNaN(depth) && depth >= depthRange[0] && depth <= depthRange[1];
      }
    );

    return filtered;
  }, [data.psdResults, selectedAditIds, selectedLocationIds, selectedSampleType, selectedSubzones, depthRange]);

  // Apply sorting to filtered results for table view
  const sortedPSDResults = useMemo(() => {
    if (!filteredPSDResults.length) return [];
    
    let sortableItems = [...filteredPSDResults];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredPSDResults, sortConfig]);

  // Transform PSD results for the plot component
  const plotData = useMemo(() => {
    return filteredPSDResults.map(result => ({
      sample_id: result.sample_unique_id,
      sample_reference: result.sample_reference,
      point_id: result.location_id,
      depth_from: 0, // Not available in the original data, using default
      depth_to: result.depth_to,
      test_date: result.date_tested,
      material: result.sample_type,
      particle_size_result: result.particle_size_result
    }));
  }, [filteredPSDResults]);

  // Show loading state or error if data is not ready
  if (data.isLoading) {
    return (
      <div className="min-h-screen bg-background-base flex flex-col">
        <Header />
        <div className="pt-24">
          <Section>
            <Card>
              <div className="flex justify-center items-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                <span className="ml-3">Loading data...</span>
              </div>
            </Card>
          </Section>
        </div>
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="min-h-screen bg-background-base flex flex-col">
        <Header />
        <div className="pt-24">
          <Section>
            <Card>
              <div className="p-6 text-center">
                <h2 className="text-xl text-red-600 mb-4">Error loading data</h2>
                <p>{String(data.error)}</p>
                <button 
                  onClick={handleReload}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                >
                  Retry
                </button>
              </div>
            </Card>
          </Section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-base flex flex-col">
      <Header />
      
      <div className="pt-24">
        <Section>
          <DashboardHeader 
            title="Particle Size Distribution Dashboard"
            backTo="/geotechnical"
            backText="Back to Geotechnical Tests"
            isLoading={data.isLoading}
            isReloading={isReloading}
            lastLoadTime={data.lastLoadTime}
            onReload={handleReload}
            error={data.error}
          />

          {/* Main Content */}
          <Card title="Particle Size Distribution Analysis">
            {/* Filter controls */}
            <PSDFilterControls
              uniqueAditIds={uniqueAditIds || []}
              uniqueLocationIds={uniqueLocationIds || []}
              uniqueSampleTypes={uniqueSampleTypes || []}
              uniqueSubzones={uniqueSubzones}
              selectedAditIds={selectedAditIds}
              setSelectedAditIds={setSelectedAditIds}
              selectedLocationIds={selectedLocationIds}
              setSelectedLocationIds={setSelectedLocationIds}
              selectedSampleType={selectedSampleType}
              setSelectedSampleType={setSelectedSampleType}
              selectedSubzones={selectedSubzones}
              setSelectedSubzones={setSelectedSubzones}
              handleResetFilters={handleResetFilters}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />
            
            {/* Depth Range Slider with dynamic min/max based on dataset */}
            <div className="px-4 py-3 border-t border-gray-200">
              <DepthRangeSlider
                minDepth={minDepth}
                maxDepth={maxDepth}
                defaultValue={depthRange}
                onChange={setDepthRange}
              />
            </div>
            
            {/* Filter summary */}
            <PSDFilterSummary
              filteredCount={filteredPSDResults.length}
              totalCount={data.psdResults ? data.psdResults.length : 0}
              selectedAditIds={selectedAditIds}
              selectedLocationIds={selectedLocationIds}
              selectedSampleType={selectedSampleType}
              selectedSubzones={selectedSubzones}
              depthRange={depthRange}
            />
            
            {/* View Content - Chart, Table or Map */}
            {viewMode === 'chart' && plotData.length > 0 ? (
              <PSDChartView data={plotData} />
            ) : viewMode === 'chart' && (
              <div className="p-12 text-center text-gray-500">
                No data available to display chart
              </div>
            )}
            
            {viewMode === 'table' && sortedPSDResults.length > 0 ? (
              <PSDTableView 
                data={sortedPSDResults} 
                sortConfig={sortConfig} 
                requestSort={requestSort} 
              />
            ) : viewMode === 'table' && (
              <div className="p-12 text-center text-gray-500">
                No data available to display in table
              </div>
            )}
            
            {viewMode === 'map' && filteredPSDResults.length > 0 ? (
              <PSDMap 
                data={filteredPSDResults}
                selectedItems={selectedItems}
                onItemSelect={handleItemSelect}
              />
            ) : viewMode === 'map' && (
              <div className="p-12 text-center text-gray-500">
                No data available to display on map
              </div>
            )}
          </Card>
        </Section>
        <Footer />
      </div>
    </div>
  );
}

export default GeoDashboardPSD;
