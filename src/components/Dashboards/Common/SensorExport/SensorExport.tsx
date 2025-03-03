import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../../../common/Button';

interface SensorExportProps {
  onExport: () => void;
  loading?: boolean;
}

export function SensorExport({ onExport, loading }: SensorExportProps) {
  return (
    <Button
      onClick={onExport}
      variant="secondary"
      size="sm"
      icon={Download}
      loading={loading}
    >
      Export Data
    </Button>
  );
}