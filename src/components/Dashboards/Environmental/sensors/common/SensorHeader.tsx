import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../../../../common/Button';

interface SensorHeaderProps {
  title: string;
  description: string;
  onDownload?: () => void;
}

export function SensorHeader({ title, description, onDownload }: SensorHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
        
        {onDownload && (
          <Button
            onClick={onDownload}
            variant="secondary"
            size="sm"
            icon={Download}
          >
            Download CSV
          </Button>
        )}
      </div>
      <p className="text-text-secondary">{description}</p>
    </div>
  );
}