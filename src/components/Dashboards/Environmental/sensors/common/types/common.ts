import { ReactNode } from 'react';

export interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export interface Device {
  id: string;
  name: string;
  model?: string;
  status: string;
  location: {
    latitude: number;
    longitude: number;
  };
}

export interface ViewModeProps {
  mode: 'table' | 'chart' | 'calendar';
  onChange: (mode: 'table' | 'chart' | 'calendar') => void;
}

export interface SensorParameter {
  key: string;
  label: string;
  unit: string;
}

export interface MapLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
  popupContent: ReactNode;
}