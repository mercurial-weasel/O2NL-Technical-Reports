import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DeviceSelector } from '../../../../components/Dashboards/Common/DeviceSelector';

describe('DeviceSelector', () => {
  const defaultProps = {
    devices: [
      { id: 'device1', name: 'Device 1', model: 'Model A' },
      { id: 'device2', name: 'Device 2', model: 'Model B' },
      { id: 'device3', name: 'Device 3' }
    ],
    selectedDevices: new Set(['all']),
    onChange: vi.fn()
  };

  it('renders correctly with default props', () => {
    render(<DeviceSelector {...defaultProps} />);
    expect(screen.getByText('Select Devices')).toBeInTheDocument();
  });

  it('displays device names with models when available', () => {
    render(<DeviceSelector {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Device 1 (Model A)')).toBeInTheDocument();
    expect(screen.getByText('Device 2 (Model B)')).toBeInTheDocument();
    expect(screen.getByText('Device 3')).toBeInTheDocument();
  });

  it('shows selected devices count', () => {
    render(
      <DeviceSelector 
        {...defaultProps} 
        selectedDevices={new Set(['device1', 'device2'])}
      />
    );
    expect(screen.getByText('2 selected')).toBeInTheDocument();
  });

  it('calls onChange when device is selected', () => {
    render(<DeviceSelector {...defaultProps} />);
    
    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Device 1 (Model A)'));
    
    expect(defaultProps.onChange).toHaveBeenCalledWith('device1');
  });
});