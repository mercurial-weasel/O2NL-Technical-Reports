import { useState, useEffect, useMemo } from 'react';
import { getPSDTests, ParticleSizeDistributionTest } from '@api/geotechnical/psd';
import { logger } from '@lib/logger';

interface PSDDataState {
  psdResults: ParticleSizeDistributionTest[];
  lastLoadTime: string | null;
  isLoading: boolean;
  error: Error | null;
  recordCount: number;
}

export function usePSDData() {
  const [data, setData] = useState<PSDDataState>({
    psdResults: [],
    lastLoadTime: null,
    isLoading: false,
    error: null,
    recordCount: 0
  });
  
  const [isReloading, setIsReloading] = useState(false);

  // Extract unique filter values
  const uniqueAditIds = useMemo(() => {
    const aditIds = new Set<string>();
    data.psdResults.forEach(result => aditIds.add(result.adit_id));
    return Array.from(aditIds).sort();
  }, [data.psdResults]);

  const uniqueLocationIds = useMemo(() => {
    const locationIds = new Set<string>();
    data.psdResults.forEach(result => locationIds.add(result.location_id));
    return Array.from(locationIds).sort();
  }, [data.psdResults]);

  const uniqueSampleTypes = useMemo(() => {
    const sampleTypes = new Set<string>();
    data.psdResults.forEach(result => sampleTypes.add(result.sample_type));
    return Array.from(sampleTypes).sort();
  }, [data.psdResults]);

  const loadData = async () => {
    logger.info('Loading PSD data');
    setData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Get PSD test data from the real API
      const psdResults = await getPSDTests();
      
      logger.info('PSD data loaded successfully', { 
        resultCount: psdResults.length 
      });
      
      setData({
        psdResults,
        lastLoadTime: new Date().toISOString(),
        isLoading: false,
        error: null,
        recordCount: psdResults.length
      });
    } catch (error) {
      logger.error('Failed to load PSD data', { error });
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to load PSD data'),
      }));
    }
  };

  // Initial data load
  useEffect(() => {
    if (!data.lastLoadTime && !data.isLoading) {
      loadData();
    }
  }, []);

  // Handle reload
  const handleReload = async () => {
    setIsReloading(true);
    try {
      await loadData();
    } finally {
      setIsReloading(false);
    }
  };

  return {
    data,
    isReloading,
    handleReload,
    uniqueAditIds,
    uniqueLocationIds,
    uniqueSampleTypes
  };
}
