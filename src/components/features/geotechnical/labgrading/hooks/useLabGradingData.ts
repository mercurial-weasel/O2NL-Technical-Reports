import { useState, useEffect } from 'react';
import { getLabGradingTests, getUniqueSampleIds, getUniquePointIds, getUniqueMaterialIds } from '@api/geotechnical/labgrading';
import { GeoLabGrading } from '@api/geotechnical/labgrading/types';

interface LabGradingDataState {
  labGradingResults: GeoLabGrading[];
  isLoading: boolean;
  error: Error | null;
  lastLoadTime: Date | null;
}

export const useLabGradingData = () => {
  const [dataState, setDataState] = useState<LabGradingDataState>({
    labGradingResults: [],
    isLoading: true,
    error: null,
    lastLoadTime: null,
  });
  const [isReloading, setIsReloading] = useState(false);

  // Unique values for filtering
  const [uniqueSampleIds, setUniqueSampleIds] = useState<string[]>([]);
  const [uniquePointIds, setUniquePointIds] = useState<string[]>([]);
  const [uniqueMaterialIds, setUniqueMaterialIds] = useState<string[]>([]);

  const loadData = async (showReloading = false) => {
    // If we already have data and are reloading, show reloading indicator instead of full loading state
    if (showReloading && dataState.labGradingResults.length > 0) {
      setIsReloading(true);
    } else {
      setDataState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));
    }

    try {
      // Fetch Lab Grading data from API
      console.log('Fetching Lab Grading data...');
      const data = await getLabGradingTests();
      
      // Fetch unique values for filtering
      const sampleIds = await getUniqueSampleIds();
      const pointIds = await getUniquePointIds();
      const materialIds = await getUniqueMaterialIds();
      
      setUniqueSampleIds(sampleIds);
      setUniquePointIds(pointIds);
      setUniqueMaterialIds(materialIds);

      setDataState({
        labGradingResults: data,
        isLoading: false,
        error: null,
        lastLoadTime: new Date(),
      });
      console.log(`Successfully loaded ${data.length} Lab Grading tests`);
    } catch (error) {
      console.error('Error in useLabGradingData:', error);
      setDataState(prev => ({
        ...prev,
        labGradingResults: [],
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred'),
        lastLoadTime: null,
      }));
    } finally {
      setIsReloading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    loadData();
  }, []);

  // Handle reload with reloading indicator
  const handleReload = () => {
    loadData(true);
  };

  return {
    data: dataState,
    isReloading,
    handleReload,
    uniqueSampleIds,
    uniquePointIds,
    uniqueMaterialIds,
  };
};
