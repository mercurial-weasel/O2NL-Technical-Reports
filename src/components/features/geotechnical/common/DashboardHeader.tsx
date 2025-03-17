import React from 'react';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AlertBox } from '@common/AlertBox';

interface DashboardHeaderProps {
  title: string;
  backTo?: string;
  backText?: string;
  isLoading?: boolean;
  isReloading?: boolean;
  lastLoadTime?: Date | null | string;
  onReload?: () => void;
  error?: string | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  backTo = '/',
  backText = 'Back',
  isLoading = false,
  isReloading = false,
  lastLoadTime,
  onReload,
  error
}) => {
  // Format the last load time safely
  const formatLastLoadTime = () => {
    if (!lastLoadTime) return null;
    
    try {
      // Handle string or Date object
      if (typeof lastLoadTime === 'string') {
        return new Date(lastLoadTime).toLocaleTimeString();
      } else if (lastLoadTime instanceof Date) {
        return lastLoadTime.toLocaleTimeString();
      }
      return null;
    } catch (e) {
      console.error('Error formatting lastLoadTime:', e);
      return null;
    }
  };
  
  const formattedTime = formatLastLoadTime();

  return (
    <div className="mb-6">
      {/* Back link */}
      <Link 
        to={backTo} 
        className="inline-flex items-center mb-4 text-sm text-text-primary hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> {backText}
      </Link>
      
      <div className="flex justify-between items-start md:items-center flex-col md:flex-row mb-2">
        <h1 className="text-2xl font-bold text-text-primary mb-2 md:mb-0">{title}</h1>
        
        {/* Reload controls */}
        {onReload && (
          <div className="flex items-center">
            {formattedTime && (
              <span className="text-sm text-text-muted mr-3">
                Last updated: {formattedTime}
              </span>
            )}
            <button
              onClick={onReload}
              disabled={isLoading || isReloading}
              className="inline-flex items-center px-3 py-1.5 border border-border-subtle rounded-md bg-background-card text-text-primary 
                         hover:bg-background-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 mr-1.5 ${isReloading ? 'animate-spin' : ''}`} />
              {isReloading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
        )}
      </div>
      
      {/* Error display */}
      {error && (
        <div className="mt-4">
          <AlertBox 
            title="Error"
            message={error}
            variant="error"
            action={onReload ? { label: "Retry", onClick: onReload } : undefined}
          />
        </div>
      )}
    </div>
  );
};
