import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SensorAlerts } from '../../../../components/Dashboards/Common/SensorAlerts/SensorAlerts';

describe('SensorAlerts', () => {
  const defaultProps = {
    alerts: [
      {
        id: '1',
        type: 'warning',
        message: 'High PM10 levels detected',
        timestamp: '2025-02-20T10:30:00.000Z', // UTC timestamp
        device: 'Dust Monitor 1'
      },
      {
        id: '2',
        type: 'critical',
        message: 'Sensor malfunction',
        timestamp: '2025-02-20T10:25:00.000Z', // UTC timestamp
        device: 'Dust Monitor 2'
      }
    ]
  };

  it('renders correctly with default props', () => {
    render(<SensorAlerts {...defaultProps} />);
    expect(screen.getByText('Recent Alerts')).toBeInTheDocument();
    expect(screen.getByText('High PM10 levels detected')).toBeInTheDocument();
    expect(screen.getByText('Sensor malfunction')).toBeInTheDocument();
  });

  it('applies correct colors for different alert types', () => {
    render(<SensorAlerts {...defaultProps} />);
    
    const warningAlert = screen.getByTestId('alert-1');
    expect(warningAlert).toHaveClass('text-yellow-400', 'bg-yellow-400/10');
    
    const criticalAlert = screen.getByTestId('alert-2');
    expect(criticalAlert).toHaveClass('text-red-400', 'bg-red-400/10');
  });

  it('displays device names', () => {
    render(<SensorAlerts {...defaultProps} />);
    expect(screen.getByText('Dust Monitor 1')).toBeInTheDocument();
    expect(screen.getByText('Dust Monitor 2')).toBeInTheDocument();
  });

  it('formats timestamps correctly', () => {
    render(<SensorAlerts {...defaultProps} />);
    const times = screen.getAllByText(/\d{1,2}:\d{2}:\d{2} [AP]M/);
    expect(times).toHaveLength(2);
    expect(times[0]).toHaveTextContent('10:30:00 AM');
    expect(times[1]).toHaveTextContent('10:25:00 AM');
  });

  it('shows notification badge', () => {
    render(<SensorAlerts {...defaultProps} />);
    const badge = screen.getByTestId('notification-badge');
    expect(badge).toHaveClass(
      'absolute',
      '-top-1',
      '-right-1',
      'w-2',
      'h-2',
      'bg-red-500',
      'rounded-full',
      'animate-pulse'
    );
  });

  it('handles empty alerts array', () => {
    render(<SensorAlerts alerts={[]} />);
    expect(screen.getByText('Recent Alerts')).toBeInTheDocument();
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
  });

  it('maintains alert order', () => {
    render(<SensorAlerts {...defaultProps} />);
    const alerts = screen.getAllByRole('article');
    expect(alerts[0]).toHaveTextContent('High PM10 levels detected');
    expect(alerts[1]).toHaveTextContent('Sensor malfunction');
  });

  it('handles info type alerts', () => {
    const props = {
      alerts: [
        {
          id: '3',
          type: 'info',
          message: 'Calibration completed',
          timestamp: '2025-02-20T10:20:00.000Z',
          device: 'Dust Monitor 3'
        }
      ]
    };

    render(<SensorAlerts {...props} />);
    const infoAlert = screen.getByTestId('alert-3');
    expect(infoAlert).toHaveClass('text-blue-400', 'bg-blue-400/10');
  });
});