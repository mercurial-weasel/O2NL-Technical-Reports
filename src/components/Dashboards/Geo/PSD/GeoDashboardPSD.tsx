import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Filter } from 'lucide-react';
import { PSDPlot } from '@features/geotechnical/PSD/PSDPlot';
import { ZonesCard } from '@FeaturesCommon/Zones';
import { MaterialsCard } from '../SPT/Materials';
import { InteractiveMap } from '@common/Map';
import { useZoneSelection } from '../SPT/hooks/useZoneSelection';
import { useMaterialSelection } from '../SPT/hooks/useMaterialSelection';
import { zones } from '@constants/zones';
import { materials } from '@constants/materials';
import { Button } from '@common/Button/Button';
import { Header } from '@common/Header/Header';
import { Footer } from '@common/Footer/Footer';
import { Section } from '@common/Section/Section';
import { BackNavigation } from '@common/BackNavigation/BackNavigation';
import { Card } from '@common/Card/Card';
import { logger } from '@lib/logger';

// Import the real API client and types
import { getPSDTests, ParticleSizeDistributionTest } from '@api/geotechnical/psd';

// Define the Point interface for location data
interface Point {
  point_id: string;
  zone: string;
  lat: number;
  lon: number;
}

function SamplesCard({ samples, selectedSampleIds, onSampleSelect, onSampleDeselect, onClearSelection }) {
  return (
    <Card title="Samples" className="h-full">
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">{samples.length} samples</span>
          <Button 
            size="xs" 
            variant="ghost" 
            onClick={onClearSelection}
            disabled={selectedSampleIds.size === 0}
          >
            Clear
          </Button>
        </div>
        
        <div className="max-h-64 overflow-y-auto">
          {samples.map((sample) => {
            const isSelected = selectedSampleIds.has(sample.sample_id);
            return (
              <div 
                key={sample.sample_id}
                className={`p-1.5 text-xs flex justify-between items-center mb-1 rounded cursor-pointer ${
                  isSelected ? 'bg-primary/10 border border-primary/30' : 'hover:bg-gray-100'
                }`}
                onClick={() => isSelected ? onSampleDeselect(sample.sample_id) : onSampleSelect(sample.sample_id)}
              >
                <span>{sample.sample_reference}</span>
                <span className="text-text-muted">{sample.point_id}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function GeoDashboardPSD() {
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
    psdResults: [] as ParticleSizeDistributionTest[],
    lastLoadTime: null as string | null,
    isLoading: false,
    error: null as Error | null,
    recordCount: 0
  });
  
  const [selectedSampleIds, setSelectedSampleIds] = useState<Set<string>>(new Set());
  const [isReloading, setIsReloading] = useState(false);

  const loadData = async () => {
    logger.info('Loading PSD data');
    setData(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Get PSD test data from the real API
      const psdResults = await getPSDTests();
      
      // Since we don't have a dedicated points API yet, derive points from the PSD results
      // In a real implementation, you would fetch points from a proper API
      const uniqueLocations = new Map<string, Point>();
      
      psdResults.forEach(result => {
        // Extract location ID from the test
        const locationId = result.location_id;
        
        if (!uniqueLocations.has(locationId)) {
          // In a real implementation, these would be actual coordinates from your data
          // For now, generate some dummy coordinates based on the string
          const lat = -33.86 - (locationId.charCodeAt(0) % 10) * 0.001;
          const lon = 151.20 + (locationId.charCodeAt(1) % 10) * 0.001;
          
          uniqueLocations.set(locationId, {
            point_id: locationId,
            zone: locationId.startsWith('BH') ? 'Zone A' : 
                  locationId.startsWith('TP') ? 'Zone B' : 'Zone C',
            lat,
            lon
          });
        }
      });
      
      const points = Array.from(uniqueLocations.values());
      
      logger.info('PSD data loaded successfully', { 
        pointCount: points.length,
        resultCount: psdResults.length 
      });
      
      setData({
        points,
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

  // Filter PSD results based on all criteria
  const filteredPSDResults = useMemo(() => {
    let filtered = data.psdResults;

    // Filter by points (which are already filtered by zones)
    filtered = filtered.filter(result => 
      filteredPointIds.has(result.location_id)
    );

    // Filter by materials if any are selected
    if (selectedMaterials.size > 0) {
      // Extract material from the test remarks or similar field
      filtered = filtered.filter(result => {
        const remarks = result.remark_dot_test_remarks.toUpperCase();
        return Array.from(selectedMaterials).some(material => 
          remarks.includes(material.toUpperCase())
        );
      });
    }

    // Filter by selected samples
    if (selectedSampleIds.size > 0) {
      filtered = filtered.filter(result =>
        selectedSampleIds.has(result.sample_unique_id)
      );
    }

    return filtered;
  }, [data.psdResults, filteredPointIds, selectedMaterials, selectedSampleIds]);

  // Transform points for map display
  const mapPoints = useMemo(() => {
    return filteredPoints.map(point => ({
      id: point.point_id,
      name: `${point.point_id}`,
      date: new Date().toISOString().split('T')[0],
      coordinates: [point.lat, point.lon] as [number, number]
    }));
  }, [filteredPoints]);

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

  const handleSampleSelect = (sampleId: string) => {
    setSelectedSampleIds(prev => new Set(prev).add(sampleId));
  };

  const handleSampleDeselect = (sampleId: string) => {
    setSelectedSampleIds(prev => {
      const next = new Set(prev);
      next.delete(sampleId);
      return next;
    });
  };

  const handleClearSelection = () => {
    setSelectedSampleIds(new Set());
  };

  return (
    <div className="min-h-screen bg-background-base flex flex-col">
      <Header />
      
      <div className="pt-24">
        <Section>
          <BackNavigation to="/geotechnical" text="Back to Geotechnical Tests" />
          
          {/* Status Bar */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-text-primary">Particle Size Distribution Dashboard</h1>

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
            {/* Left Sidebar */}
            <div className="w-48">
              <SamplesCard
                samples={filteredPSDResults.map(r => ({
                  sample_id: r.sample_unique_id,
                  sample_reference: r.sample_reference,
                  point_id: r.location_id
                }))}
                selectedSampleIds={selectedSampleIds}
                onSampleSelect={handleSampleSelect}
                onSampleDeselect={handleSampleDeselect}
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

                {/* Right Column - PSD Plot */}
                <div className="w-3/4">
                  <Card title="Particle Size Distribution Analysis" className="h-full">
                    <PSDPlot data={plotData} />
                  </Card>
                </div>
              </div>

              {/* Bottom Row - Map */}
              <div className="mt-4">
                <Card title="Sample Locations">
                  <div className="h-64">
                    <InteractiveMap
                      points={mapPoints}
                      selectedLocation={mapPoints[0]?.coordinates || [-33.865143, 151.209900]}
                    />
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </Section>
        <Footer />
      </div>
    </div>
  );
}

export default GeoDashboardPSD;
