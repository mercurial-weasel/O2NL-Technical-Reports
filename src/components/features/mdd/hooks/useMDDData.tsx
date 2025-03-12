import { useState, useEffect, useMemo } from 'react';
import { getMDDTests } from '@api/geotechnical/mdd/client';
import { TestData } from '@api/geotechnical/mdd/types';
import { logger } from '@lib/logger';

interface MDDDataState {
  mddResults: TestData[];
  lastLoadTime: string | null;
  isLoading: boolean;
  error: Error | null;
  recordCount: number;
}

export function useMDDData() {
  const [data, setData] = useState<MDDDataState>({
    mddResults: [],
    lastLoadTime: null,
    isLoading: false,
    error: null,
    recordCount: 0
  });
  
  const [isReloading, setIsReloading] = useState(false);

  // Extract unique filter values
  const uniqueAditIds = useMemo(() => {
    const aditIds = new Set<string>();
    data.mddResults.forEach(result => aditIds.add(result.adit_id));
    return Array.from(aditIds).sort();
  }, [data.mddResults]);

  const uniqueLocationIds = useMemo(() => {
    const locationIds = new Set<string>();
    data.mddResults.forEach(result => locationIds.add(result.location_id));
    return Array.from(locationIds).sort();
  }, [data.mddResults]);

  const uniqueSampleTypes = useMemo(() => {
    const sampleTypes = new Set<string>();
    data.mddResults.forEach(result => sampleTypes.add(result.sample_type));
    return Array.from(sampleTypes).sort();
  }, [data.mddResults]);

  const loadData = async () => {
    logger.info('Loading MDD data');
    setData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Get MDD test data from the API
      const mddResults = await getMDDTests();
      
      logger.info('MDD data loaded successfully', { 
        resultCount: mddResults.length 
      });
      
      setData({
        mddResults,
        lastLoadTime: new Date().toISOString(),
        isLoading: false,
        error: null,
        recordCount: mddResults.length
      });
    } catch (error) {
      logger.error('Failed to load MDD data', { error });
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to load MDD data'),
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
