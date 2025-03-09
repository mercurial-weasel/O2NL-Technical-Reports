import React from 'react';
import { SensorLayout } from './SensorLayout';

interface LoadingStateProps {
  backLink: string;
  backText: string;
}

export function LoadingState({ backLink, backText }: LoadingStateProps) {
  return (
    <SensorLayout backLink={backLink} backText={backText}>
      <div className="flex items-center justify-center h-64">
        <div className="text-text-secondary">Loading sensor data...</div>
      </div>
    </SensorLayout>
  );
}