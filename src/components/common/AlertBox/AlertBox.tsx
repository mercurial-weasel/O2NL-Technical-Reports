import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertBoxProps {
  title: string;
  message: string;
  variant?: AlertVariant;
  dismissible?: boolean;
  onDismiss?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const AlertBox: React.FC<AlertBoxProps> = ({
  title,
  message,
  variant = 'info',
  dismissible = false,
  onDismiss,
  action,
  className = ''
}) => {
  // Variant styles
  const variantStyles: Record<AlertVariant, {
    bg: string;
    border: string;
    text: string;
    icon: JSX.Element;
  }> = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-300',
      text: 'text-blue-800',
      icon: <Info className="h-5 w-5 text-blue-500" />
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-300',
      text: 'text-green-800',
      icon: <CheckCircle className="h-5 w-5 text-green-500" />
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-300',
      text: 'text-yellow-800',
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-300',
      text: 'text-red-800',
      icon: <AlertCircle className="h-5 w-5 text-red-500" />
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={`p-4 ${styles.bg} border ${styles.border} rounded-md ${className}`} role="alert">
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
        <div className="ml-3 w-full">
          <h3 className={`text-sm font-medium ${styles.text}`}>{title}</h3>
          <div className={`mt-1 text-sm ${styles.text} opacity-90`}>
            {typeof message === 'string' ? message : String(message)}
          </div>
          
          {action && (
            <div className="mt-3">
              <button
                onClick={action.onClick}
                className={`px-3 py-1.5 text-xs font-medium rounded-md 
                  ${variant === 'error' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 
                   variant === 'warning' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                   variant === 'success' ? 'bg-green-100 text-green-800 hover:bg-green-200' :
                   'bg-blue-100 text-blue-800 hover:bg-blue-200'}`}
              >
                {action.label}
              </button>
            </div>
          )}
        </div>
        
        {dismissible && (
          <button 
            className={`ml-auto flex-shrink-0 ${styles.text} hover:opacity-75`}
            onClick={onDismiss}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Dismiss</span>
          </button>
        )}
      </div>
    </div>
  );
};
