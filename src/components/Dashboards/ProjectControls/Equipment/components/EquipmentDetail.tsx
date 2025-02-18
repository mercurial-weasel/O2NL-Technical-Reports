import React, { useState } from 'react';
import { MapPin, Table, Download } from 'lucide-react';
import { EquipmentType, EquipmentStatus } from '../../../../../api/equipment/types';
import { EquipmentTable } from './EquipmentTable';
import { EquipmentMap } from './EquipmentMap';
import { Button } from '../../../../common/Button';
import { logger } from '../../../../../lib/logger';

interface EquipmentDetailProps {
  equipmentType: EquipmentType;
  onClose: () => void;
}

export function EquipmentDetail({ equipmentType, onClose }: EquipmentDetailProps) {
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table');
  const [equipmentIdFilter, setEquipmentIdFilter] = useState('');
  const [serialNumberFilter, setSerialNumberFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<EquipmentStatus['status'] | 'all'>('all');

  // Filter equipment based on current filters
  const filteredEquipment = equipmentType.equipment.filter(equipment => {
    const matchesEquipmentId = equipment.equipmentId.toLowerCase().includes(equipmentIdFilter.toLowerCase());
    const matchesSerialNumber = equipment.serialNumber.toLowerCase().includes(serialNumberFilter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || equipment.status === statusFilter;
    return matchesEquipmentId && matchesSerialNumber && matchesStatus;
  });

  const handleDownloadCSV = () => {
    try {
      // Define headers
      const headers = [
        'Equipment ID',
        'Serial Number',
        'Status',
        'Last Updated Date',
        'Last Updated Time',
        'Easting',
        'Northing',
        'Elevation',
        'Unit',
        'Measurement Type',
        'Key Metrics',
        'Alert Comments'
      ];

      // Create rows
      const rows = filteredEquipment.map(equipment => [
        equipment.equipmentId,
        equipment.serialNumber,
        equipment.status,
        equipment.lastUpdated.date,
        equipment.lastUpdated.time,
        equipment.easting.toString(),
        equipment.northing.toString(),
        equipment.elevation.toString(),
        equipment.unit,
        equipment.measurementType,
        equipment.keyMetrics,
        equipment.alert?.comments || ''
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and trigger download
      const date = new Date().toISOString().slice(0, 10);
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `equipment_${equipmentType.name.toLowerCase()}_${date}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      logger.info('Equipment CSV download completed', { type: equipmentType.name });
    } catch (error) {
      logger.error('Equipment CSV download failed', { error, type: equipmentType.name });
      // You might want to show a user-friendly error message here
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{equipmentType.name}</h2>
          <p className="text-text-secondary mt-1">{equipmentType.description}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={handleDownloadCSV}
            variant="secondary"
            size="sm"
            icon={Download}
          >
            Download CSV
          </Button>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Back to Overview
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Equipment ID
          </label>
          <input
            type="text"
            value={equipmentIdFilter}
            onChange={(e) => setEquipmentIdFilter(e.target.value)}
            placeholder="Filter by ID..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Serial Number
          </label>
          <input
            type="text"
            value={serialNumberFilter}
            onChange={(e) => setSerialNumberFilter(e.target.value)}
            placeholder="Filter by serial..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as EquipmentStatus['status'] | 'all')}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-primary"
          >
            <option value="all">All Statuses</option>
            <option value="operational">Operational</option>
            <option value="maintenance">Maintenance</option>
            <option value="fault">Fault</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex items-end">
          <div className="flex items-center bg-gray-800/50 rounded-lg p-0.5 w-full">
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-brand-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center justify-center gap-2 flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-brand-primary text-white'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <EquipmentTable equipment={filteredEquipment} />
      ) : (
        <EquipmentMap equipment={filteredEquipment} />
      )}
    </div>
  );
}