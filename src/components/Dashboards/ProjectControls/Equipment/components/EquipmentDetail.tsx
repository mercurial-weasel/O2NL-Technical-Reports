import React, { useState } from 'react';
import { MapPin, Table } from 'lucide-react';
import { EquipmentType, EquipmentStatus } from '../../../../../api/equipment/types';
import { EquipmentTable } from './EquipmentTable';
import { EquipmentMap } from './EquipmentMap';

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">{equipmentType.name}</h2>
          <p className="text-text-secondary mt-1">{equipmentType.description}</p>
        </div>
        <button
          onClick={onClose}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          Back to Overview
        </button>
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