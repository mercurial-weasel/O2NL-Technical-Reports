import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SensorMap } from '../../../../components/Dashboards/Common/Map/SensorMap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Mock react-leaflet components
vi.mock('react-leaflet', () => ({
  MapContainer: vi.fn(({ children }) => <div data-testid="map-container">{children}</div>),
  TileLayer: vi.fn(() => <div data-testid="tile-layer" />),
  Marker: vi.fn(({ children }) => <div data-testid="map-marker">{children}</div>),
  Popup: vi.fn(({ children }) => <div data-testid="map-popup">{children}</div>)
}));

// Mock Leaflet Icon
vi.mock('leaflet', () => ({
  Icon: vi.fn()
}));

describe('SensorMap', () => {
  const defaultProps = {
    locations: [
      {
        id: 'sensor1',
        name: 'Sensor 1',
        latitude: -40.7500,
        longitude: 175.1500,
        status: 'active',
        popupContent: <div>Sensor 1 Details</div>
      },
      {
        id: 'sensor2',
        name: 'Sensor 2',
        latitude: -40.7600,
        longitude: 175.1600,
        status: 'maintenance',
        popupContent: <div>Sensor 2 Details</div>
      }
    ],
    statusIcons: {
      active: new Icon({}),
      maintenance: new Icon({}),
      fault: new Icon({}),
      default: new Icon({})
    },
    defaultCenter: [-41.2865, 175.1547] as [number, number],
    defaultZoom: 11
  };

  it('renders map container with correct props', () => {
    render(<SensorMap {...defaultProps} />);
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
  });

  it('renders tile layer', () => {
    render(<SensorMap {...defaultProps} />);
    const tileLayer = screen.getByTestId('tile-layer');
    expect(tileLayer).toBeInTheDocument();
  });

  it('renders markers for each location', () => {
    render(<SensorMap {...defaultProps} />);
    const markers = screen.getAllByTestId('map-marker');
    expect(markers).toHaveLength(defaultProps.locations.length);
  });

  it('renders popups for each marker', () => {
    render(<SensorMap {...defaultProps} />);
    const popups = screen.getAllByTestId('map-popup');
    expect(popups).toHaveLength(defaultProps.locations.length);
  });

  it('displays location information in popups', () => {
    render(<SensorMap {...defaultProps} />);
    defaultProps.locations.forEach(location => {
      expect(screen.getByText(location.popupContent.props.children)).toBeInTheDocument();
    });
  });

  it('handles empty locations array', () => {
    render(<SensorMap {...defaultProps} locations={[]} />);
    expect(screen.queryAllByTestId('map-marker')).toHaveLength(0);
  });

  it('applies correct styles to map container', () => {
    render(<SensorMap {...defaultProps} />);
    const container = screen.getByTestId('map-container');
    expect(container.parentElement).toHaveClass(
      'h-[400px]',
      'rounded-lg',
      'overflow-hidden',
      'border',
      'border-gray-700'
    );
  });

  it('uses default center when no locations provided', () => {
    render(<SensorMap {...defaultProps} locations={[]} />);
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toHaveAttribute('center', defaultProps.defaultCenter.toString());
  });

  it('uses default zoom level', () => {
    render(<SensorMap {...defaultProps} />);
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toHaveAttribute('zoom', defaultProps.defaultZoom.toString());
  });

  it('uses correct status icons for markers', () => {
    render(<SensorMap {...defaultProps} />);
    const markers = screen.getAllByTestId('map-marker');
    
    markers.forEach((marker, index) => {
      const location = defaultProps.locations[index];
      expect(marker).toHaveAttribute(
        'icon',
        defaultProps.statusIcons[location.status as keyof typeof defaultProps.statusIcons]
      );
    });
  });

  it('calculates center point from locations', () => {
    const { locations } = defaultProps;
    const expectedCenter = [
      locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length,
      locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length
    ];

    render(<SensorMap {...defaultProps} />);
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toHaveAttribute('center', expectedCenter.toString());
  });
});