import React, { useEffect, useRef } from 'react';
import { MapIcon } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from 'react-leaflet';
import { NavItem } from '../../../../types/report';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface InteractiveMapProps {
  points: NavItem[];
  selectedLocation: [number, number];
}

// Component to handle map bounds updates
function MapBoundsUpdater({ points }: { points: NavItem[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;

    // Create bounds object from points
    const bounds = L.latLngBounds(points.map(point => point.coordinates));

    // Fit map to bounds with padding
    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 15
    });
  }, [map, points]);

  return null;
}

export function InteractiveMap({ points, selectedLocation }: InteractiveMapProps) {
  const mapRef = useRef<L.Map>(null);

  // Default center and zoom if no points
  const defaultProps = {
    center: selectedLocation,
    zoom: 13
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-brand-secondary" />
          <h3 className="text-lg font-medium text-brand-secondary">Interactive Map</h3>
        </div>
        <span className="text-sm text-text-muted">
          {points.length} points displayed
        </span>
      </div>
      <div className="h-[400px] rounded-lg overflow-hidden">
        <MapContainer
          {...defaultProps}
          ref={mapRef}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          
          {points.map((point) => (
            <Marker
              key={point.id}
              position={point.coordinates}
            >
              <Popup>
                <div className="font-medium">{point.name}</div>
                <div className="text-sm text-gray-600">{point.date}</div>
                <div className="text-sm text-gray-600">
                  Lat: {point.coordinates[0].toFixed(6)}<br />
                  Lon: {point.coordinates[1].toFixed(6)}
                </div>
              </Popup>
            </Marker>
          ))}

          <MapBoundsUpdater points={points} />
        </MapContainer>
      </div>
    </div>
  );
}