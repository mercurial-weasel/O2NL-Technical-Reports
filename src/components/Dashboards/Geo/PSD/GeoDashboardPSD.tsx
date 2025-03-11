import React, { useState, useMemo } from 'react';
import { Header } from '@common/Header/Header';
import { Footer } from '@common/Footer/Footer';
import { Section } from '@common/Section/Section';
import { Card } from '@common/Card/Card';

// Import components
import { DashboardHeader } from '@features/geotechnical/common/DashboardHeader';
import { PSDFilterControls } from '@features/geotechnical/PSD/PSDFilterControls';
import { PSDFilterSummary } from '@features/geotechnical/PSD/PSDFilterSummary';
import { PSDTableView } from '@features/geotechnical/PSD/PSDTableView';
import { PSDChartView } from '@features/geotechnical/PSD/PSDChartView';
import { usePSDData } from '@features/geotechnical/PSD/hooks/usePSDData';

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

    return filtered;
  }, [data.psdResults, selectedAditIds, selectedLocationIds, selectedSampleType]);

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
            
            {/* Filter summary */}
            <PSDFilterSummary
              filteredCount={filteredPSDResults.length}
              totalCount={data.psdResults.length}
              selectedAditIds={selectedAditIds}
              selectedLocationIds={selectedLocationIds}
              selectedSampleType={selectedSampleType}
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
