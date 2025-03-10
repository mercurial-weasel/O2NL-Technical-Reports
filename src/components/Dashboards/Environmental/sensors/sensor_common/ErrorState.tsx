import React from 'react';
import { SensorLayout } from './SensorLayout';

interface ErrorStateProps {
  error: Error;
  backLink: string;
  backText: string;
}

export function ErrorState({ error, backLink, backText }: ErrorStateProps) {
  return (
    <SensorLayout backLink={backLink} backText={backText}>
      <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
        <div className="text-red-400">
          Error loading sensor data: {error.message}
        </div>
      </div>
    </SensorLayout>
  );
}