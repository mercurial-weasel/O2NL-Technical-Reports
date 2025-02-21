import React, { useState, useEffect } from 'react';
import { BarChart2, Table2, Download, Calendar } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Header } from '../../../../common/Header';
import { Footer } from '../../../../common/Footer';
import { Section } from '../../../../common';
import { Card } from '../../../../common/Card';
import { Button } from '../../../../common/Button';
import { BackNavigation } from '../../../../common/BackNavigation';
import { MultiSelectFilter } from '../../../../common/Filters';
import { DustApiClient } from '../../../../../api/sensors/dust/client';
import { DustTable } from './components/DustTable';
import { DustChart } from './components/DustChart';
import { DustCalendar } from './components/DustCalendar';
import { WindRose } from './components/WindRose';
import { DustMap } from './components/DustMap';
import { calculateWindRoseData, calculateDailyAverages } from '../../../../../api/sensors/dust/transformations';
import { logger } from '../../../../../lib/logger';

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
        logger.error('Dust monitoring data fetch failed', { error: error.message });
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownloadCSV = () => {
    try {
      if (!dustData) return;

      // Filter data based on selected devices and date range
      const filteredData = dustData.devices
        .filter(device => selectedDevices.has('all') || selectedDevices.has(device.id))
        .flatMap(device => device.childRecords
          .filter(record => {
            const recordDate = new Date(record.dateTime);
            return (!dateRange[0] || recordDate >= dateRange[0]) &&
                   (!dateRange[1] || recordDate <= dateRange[1]);
          })
          .map(record => ({
            deviceName: device.deviceName,
            deviceModel: device.deviceModel,
            manufacturer: device.manufacturer,
            organisation: device.organisation,
            ...record
          }))
        );

      // Create CSV content
      const headers = [
        'Device Name',
        'Device Model',
        'Manufacturer',
        'Organisation',
        'Date/Time',
        'PM10',
        'PM2.5',
        'Temperature',
        'Humidity',
        'Wind Speed',
        'Wind Direction',
        'Compliance Status',
        'Staff',
        'Remarks'
      ];

      const rows = filteredData.map(record => [
        record.deviceName,
        record.deviceModel || '',
        record.manufacturer || '',
        record.organisation || '',
        new Date(record.dateTime).toLocaleString(),
        record.pm10.toString(),
        record.pm2_5.toString(),
        record.temperature.toString(),
        record.humidity.toString(),
        record.windSpeed.toString(),
        record.windDirection.toString(),
        record.complianceStatus,
        record.staff,
        record.remarks || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'dust_monitoring_data.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      logger.info('Dust monitoring CSV download completed');
    } catch (error) {
      logger.error('Dust monitoring CSV download failed', { error });
      // You might want to show a user-friendly error message here
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-text-secondary">Loading dust monitoring data...</div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background-base">
        <Header />
        <div className="pt-24">
          <Section className="py-8">
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
              <div className="text-red-400">
                Error loading dust monitoring data: {error.message}
              </div>
            </div>
          </Section>
        </div>
        <Footer />
      </div>
    );
  }

  const deviceOptions = dustData.devices.map(device => ({
    value: device.id,
    label: `${device.deviceName} (${device.deviceModel || 'Unknown Model'})`
  }));

  const windRoseData = calculateWindRoseData(dustData, selectedDevices, dateRange);
  const monthlyData = calculateDailyAverages(dustData, selectedDevices, dateRange, selectedParameters);

  return (
    <div className="min-h-screen bg-background-base">
      <Header />
      <div className="pt-24">
        <Section className="py-8">
          <BackNavigation to="/environmental" text="Back to Environmental Tests" />
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-text-primary">Dust Monitoring</h1>
              
              <div className="flex items-center gap-4">
                {/* Download Button */}
                <Button
                  onClick={handleDownloadCSV}
                  variant="secondary"
                  size="sm"
                  icon={Download}
                >
                  Download CSV
                </Button>
              </div>
            </div>
            <p className="text-text-secondary">
              Monitor dust levels and air quality metrics across the project
            </p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Select Devices
              </label>
              <MultiSelectFilter
                options={deviceOptions}
                selectedValues={selectedDevices}
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
                placeholder="Select Devices"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">
                Date Range
              </label>
              <div className="flex items-center gap-4">
                <DatePicker
                  selected={dateRange[0]}
                  onChange={(date) => setDateRange([date, dateRange[1]])}
                  selectsStart
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  placeholderText="Start Date"
                  className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  wrapperClassName="flex-1"
                />
                <DatePicker
                  selected={dateRange[1]}
                  onChange={(date) => setDateRange([dateRange[0], date])}
                  selectsEnd
                  startDate={dateRange[0]}
                  endDate={dateRange[1]}
                  minDate={dateRange[0]}
                  placeholderText="End Date"
                  className="bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
                  wrapperClassName="flex-1"
                />
              </div>
            </div>
          </div>

          {/* View Mode Selector */}
          <div className="flex justify-end mb-6">
            <div className="flex items-center bg-gray-800/50 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Calendar</span>
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'chart'
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <BarChart2 className="w-4 h-4" />
                <span>Chart</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'table'
                    ? 'bg-brand-primary text-white'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                <Table2 className="w-4 h-4" />
                <span>Table</span>
              </button>
            </div>
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
        </Section>
      </div>
      <Footer />
    </div>
  );
}