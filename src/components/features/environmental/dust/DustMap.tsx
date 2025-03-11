import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { DustData } from '@api/environmental/sensors';
import { getDeviceLocations } from '@api/environmental/sensors';
import { calculateMapData } from '@api/environmental/sensors';
import 'leaflet/dist/leaflet.css';

interface DustMapProps {
  data: DustData;
}

// Create custom icons for different device statuses
const icons = {
  Active: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  Maintenance: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

export function DustMap({ data }: DustMapProps) {
  const locations = getDeviceLocations(data);

  // Calculate center point
  const center = locations.length > 0
    ? [
        locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length,
        locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length
      ] as [number, number]
    : [-41.2865, 175.1547] as [number, number]; // Default to Ōtaki region

  return (
    <div className="h-[400px] rounded-lg overflow-hidden border border-gray-700">
      <MapContainer
        center={center}
        zoom={11}
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
            icon={icons[location.status as keyof typeof icons] || icons.Active}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-medium text-gray-900">{location.name}</h3>
                <p className="text-sm text-gray-600">Status: {location.status}</p>
                <p className="text-sm text-gray-600">
                  Last Reading: {new Date(location.lastReading.dateTime).toLocaleString()}
                </p>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <p>PM10: {location.lastReading.pm10.toFixed(2)} µg/m³</p>
                  <p>PM2.5: {location.lastReading.pm2_5.toFixed(2)} µg/m³</p>
                  <p>Temperature: {location.lastReading.temperature.toFixed(1)}°C</p>
                  <p>Humidity: {location.lastReading.humidity.toFixed(1)}%</p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}