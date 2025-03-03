import React from 'react';
import { MultiSelectFilter } from '../../../common/Filters';

interface DeviceSelectorProps {
  devices: Array<{ id: string; name: string; model?: string }>;
  selectedDevices: Set<string>;
  onChange: (value: string) => void;
}

export function DeviceSelector({ devices, selectedDevices, onChange }: DeviceSelectorProps) {
  const deviceOptions = devices.map(device => ({
    value: device.id,
    label: `${device.name} ${device.model ? `(${device.model})` : ''}`
  }));

  return (
    <div>
      <label className="block text-sm font-medium text-text-secondary mb-2">
        Select Devices
      </label>
      <MultiSelectFilter
        options={deviceOptions}
        selectedValues={selectedDevices}
        onChange={onChange}
        placeholder="Select Devices"
      />
    </div>
  );
}