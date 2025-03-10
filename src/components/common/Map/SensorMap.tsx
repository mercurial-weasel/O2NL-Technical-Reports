import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface SensorLocation {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  status: string;
  popupContent: React.ReactNode;
}

interface SensorMapProps {
  locations: SensorLocation[];
  statusIcons: Record<string, Icon>;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

export function SensorMap({ 
  locations, 
  statusIcons, 
  defaultCenter = [-41.2865, 175.1547],
  defaultZoom = 11 
}: SensorMapProps) {
  // Calculate center point if locations exist
  const center = locations.length > 0
    ? [
        locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length,
        locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length
      ] as [number, number]
    : defaultCenter;

  return (
    <div className="h-[400px] rounded-lg overflow-hidden border border-gray-700">
      <MapContainer
        center={center}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={statusIcons[location.status] || statusIcons['default']}
          >
            <Popup>
              {location.popupContent}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}