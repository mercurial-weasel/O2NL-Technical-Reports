import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { EquipmentStatus } from '@api/equipment/types';
import 'leaflet/dist/leaflet.css';

interface EquipmentMapProps {
  equipment: EquipmentStatus[];
}

// Create custom icons for different status types
const icons = {
  operational: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  maintenance: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  fault: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  }),
  offline: new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  })
};

// Function to convert NZTM to WGS84
function nztmToWgs84(easting: number, northing: number): [number, number] {
  // Approximate conversion for Auckland region
  // These are rough conversion factors that work for the Auckland region
  const lat = ((northing - 5900000) * 0.000009) + -36.8485;
  const lon = ((easting - 1760000) * 0.000009) + 174.7633;
  
  return [lat, lon];
}

export function EquipmentMap({ equipment }: EquipmentMapProps) {
  // Convert coordinates and calculate center
  const convertedCoordinates = equipment.map(item => ({
    ...item,
    coordinates: nztmToWgs84(item.easting, item.northing)
  }));

  // Calculate center point from converted coordinates
  const center = convertedCoordinates.length > 0
    ? [
        convertedCoordinates.reduce((sum, item) => sum + item.coordinates[0], 0) / convertedCoordinates.length,
        convertedCoordinates.reduce((sum, item) => sum + item.coordinates[1], 0) / convertedCoordinates.length
      ] as [number, number]
    : [-36.8485, 174.7633] as [number, number]; // Default to Auckland CBD

  return (
    <div className="h-[600px] rounded-lg overflow-hidden border border-gray-700">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {convertedCoordinates.map((item) => (
          <Marker
            key={item.equipmentId}
            position={item.coordinates}
            icon={icons[item.status]}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-medium text-gray-900">{item.equipmentId}</h3>
                <p className="text-sm text-gray-600">Serial: {item.serialNumber}</p>
                <p className="text-sm text-gray-600">
                  Status: <span className={
                    item.status === 'operational' ? 'text-green-600' :
                    item.status === 'maintenance' ? 'text-yellow-600' :
                    item.status === 'fault' ? 'text-red-600' :
                    'text-orange-600'
                  }>{item.status}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Last Updated: {item.lastUpdated.date} {item.lastUpdated.time}
                </p>
                <p className="text-sm text-gray-600">Key Metrics: {item.keyMetrics}</p>
                {item.alert && (
                  <div className="mt-2 p-2 bg-red-50 rounded">
                    <p className="text-sm text-red-700">{item.alert.comments}</p>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}