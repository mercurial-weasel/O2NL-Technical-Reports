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
import { LabGradingFilterControls } from '@features/geotechnical/labgrading/LabGradingFilterControls';
import { LabGradingFilterSummary } from '@features/geotechnical/labgrading/LabGradingFilterSummary';
import { LabGradingTableView } from '@features/geotechnical/labgrading/LabGradingTableView';
import { LabGradingMap } from '@features/geotechnical/labgrading/LabGradingMap';
import { LabGradingChart } from '@features/geotechnical/labgrading/LabGradingChart';
import { useLabGradingData } from '@features/geotechnical/labgrading/hooks/useLabGradingData';
import { ViewMode, ViewModeToggle } from '@features/geotechnical/common/ViewModeToggle';

// Import types
import { GeoLabGrading } from '@api/geotechnical/labgrading';

// Define sort configuration
interface SortConfig {
  key: keyof GeoLabGrading;
  direction: 'ascending' | 'descending';
}

function GeoDashboardLabGrading() {
  // Load data using custom hook
  const {
    data,
    isReloading,
    handleReload,
    uniqueSampleIds,
    uniquePointIds,
    uniqueMaterialIds
  } = useLabGradingData();
  
  // State for filters
  const [selectedSampleIds, setSelectedSampleIds] = useState<string[]>([]);
  const [selectedPointId, setSelectedPointId] = useState<string>('');
  const [selectedMaterialIds, setSelectedMaterialIds] = useState<string[]>([]);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  // State for view mode and sorting
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'sample_id',
    direction: 'ascending'
  });

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedSampleIds([]);
    setSelectedPointId('');
    setSelectedMaterialIds([]);
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
  const requestSort = (key: keyof GeoLabGrading) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter Lab Grading results based on selected filters
  const filteredLabGradingResults = useMemo(() => {
    // Handle case when data is not yet loaded
    const results = data.labGradingResults || [];
    
    if (results.length === 0) {
      return [];
    }

    let filtered = [...results];

    if (selectedSampleIds.length > 0) {
      filtered = filtered.filter(result => 
        result.sample_id && selectedSampleIds.includes(result.sample_id)
      );
    }

    if (selectedPointId) {
      filtered = filtered.filter(result => result.point_id === selectedPointId);
    }

    // Add material ID filter
    if (selectedMaterialIds.length > 0) {
      filtered = filtered.filter(result => 
        result.material_id && selectedMaterialIds.includes(result.material_id)
      );
    }

    return filtered;
  }, [data.labGradingResults, selectedSampleIds, selectedPointId, selectedMaterialIds]);

  // Apply sorting to filtered results for table view
  const sortedLabGradingResults = useMemo(() => {
    if (!filteredLabGradingResults.length) return [];
    
    let sortableItems = [...filteredLabGradingResults];
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
  }, [filteredLabGradingResults, sortConfig]);

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

  return (
    <div className="min-h-screen bg-background-base flex flex-col">
      <Header />
      
      <div className="pt-24">
        <Section>
          <Container>
            <DashboardHeader 
              title="Laboratory Grading Dashboard"
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
            <Card title="Laboratory Grading Analysis">
              {/* Filter controls */}
              <LabGradingFilterControls
                uniqueSampleIds={uniqueSampleIds || []}
                uniquePointIds={uniquePointIds || []}
                uniqueMaterialIds={uniqueMaterialIds || []}
                selectedSampleIds={selectedSampleIds}
                setSelectedSampleIds={setSelectedSampleIds}
                selectedPointId={selectedPointId}
                setSelectedPointId={setSelectedPointId}
                selectedMaterialIds={selectedMaterialIds}
                setSelectedMaterialIds={setSelectedMaterialIds}
                handleResetFilters={handleResetFilters}
              />
              
              {/* Filter summary */}
              <LabGradingFilterSummary
                filteredCount={filteredLabGradingResults.length}
                totalCount={data.labGradingResults ? data.labGradingResults.length : 0}
                selectedSampleIds={selectedSampleIds}
                selectedPointId={selectedPointId}
                selectedMaterialIds={selectedMaterialIds}
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
                  {viewMode === 'chart' && filteredLabGradingResults.length > 0 ? (
                    <LabGradingChart data={filteredLabGradingResults} />
                  ) : viewMode === 'chart' && (
                    <div className="p-12 text-center text-text-muted">
                      No data available to display chart
                    </div>
                  )}
                  
                  {viewMode === 'table' && sortedLabGradingResults.length > 0 ? (
                    <LabGradingTableView 
                      data={sortedLabGradingResults} 
                      sortConfig={sortConfig} 
                      requestSort={requestSort} 
                    />
                  ) : viewMode === 'table' && (
                    <div className="p-12 text-center text-text-muted">
                      No data available to display in table
                    </div>
                  )}
                  
                  {viewMode === 'map' && filteredLabGradingResults.length > 0 ? (
                    <LabGradingMap 
                      data={filteredLabGradingResults}
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
                <h4 className="font-medium mb-1 text-text-primary">About Laboratory Grading Tests</h4>
                <p>
                  Laboratory grading tests classify soils based on their particle size distribution. 
                  This analysis helps engineers understand the composition of soil materials, which 
                  is crucial for evaluating their engineering properties. The particle size 
                  distribution chart shows the percentage of soil particles passing through a series 
                  of standard sieves, helping to classify soil as clay, silt, sand, or gravel.
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

export default GeoDashboardLabGrading;
