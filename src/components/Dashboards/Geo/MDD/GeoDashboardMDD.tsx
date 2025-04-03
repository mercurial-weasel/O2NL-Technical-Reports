import React, { useState, useMemo, useEffect } from 'react';
import { Header } from '@common/Header/Header';
import { Footer } from '@common/Footer/Footer';
import { Section } from '@common/Section/Section';
import { Card } from '@common/Card/Card';
import { Container } from '@common/Container/Container';
import { LoadingSpinner } from '@common/Spinner/Spinner';
import { AlertBox } from '@common/AlertBox';

// Import components
import { DashboardHeader } from '@features/geotechnical/common/DashboardHeader';
import { MDDFilterControls } from '@features/geotechnical/mdd/MDDFilterControls';
import { MDDFilterSummary } from '@features/geotechnical/mdd/MDDFilterSummary';
import { MDDTableView } from '@features/geotechnical/mdd/MDDTableView';
import { MDDChart_Moisture_vs_Chainage } from '@features/geotechnical/mdd/MDDChart_Moisture_vs_Chainage';
import MDDMap from '@features/geotechnical/mdd/MDDMap';
import { useMDDData } from '@features/geotechnical/mdd/hooks/useMDDData';
import { ViewMode, ViewModeToggle } from '@features/geotechnical/common/ViewModeToggle';

// Import the new components
import { MDDChartToggle, MDDChartType } from '@features/geotechnical/mdd/MDDChartToggle';
import { MDDChart_Moisture_vs_Depth } from '@features/geotechnical/mdd/MDDChart_Moisture_vs_Depth';
import { MDDChart_Moisture_vs_DryDensity } from '@features/geotechnical/mdd/MDDChart_Moisture_vs_DryDensity';

// Import types
import { GeoMDD } from '@api/geotechnical/mdd';

// Define sort configuration
interface SortConfig {
  key: keyof GeoMDD;
  direction: 'ascending' | 'descending';
}

function GeoDashboardMDD() {
  // Load data using custom hook
  const {
    data,
    isReloading,
    handleReload,
    uniquePointIds,
    uniqueSampleTypes,
    uniqueGeologicalUnits
  } = useMDDData();
  
  // State for filters
  const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);
  const [selectedSampleType, setSelectedSampleType] = useState<string>('');
  const [selectedGeologicalUnits, setSelectedGeologicalUnits] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  // Depth filter state
  const [minDepth, setMinDepth] = useState<number>(0);
  const [maxDepth, setMaxDepth] = useState<number>(40);
  const [depthRange, setDepthRange] = useState<[number, number]>([0, 40]);
  
  // Scan dataset for actual min and max depths when data loads
  useEffect(() => {
    if (data.mddResults && data.mddResults.length > 0) {
      // Extract all SAMPLE_TOP values from the dataset
      const depths = data.mddResults.map(result => 
        typeof result.SAMPLE_TOP === 'number' ? result.SAMPLE_TOP : parseFloat(String(result.SAMPLE_TOP))
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
  }, [data.mddResults]);
  
  // State for view mode and sorting
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'SAMPLE_REFERENCE',
    direction: 'ascending'
  });

  // Add state for the current chart type
  const [currentChart, setCurrentChart] = useState<MDDChartType>('moisture-chainage');

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedPointIds([]);
    setSelectedSampleType('');
    setSelectedGeologicalUnits([]);
    setDepthRange([minDepth, maxDepth]);
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
  const requestSort = (key: keyof GeoMDD) => {
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
    // Handle case when data is not yet loaded
    const results = data.mddResults || [];
    
    if (results.length === 0) {
      return [];
    }

    let filtered = [...results];

    if (selectedPointIds.length > 0) {
      filtered = filtered.filter(result => selectedPointIds.includes(result.POINT_ID));
    }

    if (selectedSampleType) {
      filtered = filtered.filter(result => result.SAMPLE_TYPE === selectedSampleType);
    }

    // Add geological unit filter
    if (selectedGeologicalUnits.length > 0) {
      filtered = filtered.filter(result => 
        result.geological_unit && selectedGeologicalUnits.includes(result.geological_unit)
      );
    }

    // Filter by depth range
    filtered = filtered.filter(
      result => {
        // Safe conversion to number with fallback
        const depth = typeof result.SAMPLE_TOP === 'number' 
          ? result.SAMPLE_TOP 
          : parseFloat(String(result.SAMPLE_TOP));
        
        return !isNaN(depth) && depth >= depthRange[0] && depth <= depthRange[1];
      }
    );

    return filtered;
  }, [data.mddResults, selectedPointIds, selectedSampleType, selectedGeologicalUnits, depthRange]);

  // Apply sorting to filtered results for table view
  const sortedMDDResults = useMemo(() => {
    if (!filteredMDDResults.length) return [];
    
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

  // Show loading state or error if data is not ready
  if (data.isLoading) {
    return (
      <div className="min-h-screen bg-background-base flex flex-col">
        <Header />
        <div className="pt-24">
          <Section>
            <Container>
              <Card>
                <div className="flex justify-center items-center p-12">
                  <LoadingSpinner size="lg" />
                  <span className="ml-3">Loading data from API server...</span>
                </div>
              </Card>
            </Container>
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
            <Container>
              <Card>
                <AlertBox 
                  title="Error loading data from API" 
                  message={`${String(data.error)}. Please check that the server is running and try again.`}
                  variant="error"
                  action={{
                    label: "Retry",
                    onClick: handleReload
                  }}
                />
              </Card>
            </Container>
          </Section>
        </div>
      </div>
    );
  }

  // Handle tab change using ViewModeToggle
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  // Render the current chart based on selection
  const renderCurrentChart = () => {
    if (filteredMDDResults.length === 0) {
      return (
        <div className="p-12 text-center text-text-muted">
          No data available to display chart
        </div>
      );
    }
    
    switch (currentChart) {
      case 'moisture-chainage':
        return <MDDChart_Moisture_vs_Chainage data={filteredMDDResults} />;
      case 'moisture-depth':
        return <MDDChart_Moisture_vs_Depth data={filteredMDDResults} />;
      case 'moisture-density':
        return <MDDChart_Moisture_vs_DryDensity data={filteredMDDResults} />;
      default:
        return <MDDChart_Moisture_vs_Chainage data={filteredMDDResults} />;
    }
  };

  return (
    <div className="min-h-screen bg-background-base flex flex-col">
      <Header />
      
      <div className="pt-24">
        <Section>
          <Container>
            <DashboardHeader 
              title="Maximum Dry Density (MDD) Dashboard"
              backTo="/geotechnical"
              backText="Back to Geotechnical Tests"
              isLoading={data.isLoading}
              isReloading={isReloading}
              lastLoadTime={data.lastLoadTime}
              onReload={handleReload}
              error={data.error}
              apiSource={true}
            />

            {/* Main Content */}
            <Card title="Maximum Dry Density Analysis">
              {/* Filter controls */}
              <MDDFilterControls
                uniquePointIds={uniquePointIds || []}
                uniqueSampleTypes={uniqueSampleTypes || []}
                uniqueGeologicalUnits={uniqueGeologicalUnits || []}
                selectedPointIds={selectedPointIds}
                setSelectedPointIds={setSelectedPointIds}
                selectedSampleType={selectedSampleType}
                setSelectedSampleType={setSelectedSampleType}
                selectedGeologicalUnits={selectedGeologicalUnits}
                setSelectedGeologicalUnits={setSelectedGeologicalUnits}
                handleResetFilters={handleResetFilters}
              />
              
              {/* Depth Range Slider with dynamic min/max based on dataset */}
              <div className="px-4 py-3 border-t border-gray-200">
                <div className="flex flex-col">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Depth Range</h3>
                  <div className="flex items-center">
                    <div className="w-12 text-xs text-gray-500">{depthRange[0]}m</div>
                    <input
                      type="range"
                      min={minDepth}
                      max={maxDepth}
                      step={0.1}
                      value={depthRange[0]}
                      onChange={(e) => setDepthRange([parseFloat(e.target.value), depthRange[1]])}
                      className="w-full"
                    />
                    <div className="w-12 text-xs text-gray-500 ml-2">{depthRange[1]}m</div>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="w-12 text-xs text-gray-500">{depthRange[0]}m</div>
                    <input
                      type="range"
                      min={minDepth}
                      max={maxDepth}
                      step={0.1}
                      value={depthRange[1]}
                      onChange={(e) => setDepthRange([depthRange[0], parseFloat(e.target.value)])}
                      className="w-full"
                    />
                    <div className="w-12 text-xs text-gray-500 ml-2">{depthRange[1]}m</div>
                  </div>
                </div>
              </div>
              
              {/* Filter summary */}
              <MDDFilterSummary
                filteredCount={filteredMDDResults.length}
                totalCount={data.mddResults ? data.mddResults.length : 0}
                selectedPointIds={selectedPointIds}
                selectedSampleType={selectedSampleType}
                selectedGeologicalUnits={selectedGeologicalUnits}
                depthRange={depthRange}
              />
              
              {/* View mode toggle */}
              <div className="px-4 border-t border-border-primary">
                <div className="py-4 flex justify-between items-center">
                  <h3 className="font-medium text-text-primary">View Options</h3>
                  <ViewModeToggle 
                    viewMode={viewMode}
                    setViewMode={handleViewModeChange}
                  />
                </div>
              
                {/* View Content - Chart, Table or Map */}
                <div className="mb-4">
                  {viewMode === 'chart' && filteredMDDResults.length > 0 ? (
                    <>
                      <MDDChartToggle 
                        currentChart={currentChart}
                        setCurrentChart={setCurrentChart}
                      />
                      {renderCurrentChart()}
                    </>
                  ) : viewMode === 'chart' && (
                    <div className="p-12 text-center text-text-muted">
                      No data available to display chart
                    </div>
                  )}
                  
                  {viewMode === 'table' && sortedMDDResults.length > 0 ? (
                    <MDDTableView 
                      data={sortedMDDResults} 
                      sortConfig={sortConfig} 
                      requestSort={requestSort} 
                    />
                  ) : viewMode === 'table' && (
                    <div className="p-12 text-center text-text-muted">
                      No data available to display in table
                    </div>
                  )}
                  
                  {viewMode === 'map' && filteredMDDResults.length > 0 ? (
                    <MDDMap 
                      data={filteredMDDResults}
                      selectedItems={selectedItems}
                      onItemSelect={handleItemSelect}
                    />
                  ) : viewMode === 'map' && (
                    <div className="p-12 text-center text-text-muted">
                      No data available to display on map
                    </div>
                  )}
                </div>
              </div>
              
              {/* Informational footer section */}
              <div className="px-4 py-3 border-t border-border-primary text-text-secondary text-sm">
                <h4 className="font-medium mb-1 text-text-primary">About Maximum Dry Density Tests</h4>
                <p>
                  The Maximum Dry Density (MDD) test, also known as the compaction test, determines the optimal moisture content 
                  at which a soil can be compacted to its maximum dry density. This test is crucial for earthworks 
                  and construction projects to ensure proper soil compaction, which in turn provides stability and 
                  prevents settlement issues in structures built on that soil.
                </p>
              </div>
            </Card>
          </Container>
        </Section>
        <Footer />
      </div>
    </div>
  );
}

export default GeoDashboardMDD;