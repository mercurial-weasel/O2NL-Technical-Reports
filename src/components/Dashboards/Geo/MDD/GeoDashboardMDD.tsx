import React, { useState, useMemo } from 'react';
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
  
  // State for view mode and sorting
  const [viewMode, setViewMode] = useState<ViewMode>('chart');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'sample_reference',
    direction: 'ascending'
  });

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedAditIds([]);
    setSelectedLocationIds([]);
    setSelectedSampleType('');
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

    return filtered;
  }, [data.mddResults, selectedAditIds, selectedLocationIds, selectedSampleType]);

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
            
            {/* Filter summary */}
            <MDDFilterSummary
              filteredCount={filteredMDDResults.length}
              totalCount={data.mddResults.length}
              selectedAditIds={selectedAditIds}
              selectedLocationIds={selectedLocationIds}
              selectedSampleType={selectedSampleType}
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
