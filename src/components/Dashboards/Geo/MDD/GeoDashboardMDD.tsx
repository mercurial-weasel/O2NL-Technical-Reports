import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '@common/Header/Header';
import { Footer } from '@common/Footer/Footer';
import { Section } from '@common/Section/Section';
import { Card } from '@common/Card/Card';

// Import components
import { DashboardHeader } from '@features/geotechnical/common/DashboardHeader';
import { MDDFilterControls } from '@features/mdd/MDDFilterControls';
import { MDDFilterSummary } from '@features/mdd/MDDFilterSummary';
import { MDDTableView } from '@features/mdd/MDDTableView';
import { MDDChartView } from '@features/mdd/MDDChartView';
import { useMDDData } from '@features/mdd/hooks/useMDDData';
import { DepthRangeSlider } from '@features/geotechnical/common/DepthRangeSlider';

// Import types
import { TestData } from '@api/geotechnical/mdd/types';

// Define view modes
type ViewMode = 'chart' | 'table';

// Define sort configuration
interface SortConfig {
  key: keyof TestData;
  direction: 'ascending' | 'descending';
}

function GeoDashboardMDD() {
  // Load data using custom hook
  const {
    data,
    isReloading,
    handleReload,
    uniqueAditIds,
    uniqueLocationIds,
    uniqueSampleTypes
  } = useMDDData();
  
  // State for filters
  const [selectedAditIds, setSelectedAditIds] = useState<string[]>([]);
  const [selectedLocationIds, setSelectedLocationIds] = useState<string[]>([]);
  const [selectedSampleType, setSelectedSampleType] = useState<string>('');
  
  // Calculate min and max depth from actual data
  const [minDepth, setMinDepth] = useState<number>(0);
  const [maxDepth, setMaxDepth] = useState<number>(40);
  const [depthRange, setDepthRange] = useState<[number, number]>([0, 40]);
  
  // Scan dataset for actual min and max depths when data loads
  useEffect(() => {
    if (data.mddResults && data.mddResults.length > 0) {
      // Extract all depth_to values from the dataset
      const depths = data.mddResults.map(result => 
        typeof result.depth_to === 'number' ? result.depth_to : parseFloat(result.depth_to.toString())
      );
      
      // Calculate min and max, with floor/ceil to get clean values
      const calculatedMinDepth = Math.floor(Math.min(...depths));
      const calculatedMaxDepth = Math.ceil(Math.max(...depths));
      
      // Update state values
      setMinDepth(calculatedMinDepth);
      setMaxDepth(calculatedMaxDepth);
      
      // Reset the depth range filter to match the actual data range
      setDepthRange([calculatedMinDepth, calculatedMaxDepth]);
      
      console.log(`MDD depth range in dataset: ${calculatedMinDepth} to ${calculatedMaxDepth}`);
    }
  }, [data.mddResults]);
  
  // State for view mode and sorting
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'sample_reference',
    direction: 'ascending'
  });

  // Reset all filters - now uses calculated depth bounds
  const handleResetFilters = () => {
    setSelectedAditIds([]);
    setSelectedLocationIds([]);
    setSelectedSampleType('');
    setDepthRange([minDepth, maxDepth]); // Reset to calculated min/max depths
  };

  // Sort function for table data
  const requestSort = (key: keyof TestData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter MDD results based on selected filters
  const filteredMDDResults = useMemo(() => {
    let filtered = data.mddResults;

    if (selectedAditIds.length > 0) {
      filtered = filtered.filter(result => selectedAditIds.includes(result.adit_id));
    }

    if (selectedLocationIds.length > 0) {
      filtered = filtered.filter(result => selectedLocationIds.includes(result.location_id));
    }

    if (selectedSampleType) {
      filtered = filtered.filter(result => result.sample_type === selectedSampleType);
    }

    // Filter by depth range
    filtered = filtered.filter(
      result => {
        const depth = parseFloat(result.depth_to.toString());
        return depth >= depthRange[0] && depth <= depthRange[1];
      }
    );

    return filtered;
  }, [data.mddResults, selectedAditIds, selectedLocationIds, selectedSampleType, depthRange]);

  // Apply sorting to filtered results for table view
  const sortedMDDResults = useMemo(() => {
    let sortableItems = [...filteredMDDResults];
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
  }, [filteredMDDResults, sortConfig]);

  // No need for additional transformations as the API data already has the structure we need
  const plotData = filteredMDDResults;

  return (
    <div className="min-h-screen bg-background-base flex flex-col">
      <Header />
      
      <div className="pt-24">
        <Section>
          <DashboardHeader 
            title="Maximum Dry Density Dashboard"
            backTo="/geotechnical"
            backText="Back to Geotechnical Tests"
            isLoading={data.isLoading}
            isReloading={isReloading}
            lastLoadTime={data.lastLoadTime}
            onReload={handleReload}
            error={data.error}
          />

          {/* Main Content */}
          <Card title="Maximum Dry Density Analysis">
            {/* Filter controls */}
            <MDDFilterControls
              uniqueAditIds={uniqueAditIds}
              uniqueLocationIds={uniqueLocationIds}
              uniqueSampleTypes={uniqueSampleTypes}
              selectedAditIds={selectedAditIds}
              setSelectedAditIds={setSelectedAditIds}
              selectedLocationIds={selectedLocationIds}
              setSelectedLocationIds={setSelectedLocationIds}
              selectedSampleType={selectedSampleType}
              setSelectedSampleType={setSelectedSampleType}
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
            <MDDFilterSummary
              filteredCount={filteredMDDResults.length}
              totalCount={data.mddResults.length}
              selectedAditIds={selectedAditIds}
              selectedLocationIds={selectedLocationIds}
              selectedSampleType={selectedSampleType}
              depthRange={depthRange}
            />
            
            {/* View Content - Chart or Table */}
            {viewMode === 'chart' ? (
              <MDDChartView data={plotData} />
            ) : (
              <MDDTableView 
                data={sortedMDDResults} 
                sortConfig={sortConfig} 
                requestSort={requestSort} 
              />
            )}
          </Card>
        </Section>
        <Footer />
      </div>
    </div>
  );
}

export default GeoDashboardMDD;
