import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { InteractiveMap } from '../../../../components/Dashboards/Common/Map/InteractiveMap';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Mock react-leaflet components
vi.mock('react-leaflet', () => ({
  MapContainer: vi.fn(({ children }) => <div data-testid="map-container">{children}</div>),
  TileLayer: vi.fn(() => <div data-testid="tile-layer" />),
  Marker: vi.fn(({ children }) => <div data-testid="map-marker">{children}</div>),
  Popup: vi.fn(({ children }) => <div data-testid="map-popup">{children}</div>),
  useMap: vi.fn(() => ({
    fitBounds: vi.fn(),
  }))
}));

describe('InteractiveMap', () => {
  const defaultProps = {
    points: [
      {
        id: 'point1',
        name: 'Test Point 1',
        date: '2025-02-20',
        coordinates: [-40.7500, 175.1500]
      },
      {
        id: 'point2',
        name: 'Test Point 2',
        date: '2025-02-20',
        coordinates: [-40.7600, 175.1600]
      }
    ],
    selectedLocation: [-40.7500, 175.1500] as [number, number]
  };

  it('renders map container with correct props', () => {
    render(<InteractiveMap {...defaultProps} />);
    const mapContainer = screen.getByTestId('map-container');
    expect(mapContainer).toBeInTheDocument();
  });

  it('renders tile layer', () => {
    render(<InteractiveMap {...defaultProps} />);
    const tileLayer = screen.getByTestId('tile-layer');
    expect(tileLayer).toBeInTheDocument();
  });

  it('renders markers for each point', () => {
    render(<InteractiveMap {...defaultProps} />);
    const markers = screen.getAllByTestId('map-marker');
    expect(markers).toHaveLength(defaultProps.points.length);
  });

  it('renders popups for each marker', () => {
    render(<InteractiveMap {...defaultProps} />);
    const popups = screen.getAllByTestId('map-popup');
    expect(popups).toHaveLength(defaultProps.points.length);
  });

  it('displays point information in popups', () => {
    render(<InteractiveMap {...defaultProps} />);
    defaultProps.points.forEach(point => {
      expect(screen.getByText(point.name)).toBeInTheDocument();
      expect(screen.getByText(point.date)).toBeInTheDocument();
    });
  });

  it('handles empty points array', () => {
    render(<InteractiveMap points={[]} selectedLocation={defaultProps.selectedLocation} />);
    expect(screen.queryAllByTestId('map-marker')).toHaveLength(0);
  });

  it('applies correct styles to map container', () => {
    render(<InteractiveMap {...defaultProps} />);
    const container = screen.getByTestId('map-container');
    expect(container.parentElement).toHaveClass(
      'bg-gray-800/50',
      'border',
      'border-gray-700',
      'rounded-lg',
      'p-4'
    );
  });

  it('displays correct header information', () => {
    render(<InteractiveMap {...defaultProps} />);
    expect(screen.getByText('Interactive Map')).toBeInTheDocument();
    expect(screen.getByText(`${defaultProps.points.length} points displayed`)).toBeInTheDocument();
  });

  it('handles single point', () => {
    const singlePoint = {
      points: [defaultProps.points[0]],
      selectedLocation: defaultProps.selectedLocation
    };
    render(<InteractiveMap {...singlePoint} />);
    expect(screen.getAllByTestId('map-marker')).toHaveLength(1);
    expect(screen.getByText('1 points displayed')).toBeInTheDocument();
  });
});