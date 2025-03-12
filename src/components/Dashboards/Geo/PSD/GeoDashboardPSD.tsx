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
import { usePSDData } from '@features/geotechnical/psd/hooks/usePSDData';
import { DepthRangeSlider } from '@features/geotechnical/common/DepthRangeSlider';

// Import types
import { ParticleSizeDistributionTest } from '@api/geotechnical/psd';

// Define view modes
type ViewMode = 'chart' | 'table';

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
  
  // Calculate min and max depth from actual data
  const [minDepth, setMinDepth] = useState<number>(0);
  const [maxDepth, setMaxDepth] = useState<number>(40);
  const [depthRange, setDepthRange] = useState<[number, number]>([0, 40]);
  
  // Scan dataset for actual min and max depths when data loads
  useEffect(() => {
    if (data.psdResults && data.psdResults.length > 0) {
      // Extract all depth_to values from the dataset
      const depths = data.psdResults.map(result => 
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
      
      console.log(`Depth range in dataset: ${calculatedMinDepth} to ${calculatedMaxDepth}`);
    }
  }, [data.psdResults]);
  
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
    let filtered = data.psdResults;

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
  }, [data.psdResults, selectedAditIds, selectedLocationIds, selectedSampleType, depthRange]);

  // Apply sorting to filtered results for table view
  const sortedPSDResults = useMemo(() => {
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
            <PSDFilterSummary
              filteredCount={filteredPSDResults.length}
              totalCount={data.psdResults.length}
              selectedAditIds={selectedAditIds}
              selectedLocationIds={selectedLocationIds}
              selectedSampleType={selectedSampleType}
              depthRange={depthRange}
            />
            
            {/* View Content - Chart or Table */}
            {viewMode === 'chart' ? (
              <PSDChartView data={plotData} />
            ) : (
              <PSDTableView 
                data={sortedPSDResults} 
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

export default GeoDashboardPSD;
