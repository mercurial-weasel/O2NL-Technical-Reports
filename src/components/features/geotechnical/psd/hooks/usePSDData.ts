import { useState, useEffect, useMemo } from 'react';
import { getPSDTests } from '@api/geotechnical/psd';
import { ParticleSizeDistributionTest } from '@api/geotechnical/psd/types';

interface PSDDataState {
  psdResults: ParticleSizeDistributionTest[];
  isLoading: boolean;
  error: Error | null;
  lastLoadTime: Date | null;
}

export const usePSDData = () => {
  const [dataState, setDataState] = useState<PSDDataState>({
    psdResults: [],
    isLoading: true,
    error: null,
    lastLoadTime: null,
  });
  const [isReloading, setIsReloading] = useState(false);

  const loadData = async (showReloading = false) => {
    // If we already have data and are reloading, show reloading indicator instead of full loading state
    if (showReloading && dataState.psdResults.length > 0) {
      setIsReloading(true);
    } else {
      setDataState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));
    }

    try {
      // Fetch PSD data from API (now using Supabase behind the scenes)
      console.log('Fetching PSD data...');
      const data = await getPSDTests();

      setDataState({
        psdResults: data,
        isLoading: false,
        error: null,
        lastLoadTime: new Date(),
      });
      console.log(`Successfully loaded ${data.length} PSD tests`);
    } catch (error) {
      console.error('Error in usePSDData:', error);
      setDataState(prev => ({
        ...prev,
        psdResults: [],
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

  // Extract unique values for filtering
  const uniqueAditIds = useMemo(() => {
    if (!dataState.psdResults) return [];
    return [...new Set(dataState.psdResults
      .map(item => item.adit_id)
      .filter(Boolean))]
      .sort();
  }, [dataState.psdResults]);

  const uniqueLocationIds = useMemo(() => {
    if (!dataState.psdResults) return [];
    return [...new Set(dataState.psdResults
      .map(item => item.location_id)
      .filter(Boolean))]
      .sort();
  }, [dataState.psdResults]);

  const uniqueSampleTypes = useMemo(() => {
    if (!dataState.psdResults) return [];
    return [...new Set(dataState.psdResults
      .map(item => item.sample_type)
      .filter(Boolean))]
      .sort();
  }, [dataState.psdResults]);
  
  const uniqueSubzones = useMemo(() => {
    if (!dataState.psdResults) return [];
    return [...new Set(dataState.psdResults
      .map(item => item.construction_subzone)
      .filter(Boolean))]
      .sort();
  }, [dataState.psdResults]);

  return {
    data: dataState,
    isReloading,
    handleReload,
    uniqueAditIds,
    uniqueLocationIds,
    uniqueSampleTypes,
    uniqueSubzones,
  };
};
