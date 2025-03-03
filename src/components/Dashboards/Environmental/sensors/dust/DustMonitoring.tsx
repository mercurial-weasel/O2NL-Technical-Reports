import React, { useState, useEffect } from 'react';
import { Card } from '../../../../common/Card';
import { DustApiClient } from '../../../../../api/sensors/dust/client';
import { DustTable } from './components/DustTable';
import { DustChart } from './components/DustChart';
import { DustCalendar } from './components/DustCalendar';
import { WindRose } from './components/WindRose';
import { DustMap } from './components/DustMap';
import { calculateWindRoseData, calculateDailyAverages } from '../../../../../api/sensors/dust/transformations';

// Import common components
import {
  DateRangeSelector,
  DeviceSelector,
  ViewModeToggle,
  ParameterSelector,
  SensorHeader,
  SensorLayout,
  LoadingState,
  ErrorState
} from '../common';

type ViewMode = 'table' | 'chart' | 'calendar';

export function DustMonitoring() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [dustData, setDustData] = useState<any>(null);
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
        setDustData(data);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to load dust monitoring data');
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingState backLink="/environmental" backText="Back to Environmental Tests" />;
  }

  if (error) {
    return <ErrorState error={error} backLink="/environmental" backText="Back to Environmental Tests" />;
  }

  const devices = dustData.devices.map(device => ({
    id: device.id,
    name: device.deviceName,
    model: device.deviceModel
  }));

  const windRoseData = calculateWindRoseData(dustData, selectedDevices, dateRange);
  const monthlyData = calculateDailyAverages(dustData, selectedDevices, dateRange, selectedParameters);

  const handleDownloadCSV = () => {
    // ... CSV download logic (unchanged)
  };

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
            <DustMap data={dustData} />
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
                  ...dustData,
                  devices: dustData.devices.filter(device => 
                    selectedDevices.has('all') || selectedDevices.has(device.id)
                  ).map(device => ({
                    ...device,
                    childRecords: device.childRecords.filter(record => {
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
                  ...dustData,
                  devices: dustData.devices.filter(device => 
                    selectedDevices.has('all') || selectedDevices.has(device.id)
                  ).map(device => ({
                    ...device,
                    childRecords: device.childRecords.filter(record => {
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