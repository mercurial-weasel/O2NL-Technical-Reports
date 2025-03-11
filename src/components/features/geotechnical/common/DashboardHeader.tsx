import React from 'react';
import { RefreshCw } from 'lucide-react';
import { BackNavigation } from '@common/BackNavigation/BackNavigation';
import { Button } from '@common/Button/Button';

interface DashboardHeaderProps {
  title: string;
  backTo: string;
  backText: string;
  isLoading: boolean;
  isReloading: boolean;
  lastLoadTime: string | null;
  onReload: () => void;
  error?: Error | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  backTo,
  backText,
  isLoading,
  isReloading,
  lastLoadTime,
  onReload,
  error
}) => {
  return (
    <>
      <BackNavigation to={backTo} text={backText} />
      
      {/* Status Bar */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-primary">{title}</h1>

        <div className="flex items-center gap-4">
          {/* Loading Status */}
          {isLoading && !isReloading && (
            <span className="text-sm text-text-muted">Loading data...</span>
          )}
          
          {/* Last Load Time */}
          {lastLoadTime && (
            <span className="text-sm text-text-muted">
              Last updated: {new Date(lastLoadTime).toLocaleTimeString()}
            </span>
          )}

          {/* Reload Button */}
          <Button
            onClick={onReload}
            disabled={isLoading || isReloading}
            variant="secondary"
            size="sm"
            icon={RefreshCw}
            loading={isReloading}
          >
            {isReloading ? 'Reloading...' : 'Reload Data'}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-2 bg-red-500/10 border border-red-500 rounded text-sm text-red-400">
          {error.message}
        </div>
      )}
    </>
  );
};
