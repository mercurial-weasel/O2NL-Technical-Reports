import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SensorFilters } from '../../../../components/Dashboards/Common/SensorFilters/SensorFilters';

describe('SensorFilters', () => {
  const defaultProps = {
    devices: [
      { id: 'device1', name: 'Device 1', model: 'Model A' },
      { id: 'device2', name: 'Device 2', model: 'Model B' }
    ],
    selectedDevices: new Set(['all']),
    onDeviceChange: vi.fn(),
    dateRange: [null, null] as [Date | null, Date | null],
    onDateRangeChange: vi.fn(),
    selectedParameters: new Set(['pm10', 'pm2_5']),
    onParameterChange: vi.fn(),
    parameters: [
      { key: 'pm10', label: 'PM10' },
      { key: 'pm2_5', label: 'PM2.5' }
    ]
  };

  it('renders all filter sections', () => {
    render(<SensorFilters {...defaultProps} />);
    expect(screen.getByText('Select Devices')).toBeInTheDocument();
    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getByText('Parameters')).toBeInTheDocument();
  });

  it('handles device selection', () => {
    render(<SensorFilters {...defaultProps} />);
    fireEvent.click(screen.getByTestId('multiselect-trigger'));
    fireEvent.click(screen.getByTestId('multiselect-option-device1'));
    expect(defaultProps.onDeviceChange).toHaveBeenCalled();
  });

  it('handles date range selection', () => {
    render(<SensorFilters {...defaultProps} />);
    const startDateInput = screen.getByPlaceholderText('Start Date');
    fireEvent.change(startDateInput, { target: { value: '2025-01-01' } });
    expect(defaultProps.onDateRangeChange).toHaveBeenCalled();
  });

  it('handles parameter selection', () => {
    render(<SensorFilters {...defaultProps} />);
    fireEvent.click(screen.getByTestId('parameter-pm10'));
    expect(defaultProps.onParameterChange).toHaveBeenCalled();
  });

  it('shows selected parameters correctly', () => {
    render(<SensorFilters {...defaultProps} />);
    const pm10Button = screen.getByTestId('parameter-pm10');
    const pm25Button = screen.getByTestId('parameter-pm2_5');
    
    expect(pm10Button).toHaveClass('bg-brand-primary', 'text-white');
    expect(pm25Button).toHaveClass('bg-brand-primary', 'text-white');
  });

  it('applies correct grid layout', () => {
    render(<SensorFilters {...defaultProps} />);
    const container = screen.getByTestId('sensor-filters');
    expect(container).toHaveClass('grid', 'grid-cols-3', 'gap-4', 'mb-6');
  });

  it('handles empty device list', () => {
    render(<SensorFilters {...defaultProps} devices={[]} />);
    expect(screen.getByTestId('multiselect-trigger')).toBeInTheDocument();
  });

  it('handles empty parameters list', () => {
    render(<SensorFilters {...defaultProps} parameters={[]} />);
    expect(screen.queryByTestId('parameter-pm10')).not.toBeInTheDocument();
  });

  it('provides proper ARIA labeling', () => {
    render(<SensorFilters {...defaultProps} />);
    const container = screen.getByRole('region');
    expect(container).toHaveAttribute('aria-label', 'Sensor Filters');
  });
});