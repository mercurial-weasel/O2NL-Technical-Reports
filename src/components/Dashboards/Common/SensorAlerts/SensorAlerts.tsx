import React from 'react';
import { Card } from '../../../common/Card';
import { Bell } from 'lucide-react';

interface Alert {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: string;
  device: string;
}

interface SensorAlertsProps {
  alerts: Alert[];
}

export function SensorAlerts({ alerts }: SensorAlertsProps) {
  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'critical':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-blue-400 bg-blue-400/10';
    }
  };

  const formatTime = (timestamp: string) => {
    // Create a date object from the UTC timestamp
    const date = new Date(timestamp);
    
    // Format the time in 12-hour format with AM/PM
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'UTC' // Ensure UTC time is used
    }).format(date);
  };

  return (
    <Card className="p-4" hover>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-text-primary">Recent Alerts</h3>
        <div className="relative">
          <div 
            data-testid="notification-badge"
            className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" 
          />
          <Bell className="w-5 h-5 text-text-secondary" />
        </div>
      </div>
      <div className="space-y-3">
        {alerts.map(alert => (
          <article
            key={alert.id}
            data-testid={`alert-${alert.id}`}
            className={`p-3 rounded-lg ${getAlertColor(alert.type)}`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{alert.message}</p>
                <p className="text-xs text-text-secondary">{alert.device}</p>
              </div>
              <time 
                dateTime={alert.timestamp}
                className="text-xs text-text-secondary"
              >
                {formatTime(alert.timestamp)}
              </time>
            </div>
          </article>
        ))}
      </div>
    </Card>
  );
}