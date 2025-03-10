import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { BoreholesCard } from './Boreholes';
import { ZonesCard } from '../Common/Zones';
import { MaterialsCard } from './Materials';
import { StatisticalSummary, SPTPlots } from './SPTResults';
import { InteractiveMap } from '../../common/Map';
import { useZoneSelection } from './hooks/useZoneSelection';
import { useMaterialSelection } from './hooks/useMaterialSelection';
import { zones } from '../../../constants/zones';
import { materials } from '../../../constants/materials';
import { Button } from '../../common/Button/Button';
import { Header } from '../../common/Header/Header';
import { Footer } from '../../common/Footer/Footer';
import { Section } from '../../common/Section/Section';
import { BackNavigation } from '../../common/BackNavigation/BackNavigation';
import { SPTApiClient } from '../../../api/spt/client';
import { Point, SPTResult } from '../../../api/spt/types';
import { logger } from '../../../lib/logger';

function GeoDashboardSPT() {
  const navigate = useNavigate();
  const { 
    selectedZones, 
    handleZoneSelect, 
    handleZoneDeselect, 
    handleClearZoneSelection 
  } = useZoneSelection();
  
  const { 
    selectedMaterials, 
    handleMaterialSelect, 
    handleMaterialDeselect, 
    handleClearMaterialSelection 
  } = useMaterialSelection();
  
  const [data, setData] = useState({
    points: [] as Point[],
    sptResults: [] as SPTResult[],
    lastLoadTime: null as string | null,
    isLoading: false,
    error: null as Error | null,
    recordCount: 0,
    rawData: null as any[] | null,
  });
  const [selectedPointIds, setSelectedPointIds] = useState<Set<string>>(new Set());
  const [isReloading, setIsReloading] = useState(false);

  const apiClient = useMemo(() => new SPTApiClient(), []);

  const loadData = async () => {
    logger.info('Loading SPT data');
    setData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiClient.fetchSPTData();
      logger.info('SPT data loaded successfully', { 
        pointCount: response.points.length,
        resultCount: response.sptResults.length 
      });
      
      setData({
        points: response.points,
        sptResults: response.sptResults,
        lastLoadTime: response.lastLoadTime,
        isLoading: false,
        error: null,
        recordCount: response.recordCount,
        rawData: response.rawData,
      });
    } catch (error) {
      logger.error('Failed to load SPT data', { error });
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to load SPT data'),
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

  // Filter points based on zone selection
  const filteredPoints = useMemo(() => {
    if (selectedZones.size === 0) {
      return data.points;
    }
    return data.points.filter(point => selectedZones.has(point.zone));
  }, [data.points, selectedZones]);

  // Get point IDs for filtered points
  const filteredPointIds = useMemo(() => {
    return new Set(filteredPoints.map(point => point.point_id));
  }, [filteredPoints]);

  // Filter SPT results based on all criteria
  const filteredSPTResults = useMemo(() => {
    let filtered = data.sptResults;

    // Filter by points (which are already filtered by zones)
    filtered = filtered.filter(result => 
      filteredPointIds.has(result.point_id)
    );

    // Filter by materials if any are selected
    if (selectedMaterials.size > 0) {
      filtered = filtered.filter(result => 
        selectedMaterials.has(result.material)
      );
    }

    // Filter by selected points
    if (selectedPointIds.size > 0) {
      filtered = filtered.filter(result =>
        selectedPointIds.has(result.point_id)
      );
    }

    return filtered;
  }, [data.sptResults, filteredPointIds, selectedMaterials, selectedPointIds]);

  // Transform points for map display
  const mapPoints = useMemo(() => {
    return filteredPoints.map(point => ({
      id: point.point_id,
      name: `Point ${point.point_id}`,
      date: new Date().toISOString().split('T')[0],
      coordinates: [point.lat, point.lon] as [number, number]
    }));
  }, [filteredPoints]);

  const handlePointSelect = (pointId: string) => {
    setSelectedPointIds(prev => new Set(prev).add(pointId));
  };

  const handlePointDeselect = (pointId: string) => {
    setSelectedPointIds(prev => {
      const next = new Set(prev);
      next.delete(pointId);
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedPointIds(new Set());
  };

  return (
    <div className="min-h-screen bg-background-base flex flex-col">
      <Header />
      
      <div className="pt-24">
        <Section>
          <BackNavigation to="/geotechnical" text="Back to Geotechnical Tests" />
          
          {/* Status Bar */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">SPT Dashboard</h1>

            <div className="flex items-center gap-4">
              {/* Loading Status */}
              {data.isLoading && !isReloading && (
                <span className="text-sm text-text-muted">Loading data...</span>
              )}
              
              {/* Last Load Time */}
              {data.lastLoadTime && (
                <span className="text-sm text-text-muted">
                  Last updated: {new Date(data.lastLoadTime).toLocaleTimeString()}
                </span>
              )}

              {/* Reload Button */}
              <Button
                onClick={handleReload}
                disabled={data.isLoading || isReloading}
                variant="secondary"
                size="sm"
                icon={RefreshCw}
                loading={isReloading}
              >
                {isReloading ? 'Reloading...' : 'Reload Data'}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {data.error && (
            <div className="mb-6 p-2 bg-red-500/10 border border-red-500 rounded text-sm text-red-400">
              {data.error.message}
            </div>
          )}

          {/* Main Content */}
          <div className="flex gap-6">
            {/* Left Sidebar - Boreholes */}
            <div className="w-48">
              <BoreholesCard
                points={filteredPoints}
                selectedPointIds={selectedPointIds}
                onPointSelect={handlePointSelect}
                onPointDeselect={handlePointDeselect}
                onClearSelection={handleClearSelection}
              />
            </div>

            {/* Main Content Area */}
            <div className="flex-1">
              <div className="flex gap-4">
                {/* Left Column - Zones and Materials */}
                <div className="w-1/4 space-y-4">
                  <ZonesCard
                    zones={zones}
                    selectedZones={selectedZones}
                    onZoneSelect={handleZoneSelect}
                    onZoneDeselect={handleZoneDeselect}
                    onClearSelection={handleClearZoneSelection}
                  />
                  <MaterialsCard
                    materials={materials}
                    selectedMaterials={selectedMaterials}
                    onMaterialSelect={handleMaterialSelect}
                    onMaterialDeselect={handleMaterialDeselect}
                    onClearSelection={handleClearMaterialSelection}
                  />
                </div>

                {/* Right Column - Statistical Summary */}
                <div className="w-3/4">
                  <StatisticalSummary sptResults={filteredSPTResults} />
                </div>
              </div>

              {/* Bottom Row - Map and SPT Plots */}
              <div className="flex gap-4 mt-4">
                <div className="w-1/4">
                  <InteractiveMap
                    points={mapPoints}
                    selectedLocation={mapPoints[0]?.coordinates || [-33.865143, 151.209900]}
                  />
                </div>
                <div className="w-3/4">
                  <SPTPlots 
                    sptResults={filteredSPTResults} 
                    points={data.points}
                  />
                </div>
              </div>
            </div>
          </div>
        </Section>
        <Footer />
      </div>
    </div>
  );
}

export default GeoDashboardSPT;