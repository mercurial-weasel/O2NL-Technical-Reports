import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { DustData } from '@api/sensors/dust/types';

interface DustTableProps {
  data: DustData;
}

type SortConfig = {
  field: string;
  direction: 'asc' | 'desc';
};

export function DustTable({ data }: DustTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: 'dateTime',
    direction: 'desc'
  });

  const handleSort = (field: string) => {
    setSortConfig(current => ({
      field,
      direction: current.field === field && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const renderSortIndicator = (field: string) => {
    if (sortConfig.field !== field) {
      return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    }
    return sortConfig.direction === 'asc' ? 
      <ArrowUp className="w-4 h-4" /> : 
      <ArrowDown className="w-4 h-4" />;
  };

  // Flatten and sort data
  const flattenedData = data.devices.flatMap(device => 
    device.childRecords.map(record => ({
      ...record,
      deviceModel: device.deviceModel,
      manufacturer: device.manufacturer,
      organisation: device.organisation,
      deviceStatus: device.deviceStatus
    }))
  );

  const sortedData = [...flattenedData].sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;
    
    if (sortConfig.field === 'dateTime') {
      return (new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()) * direction;
    }
    
    return String(a[sortConfig.field]).localeCompare(String(b[sortConfig.field])) * direction;
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th 
              onClick={() => handleSort('deviceName')}
              className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                Device
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('deviceName')}
                </span>
              </div>
            </th>
            <th 
              onClick={() => handleSort('dateTime')}
              className="py-3 px-4 text-left text-sm font-medium text-brand-secondary cursor-pointer group"
            >
              <div className="flex items-center gap-1 hover:text-brand-primary transition-colors">
                Date/Time
                <span className="transition-opacity duration-200 group-hover:opacity-100">
                  {renderSortIndicator('dateTime')}
                </span>
              </div>
            </th>
            <th className="py-3 px-4 text-right text-sm font-medium text-brand-secondary">PM10</th>
            <th className="py-3 px-4 text-right text-sm font-medium text-brand-secondary">PM2.5</th>
            <th className="py-3 px-4 text-right text-sm font-medium text-brand-secondary">Temperature</th>
            <th className="py-3 px-4 text-right text-sm font-medium text-brand-secondary">Humidity</th>
            <th className="py-3 px-4 text-right text-sm font-medium text-brand-secondary">Wind Speed</th>
            <th className="py-3 px-4 text-right text-sm font-medium text-brand-secondary">Wind Direction</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-brand-secondary">Status</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Staff</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((record) => (
            <tr key={record.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
              <td className="py-3 px-4 text-sm">
                <div>
                  <span className="text-text-primary">{record.deviceName}</span>
                  <span className="text-xs text-text-secondary block">
                    {record.deviceModel}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-text-secondary">
                {new Date(record.dateTime).toLocaleString()}
              </td>
              <td className="py-3 px-4 text-sm text-right text-text-secondary">
                {record.pm10.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-sm text-right text-text-secondary">
                {record.pm2_5.toFixed(2)}
              </td>
              <td className="py-3 px-4 text-sm text-right text-text-secondary">
                {record.temperature.toFixed(1)}°C
              </td>
              <td className="py-3 px-4 text-sm text-right text-text-secondary">
                {record.humidity.toFixed(1)}%
              </td>
              <td className="py-3 px-4 text-sm text-right text-text-secondary">
                {record.windSpeed.toFixed(1)} m/s
              </td>
              <td className="py-3 px-4 text-sm text-right text-text-secondary">
                {record.windDirection.toFixed(0)}°
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
                  record.complianceStatus === 'Compliant' ? 'bg-green-500/20 text-green-400' :
                  record.complianceStatus === 'Warning' ? 'bg-yellow-500/20 text-yellow-400' :
                  record.complianceStatus === 'Non-Compliant' ? 'bg-red-500/20 text-red-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {record.complianceStatus}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-text-secondary">
                {record.staff}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}