import { useState, useEffect, useMemo } from 'react';
import { getMDDTests, getUniquePointIds, getUniqueSampleTypes, getUniqueGeologicalUnits } from '@api/geotechnical/mdd';
import { GeoMDD } from '@api/geotechnical/mdd/types';

interface MDDDataState {
  mddResults: GeoMDD[];
  isLoading: boolean;
  error: Error | null;
  lastLoadTime: Date | null;
}

export const useMDDData = () => {
  const [dataState, setDataState] = useState<MDDDataState>({
    mddResults: [],
    isLoading: true,
    error: null,
    lastLoadTime: null,
  });
  const [isReloading, setIsReloading] = useState(false);

  // Unique values for filtering
  const [uniquePointIds, setUniquePointIds] = useState<string[]>([]);
  const [uniqueSampleTypes, setUniqueSampleTypes] = useState<string[]>([]);
  const [uniqueGeologicalUnits, setUniqueGeologicalUnits] = useState<string[]>([]);

  const loadData = async (showReloading = false) => {
    // If we already have data and are reloading, show reloading indicator instead of full loading state
    if (showReloading && dataState.mddResults.length > 0) {
      setIsReloading(true);
    } else {
      setDataState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));
    }

    try {
      // Fetch MDD data from API
      console.log('Fetching MDD data...');
      const data = await getMDDTests();
      
      // Fetch unique values for filtering
      const pointIds = await getUniquePointIds();
      const sampleTypes = await getUniqueSampleTypes();
      const geologicalUnits = await getUniqueGeologicalUnits();
      
      setUniquePointIds(pointIds);
      setUniqueSampleTypes(sampleTypes);
      setUniqueGeologicalUnits(geologicalUnits);

      setDataState({
        mddResults: data,
        isLoading: false,
        error: null,
        lastLoadTime: new Date(),
      });
      console.log(`Successfully loaded ${data.length} MDD tests`);
    } catch (error) {
      console.error('Error in useMDDData:', error);
      setDataState(prev => ({
        ...prev,
        mddResults: [],
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
    uniquePointIds,
    uniqueSampleTypes,
    uniqueGeologicalUnits,
  };
};
