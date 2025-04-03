import { useState, useEffect } from 'react';
import { getCBRTests, getUniqueSampleIds, getUniqueInvestigationIds, getUniqueGeologicalUnits } from '@api/geotechnical/cbr';
import { GeoCBR } from '@api/geotechnical/cbr/types';

interface CBRDataState {
  cbrResults: GeoCBR[];
  isLoading: boolean;
  error: Error | null;
  lastLoadTime: Date | null;
}

export const useCBRData = () => {
  const [dataState, setDataState] = useState<CBRDataState>({
    cbrResults: [],
    isLoading: true,
    error: null,
    lastLoadTime: null,
  });
  const [isReloading, setIsReloading] = useState(false);

  // Unique values for filtering
  const [uniqueSampleIds, setUniqueSampleIds] = useState<string[]>([]);
  const [uniqueInvestigationIds, setUniqueInvestigationIds] = useState<string[]>([]);
  const [uniqueGeologicalUnits, setUniqueGeologicalUnits] = useState<string[]>([]);

  const loadData = async (showReloading = false) => {
    // If we already have data and are reloading, show reloading indicator instead of full loading state
    if (showReloading && dataState.cbrResults.length > 0) {
      setIsReloading(true);
    } else {
      setDataState(prev => ({
        ...prev,
        isLoading: true,
        error: null
      }));
    }

    try {
      // Fetch CBR data from API
      console.log('Fetching CBR data...');
      const data = await getCBRTests();
      
      // Fetch unique values for filtering
      const sampleIds = await getUniqueSampleIds();
      const investigationIds = await getUniqueInvestigationIds();
      const geologicalUnits = await getUniqueGeologicalUnits();
      
      setUniqueSampleIds(sampleIds);
      setUniqueInvestigationIds(investigationIds);
      setUniqueGeologicalUnits(geologicalUnits);

      setDataState({
        cbrResults: data,
        isLoading: false,
        error: null,
        lastLoadTime: new Date(),
      });
      console.log(`Successfully loaded ${data.length} CBR tests`);
    } catch (error) {
      console.error('Error in useCBRData:', error);
      setDataState(prev => ({
        ...prev,
        cbrResults: [],
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
    uniqueInvestigationIds,
    uniqueGeologicalUnits,
  };
};
