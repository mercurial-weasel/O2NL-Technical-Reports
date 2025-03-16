import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Atterbergs, getSoilClassification } from '@api/geotechnical/plasticity';
import { Icon, Marker as LeafletMarker } from 'leaflet';

// Default marker icon fix for Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import markerSelectedIcon from 'leaflet/dist/images/marker-icon-2x.png'; // Using 2x icon as selected marker

// Fix default icon issue in Leaflet with React
const defaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'marker-icon-red' // Apply CSS class for red color
});

const selectedIcon = new Icon({
  iconUrl: markerSelectedIcon,
  shadowUrl: markerShadow,
  iconSize: [30, 45],  // Slightly bigger
  iconAnchor: [15, 45],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'marker-icon-green' // Apply CSS class for green color
});

interface MapComponentProps {
  data: Atterbergs[];
  selectedItems: Set<string>;
  onItemSelect: (itemId: string, mode: 'add' | 'remove' | 'toggle') => void;
  onPopupOpen?: (item: Atterbergs) => void;
}

// Custom marker component that supports keyboard modifiers for selection
const SelectableMarker: React.FC<{
  item: Atterbergs,
  isSelected: boolean,
  onSelect: (itemId: string, mode: 'add' | 'remove' | 'toggle') => void,
  onPopupOpen?: (item: Atterbergs) => void
}> = ({ item, isSelected, onSelect, onPopupOpen }) => {
  const markerRef = useRef<LeafletMarker>(null);
  
  const handleMarkerClick = (e: any) => {
    // Check for modifier keys
    if (e.originalEvent.shiftKey) {
      // Shift key: add to selection
      onSelect(item.sample_unique_id, 'add');
      e.originalEvent.preventDefault();
    } else if (e.originalEvent.ctrlKey || e.originalEvent.metaKey) {
      // Ctrl/Cmd key: remove from selection
      onSelect(item.sample_unique_id, 'remove');
      e.originalEvent.preventDefault();
    } else {
      // Normal click - toggle selection
      onSelect(item.sample_unique_id, 'toggle');
    }
  };
  
  const handlePopupOpen = () => {
    if (onPopupOpen) {
      onPopupOpen(item);
    }
  };
  
  return (
    <Marker 
      position={item.latLng!}
      icon={isSelected ? selectedIcon : defaultIcon}
      ref={markerRef}
      eventHandlers={{
        click: handleMarkerClick,
        popupopen: handlePopupOpen
      }}
    >
      <Popup>
        <div className="min-w-[200px]">
          <h3 className="font-bold">{item.location_id}</h3>
          <p><span className="font-medium">Sample:</span> {item.sample_reference}</p>
          <p><span className="font-medium">Depth:</span> {item.depth_to.toFixed(1)}m</p>
          <p><span className="font-medium">LL:</span> {item.liquid_limit} | <span className="font-medium">PL:</span> {item.plastic_limit}</p>
          <p><span className="font-medium">PI:</span> {item.plasticity_index}</p>
          <p><span className="font-medium">Classification:</span> {getSoilClassification(item)}</p>
          <p className="text-xs mt-2 text-gray-500">Coordinates (NZTM): [{item.x_coordinate.toFixed(1)}, {item.y_coordinate.toFixed(1)}]</p>
          <p className="text-xs text-gray-500">Coordinates (WGS84): [{item.latLng![0].toFixed(6)}, {item.latLng![1].toFixed(6)}]</p>
          <p className="text-xs text-gray-500">Subzone: {item.construction_subzone}</p>
        </div>
      </Popup>
    </Marker>
  );
};

const MapComponent: React.FC<MapComponentProps> = ({ 
  data, 
  selectedItems, 
  onItemSelect,
  onPopupOpen
}) => {
  const mapRef = useRef<any>(null);
  const [mapReady, setMapReady] = useState(false);
  // Default center to New Zealand
  const [center, setCenter] = useState<[number, number]>([-41.2865, 174.7762]);
  const [zoom, setZoom] = useState(6); // Start with a wider view

  // Calculate center point from data
  useEffect(() => {
    if (data.length > 0) {
      try {
        // Get all valid latLng coordinates
        const validCoords = data
          .filter(item => item.latLng && !isNaN(item.latLng[0]) && !isNaN(item.latLng[1]))
          .map(item => item.latLng!);
        
        if (validCoords.length > 0) {
          // Calculate average coordinates
          const sumLat = validCoords.reduce((sum, coord) => sum + coord[0], 0);
          const sumLng = validCoords.reduce((sum, coord) => sum + coord[1], 0);
          const avgLat = sumLat / validCoords.length;
          const avgLng = sumLng / validCoords.length;
          
          console.log(`Map center set to [${avgLat}, ${avgLng}] from average of ${validCoords.length} points`);
          setCenter([avgLat, avgLng]);
          
          // Adjust zoom level based on data points
          if (data.length <= 10) setZoom(13);
          else if (data.length <= 50) setZoom(12);
          else setZoom(11);
        }
        
        setMapReady(true);
      } catch (error) {
        console.error('Error calculating map center:', error);
      }
    }
  }, [data]);

  // When the map is ready, fly to the center
  useEffect(() => {
    if (mapReady && mapRef.current) {
      const map = mapRef.current;
      if (map && map.setView) {
        try {
          console.log(`Flying to center: ${center}`);
          map.setView(center, zoom);
        } catch (error) {
          console.error('Error setting map view:', error);
        }
      }
    }
  }, [center, zoom, mapReady]);

  // Show keyboard modifier info
  const selectionInstructions = (
    <div className="bg-white/90 px-3 py-2 rounded shadow-md backdrop-blur-sm border border-gray-200 max-w-[250px]">
      <h3 className="font-medium text-gray-800 mb-1">Selection Controls:</h3>
      <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
        <li>Click: Toggle selection</li>
        <li>Hold <span className="font-medium">Shift + Click</span> to add to selection</li>
        <li>Hold <span className="font-medium">Ctrl + Click</span> to remove from selection</li>
      </ul>
      <div className="flex items-center gap-2 mt-1 text-xs">
        <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
        <span>Selected</span>
        <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-2"></span>
        <span>Unselected</span>
      </div>
    </div>
  );

  // Inject CSS for marker colors
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      .marker-icon-red {
        filter: hue-rotate(330deg) saturate(1.5);
      }
      .marker-icon-green {
        filter: hue-rotate(90deg) saturate(1.5);
      }
    `;
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div className="w-full h-[500px] border border-gray-300 rounded-md overflow-hidden relative">
      <div className="absolute z-10 top-2 left-2 bg-white px-3 py-1 rounded shadow-md text-sm">
        <p className="font-medium text-gray-700">
          {selectedItems.size > 0 
            ? `${selectedItems.size} item${selectedItems.size !== 1 ? 's' : ''} selected` 
            : 'Map View: Click on markers to select'}
        </p>
      </div>
      
      <div className="absolute z-10 bottom-2 left-2">
        {selectionInstructions}
      </div>
      
      <MapContainer 
        center={[-41.2865, 174.7762]} // Default center (Wellington, NZ)
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        whenReady={() => setMapReady(true)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {data.map((item, index) => {
          // Use pre-converted coordinates
          if (!item.latLng || isNaN(item.latLng[0]) || isNaN(item.latLng[1])) {
            return null;
          }
          
          // Check if item is in the selection
          const isSelected = selectedItems.has(item.sample_unique_id);
          
          return (
            <SelectableMarker
              key={item.sample_unique_id || index}
              item={item}
              isSelected={isSelected}
              onSelect={onItemSelect}
              onPopupOpen={onPopupOpen}
            />
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
