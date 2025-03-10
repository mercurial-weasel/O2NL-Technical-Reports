import React from 'react';
import { EquipmentStatus } from '@api/equipment/types';

interface EquipmentTableProps {
  equipment: EquipmentStatus[];
}

export function EquipmentTable({ equipment }: EquipmentTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Equipment ID</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Serial Number</th>
            <th className="py-3 px-4 text-center text-sm font-medium text-brand-secondary">Status</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Last Updated</th>
            <th className="py-3 px-4 text-right text-sm font-medium text-brand-secondary">Easting</th>
            <th className="py-3 px-4 text-right text-sm font-medium text-brand-secondary">Northing</th>
            <th className="py-3 px-4 text-right text-sm font-medium text-brand-secondary">Elevation</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Unit</th>
            <th className="py-3 px-4 text-left text-sm font-medium text-brand-secondary">Measurement Type</th>
          </tr>
        </thead>
        <tbody>
          {equipment.map((item) => (
            <tr key={item.equipmentId} className="border-b border-gray-700/50 hover:bg-gray-700/20">
              <td className="py-3 px-4 text-sm text-text-primary">{item.equipmentId}</td>
              <td className="py-3 px-4 text-sm text-text-secondary">{item.serialNumber}</td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'operational' ? 'bg-green-500/20 text-green-400' :
                  item.status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-400' :
                  item.status === 'fault' ? 'bg-red-500/20 text-red-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {item.status}
                </span>
              </td>
              <td className="py-3 px-4 text-sm text-text-secondary">
                {item.lastUpdated.date} {item.lastUpdated.time}
              </td>
              <td className="py-3 px-4 text-sm text-right text-text-secondary">{item.easting.toFixed(2)}</td>
              <td className="py-3 px-4 text-sm text-right text-text-secondary">{item.northing.toFixed(2)}</td>
              <td className="py-3 px-4 text-sm text-right text-text-secondary">{item.elevation.toFixed(2)}</td>
              <td className="py-3 px-4 text-sm text-text-secondary">{item.unit}</td>
              <td className="py-3 px-4 text-sm text-text-secondary">{item.measurementType}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}