import React, { useState, useEffect } from 'react';
import { Card } from '@common';
import { DustApiClient } from '@api/sensors/dust/client';
import { DateRangeSelector, DeviceSelector, ViewModeToggle } from '@common'

import { 
  DustTable, 
  DustChart, 
  DustCalendar, 
  WindRose, 
  DustMap,
  SensorHeader,
  SensorLayout,
  LoadingState,
  ErrorState
} from '@features_environmental';
import { calculateWindRoseData, calculateDailyAverages } from '@api/sensors/dust/transformations';

type ViewMode = 'table' | 'chart' | 'calendar';

// Enhanced types that match the API response structure
interface DustRecord {
  dateTime: string;
  pm10: number;
  pm2_5: number;
  id: string;
  deviceName: string;
  dustLevel: number;
  unit: string;
  windSpeed?: number;
  windDirection?: number;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  remarks?: string;
  [key: string]: any;
}

interface DustDevice {
  id: string;
  deviceName: string;
  deviceModel: string;
  latitude: number;
  longitude: number;
  childRecords: DustRecord[];
  deviceType?: string;
  deviceClass?: string;
  deviceStatus?: string;
  [key: string]: any;
}

interface DustData {
  devices: DustDevice[];
  timestamp?: string;
  project?: string;
  location?: string;
  [key: string]: any;
}

export function DustMonitoring() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [dustData, setDustData] = useState<DustData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set(['all']));
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [selectedParameters, setSelectedParameters] = useState<Set<'pm10' | 'pm2_5'>>(new Set(['pm10', 'pm2_5']));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const client = new DustApiClient();
        const data = await client.fetchDustData();
        // Cast the data to match our DustData interface since we know the structure
        setDustData(data as DustData);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load dust monitoring data');
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const devices = dustData?.devices.map((device: DustDevice) => ({
    id: device.id,
    name: device.deviceName,
    model: device.deviceModel
  })) || [];

  // Ensure dustData is not null when passing to functions
  const windRoseData = calculateWindRoseData(dustData || { devices: [] }, selectedDevices, dateRange);
  const monthlyData = calculateDailyAverages(dustData || { devices: [] }, selectedDevices, dateRange, selectedParameters);

  const handleDownloadCSV = () => {
    // ... CSV download logic (unchanged)
  };

  if (isLoading) {
    return <LoadingState backLink="/environmental" backText="Back to Environmental Tests" />;
  }

  if (error) {
    return <ErrorState error={error} backLink="/environmental" backText="Back to Environmental Tests" />;
  }

  // Provide a default empty data structure if dustData is null
  const safeData: DustData = dustData || { devices: [] };

  return (
    <SensorLayout backLink="/environmental" backText="Back to Environmental Tests">
      <SensorHeader
        title="Dust Monitoring"
        description="Monitor dust levels and air quality metrics across the project"
        onDownload={handleDownloadCSV}
      />

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <DeviceSelector
          devices={devices}
          selectedDevices={selectedDevices}
          onChange={(value) => {
            setSelectedDevices(prev => {
              const next = new Set(prev);
              if (value === 'all') {
                return next.has('all') ? new Set() : new Set(['all']);
              }
              next.delete('all');
              if (next.has(value)) {
                next.delete(value);
                if (next.size === 0) next.add('all');
              } else {
                next.add(value);
              }
              return next;
            });
          }}
        />

        <DateRangeSelector
          dateRange={dateRange}
          onChange={setDateRange}
        />
      </div>

      {/* View Mode Selector */}
      <div className="flex justify-end mb-6">
        <ViewModeToggle
          mode={viewMode}
          onChange={setViewMode}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Wind Rose */}
          <Card className="p-6 h-[500px]" hover>
            <WindRose data={windRoseData} />
          </Card>

          {/* Map */}
          <Card className="p-6" hover>
            <DustMap data={safeData} />
          </Card>
        </div>

        {/* Right Column - Chart/Table/Calendar */}
        <div className="col-span-2">
          <Card className="p-6" hover>
            {viewMode === 'calendar' && (
              <DustCalendar 
                data={monthlyData} 
                selectedParameters={selectedParameters}
                onParameterChange={setSelectedParameters}
              />
            )}
            {viewMode === 'chart' && (
              <DustChart 
                data={{
                  ...safeData,
                  devices: safeData.devices
                    .filter((device: DustDevice) => 
                      selectedDevices.has('all') || selectedDevices.has(device.id)
                    )
                    .map((device: DustDevice) => ({
                      ...device,
                      childRecords: device.childRecords.filter((record: DustRecord) => {
                        const recordDate = new Date(record.dateTime);
                        return (!dateRange[0] || recordDate >= dateRange[0]) &&
                               (!dateRange[1] || recordDate <= dateRange[1]);
                      })
                    }))
                }} 
              />
            )}
            {viewMode === 'table' && (
              <DustTable 
                data={{
                  ...safeData,
                  devices: safeData.devices
                    .filter((device: DustDevice) => 
                      selectedDevices.has('all') || selectedDevices.has(device.id)
                    )
                    .map((device: DustDevice) => ({
                      ...device,
                      childRecords: device.childRecords.filter((record: DustRecord) => {
                        const recordDate = new Date(record.dateTime);
                        return (!dateRange[0] || recordDate >= dateRange[0]) &&
                               (!dateRange[1] || recordDate <= dateRange[1]);
                      })
                    }))
                }}
              />
            )}
          </Card>
        </div>
      </div>
    </SensorLayout>
  );
}