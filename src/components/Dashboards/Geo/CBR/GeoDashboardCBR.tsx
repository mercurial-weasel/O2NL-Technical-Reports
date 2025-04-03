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
import { CBRFilterControls } from '@features/geotechnical/cbr/CBRFilterControls';
import { CBRFilterSummary } from '@features/geotechnical/cbr/CBRFilterSummary';
import { CBRTableView } from '@features/geotechnical/cbr/CBRTableView';
import { CBRMap } from '@features/geotechnical/cbr/CBRMap';
import { useCBRData } from '@features/geotechnical/cbr/hooks/useCBRData';
import { ViewMode, ViewModeToggle } from '@features/geotechnical/common/ViewModeToggle';

// Import the chart components
import { CBRChartToggle, CBRChartType } from '@features/geotechnical/cbr/CBRChartToggle';
import { CBRChart_vs_Property } from '@features/geotechnical/cbr/CBRChart_vs_Property';
import { CBRChart_vs_Chainage } from '@features/geotechnical/cbr/CBRChart_vs_Chainage';

// Import types
import { GeoCBR } from '@api/geotechnical/cbr';

// Define sort configuration
interface SortConfig {
  key: keyof GeoCBR;
  direction: 'ascending' | 'descending';
}

function GeoDashboardCBR() {
  // Load data using custom hook
  const {
    data,
    isReloading,
    handleReload,
    uniqueSampleIds,
    uniqueInvestigationIds,
    uniqueGeologicalUnits
  } = useCBRData();
  
  // State for filters
  const [selectedSampleIds, setSelectedSampleIds] = useState<string[]>([]);
  const [selectedInvestigationId, setSelectedInvestigationId] = useState<string>('');
  const [selectedGeologicalUnits, setSelectedGeologicalUnits] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  // Depth filter state
  const [minDepth, setMinDepth] = useState<number>(0);
  const [maxDepth, setMaxDepth] = useState<number>(40);
  const [depthRange, setDepthRange] = useState<[number, number]>([0, 40]);
  
  // Scan dataset for actual min and max depths when data loads
  useEffect(() => {
    if (data.cbrResults && data.cbrResults.length > 0) {
      // Extract all depth_to values from the dataset
      const depths = data.cbrResults.map(result => 
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
  }, [data.cbrResults]);
  
  // State for view mode and sorting
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'sample_id',
    direction: 'ascending'
  });

  // Add state for the current chart type
  const [currentChart, setCurrentChart] = useState<CBRChartType>('cbr-vs-property');

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedSampleIds([]);
    setSelectedInvestigationId('');
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
  const requestSort = (key: keyof GeoCBR) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter CBR results based on selected filters
  const filteredCBRResults = useMemo(() => {
    // Handle case when data is not yet loaded
    const results = data.cbrResults || [];
    
    if (results.length === 0) {
      return [];
    }

    let filtered = [...results];

    if (selectedSampleIds.length > 0) {
      filtered = filtered.filter(result => selectedSampleIds.includes(result.sample_id));
    }

    if (selectedInvestigationId) {
      filtered = filtered.filter(result => result.investigation_id === selectedInvestigationId);
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
        const depth = typeof result.depth_to === 'number' 
          ? result.depth_to 
          : parseFloat(String(result.depth_to));
        
        return !isNaN(depth) && depth >= depthRange[0] && depth <= depthRange[1];
      }
    );

    return filtered;
  }, [data.cbrResults, selectedSampleIds, selectedInvestigationId, selectedGeologicalUnits, depthRange]);

  // Apply sorting to filtered results for table view
  const sortedCBRResults = useMemo(() => {
    if (!filteredCBRResults.length) return [];
    
    let sortableItems = [...filteredCBRResults];
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
  }, [filteredCBRResults, sortConfig]);

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
    if (filteredCBRResults.length === 0) {
      return (
        <div className="p-12 text-center text-text-muted">
          No data available to display chart
        </div>
      );
    }
    
    switch (currentChart) {
      case 'cbr-vs-property':
        return <CBRChart_vs_Property data={filteredCBRResults} />;
      case 'cbr-vs-chainage':
        return <CBRChart_vs_Chainage data={filteredCBRResults} />;
      default:
        return <CBRChart_vs_Property data={filteredCBRResults} />;
    }
  };

  return (
    <div className="min-h-screen bg-background-base flex flex-col">
      <Header />
      
      <div className="pt-24">
        <Section>
          <Container>
            <DashboardHeader 
              title="California Bearing Ratio (CBR) Dashboard"
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
            <Card title="California Bearing Ratio Analysis">
              {/* Filter controls */}
              <CBRFilterControls
                uniqueSampleIds={uniqueSampleIds || []}
                uniqueInvestigationIds={uniqueInvestigationIds || []}
                uniqueGeologicalUnits={uniqueGeologicalUnits || []}
                selectedSampleIds={selectedSampleIds}
                setSelectedSampleIds={setSelectedSampleIds}
                selectedInvestigationId={selectedInvestigationId}
                setSelectedInvestigationId={setSelectedInvestigationId}
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
              <CBRFilterSummary
                filteredCount={filteredCBRResults.length}
                totalCount={data.cbrResults ? data.cbrResults.length : 0}
                selectedSampleIds={selectedSampleIds}
                selectedInvestigationId={selectedInvestigationId}
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
                  {viewMode === 'chart' && filteredCBRResults.length > 0 ? (
                    <>
                      <CBRChartToggle 
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
                  
                  {viewMode === 'table' && sortedCBRResults.length > 0 ? (
                    <CBRTableView 
                      data={sortedCBRResults} 
                      sortConfig={sortConfig} 
                      requestSort={requestSort} 
                    />
                  ) : viewMode === 'table' && (
                    <div className="p-12 text-center text-text-muted">
                      No data available to display in table
                    </div>
                  )}
                  
                  {viewMode === 'map' && filteredCBRResults.length > 0 ? (
                    <CBRMap 
                      data={filteredCBRResults}
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
                <h4 className="font-medium mb-1 text-text-primary">About California Bearing Ratio Tests</h4>
                <p>
                  The California Bearing Ratio (CBR) test is a penetration test used to evaluate the mechanical 
                  strength of subgrades and base courses for roads and pavements. The test measures the pressure 
                  required to penetrate a soil sample with a plunger of standard area compared to the pressure 
                  required to penetrate a standard material. CBR is expressed as a percentage of the standard value.
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

export default GeoDashboardCBR;
