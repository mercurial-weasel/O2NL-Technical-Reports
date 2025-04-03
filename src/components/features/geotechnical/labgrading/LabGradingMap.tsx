import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { GeoLabGrading, formatLabGradingData } from '@api/geotechnical/labgrading';
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
  className: 'marker-icon-blue' // Apply CSS class for blue color
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

// Helper component to update map view when center/zoom changes
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);
  
  return null;
};

interface LabGradingMapProps {
  data: GeoLabGrading[];
  selectedItems: Set<string>;
  onItemSelect: (itemId: string, mode: 'add' | 'remove' | 'toggle') => void;
  onPopupOpen?: (item: GeoLabGrading) => void;
}

// Custom marker component that supports keyboard modifiers for selection
const SelectableMarker: React.FC<{
  item: GeoLabGrading & { latLng?: [number, number] },
  isSelected: boolean,
  onSelect: (itemId: string, mode: 'add' | 'remove' | 'toggle') => void,
  onPopupOpen?: (item: GeoLabGrading) => void
}> = ({ item, isSelected, onSelect, onPopupOpen }) => {
  const markerRef = useRef<LeafletMarker>(null);
  
  if (!item.latLng) return null;
  
  const handleMarkerClick = (e: any) => {
    // Check for modifier keys
    if (e.originalEvent.shiftKey) {
      // Shift key: add to selection
      onSelect(item.id, 'add');
      e.originalEvent.preventDefault();
    } else if (e.originalEvent.ctrlKey || e.originalEvent.metaKey) {
      // Ctrl/Cmd key: remove from selection
      onSelect(item.id, 'remove');
      e.originalEvent.preventDefault();
    } else {
      // Normal click - toggle selection
      onSelect(item.id, 'toggle');
    }
  };
  
  const handlePopupOpen = () => {
    if (onPopupOpen) {
      onPopupOpen(item);
    }
  };
  
  return (
    <Marker 
      position={item.latLng}
      icon={isSelected ? selectedIcon : defaultIcon}
      ref={markerRef}
      eventHandlers={{
        click: handleMarkerClick,
        popupopen: handlePopupOpen
      }}
    >
      <Popup>
        <div className="min-w-[200px]">
          <h3 className="font-bold">{item.point_id}</h3>
          <p><span className="font-medium">Sample:</span> {item.sample_id || 'N/A'}</p>
          <p><span className="font-medium">Material:</span> {item.material_id || 'N/A'}</p>
          <p><span className="font-medium">Sample Top:</span> {item.sample_top !== null ? `${item.sample_top.toFixed(1)}m` : 'N/A'}</p>
          <p><span className="font-medium">Geology:</span> {item.geology_description || 'N/A'}</p>
          {item.latLng && (
            <p className="text-xs text-gray-500">Coordinates (WGS84): [{item.latLng[0].toFixed(6)}, {item.latLng[1].toFixed(6)}]</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
};

export const LabGradingMap: React.FC<LabGradingMapProps> = ({ 
  data, 
  selectedItems, 
  onItemSelect,
  onPopupOpen
}) => {
  // Default center to New Zealand
  const [center, setCenter] = useState<[number, number]>([-41.2865, 174.7762]);
  const [zoom, setZoom] = useState(6); // Start with a wider view
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // Format the data to include lat/lng - use useMemo to avoid recomputing on every render
  const formattedData = useMemo(() => {
    return data.map(item => formatLabGradingData(item));
  }, [data]);
  
  // Count valid coordinates for debugging - use useMemo to avoid recalculating in each render
  const { validCoordinatesCount, validCoords } = useMemo(() => {
    const validCoords = formattedData
      .filter(item => item.latLng && !isNaN(item.latLng[0]) && !isNaN(item.latLng[1]))
      .map(item => item.latLng!);
    
    return {
      validCoordinatesCount: validCoords.length,
      validCoords
    };
  }, [formattedData]);

  // Calculate map center and zoom when formatted data changes
  useEffect(() => {
    console.log(`Valid coordinates: ${validCoordinatesCount} out of ${formattedData.length} items`);
    
    if (validCoords.length > 0) {
      // Calculate average coordinates
      const sumLat = validCoords.reduce((sum, coord) => sum + coord[0], 0);
      const sumLng = validCoords.reduce((sum, coord) => sum + coord[1], 0);
      const avgLat = sumLat / validCoords.length;
      const avgLng = sumLng / validCoords.length;
      
      console.log(`Map center calculated: [${avgLat}, ${avgLng}] from average of ${validCoords.length} points`);
      
      // Calculate appropriate zoom level based on the spread of points
      let zoomLevel = 12; // Default zoom level
      
      if (validCoords.length > 1) {
        // Find the bounds of the coordinates
        const maxLat = Math.max(...validCoords.map(c => c[0]));
        const minLat = Math.min(...validCoords.map(c => c[0]));
        const maxLng = Math.max(...validCoords.map(c => c[1]));
        const minLng = Math.min(...validCoords.map(c => c[1]));
        
        // Calculate the spread
        const latSpread = maxLat - minLat;
        const lngSpread = maxLng - minLng;
        const maxSpread = Math.max(latSpread, lngSpread);
        
        // Adjust zoom based on spread
        if (maxSpread > 1) zoomLevel = 8;
        else if (maxSpread > 0.5) zoomLevel = 9;
        else if (maxSpread > 0.2) zoomLevel = 10;
        else if (maxSpread > 0.1) zoomLevel = 11;
        else if (maxSpread > 0.05) zoomLevel = 12;
        else if (maxSpread > 0.01) zoomLevel = 13;
        else zoomLevel = 14;
        
        console.log(`Calculated zoom level: ${zoomLevel} based on coordinate spread: ${maxSpread}`);
      } else if (validCoords.length === 1) {
        // Just one point, zoom in close
        zoomLevel = 14;
      }
      
      // Set center coordinates and zoom
      setCenter([avgLat, avgLng]);
      setZoom(zoomLevel);
      setIsMapInitialized(true);
    }
  }, [validCoords, validCoordinatesCount, formattedData.length]);

  // Inject CSS for marker colors - only once on mount
  useEffect(() => {
    const styleId = 'labgrading-map-marker-styles';
    
    // Only add if not already present
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.innerHTML = `
        .marker-icon-blue {
          filter: hue-rotate(10deg) saturate(1.5);
        }
        .marker-icon-green {
          filter: hue-rotate(90deg) saturate(1.5);
        }
      `;
      document.head.appendChild(styleEl);
      
      return () => {
        const element = document.getElementById(styleId);
        if (element) {
          document.head.removeChild(element);
        }
      };
    }
  }, []);

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
        <span className="inline-block w-3 h-3 bg-blue-500 rounded-full ml-2"></span>
        <span>Unselected</span>
      </div>
    </div>
  );

  return (
    <div className="w-full h-[500px] border border-gray-300 rounded-md overflow-hidden relative">
      {validCoordinatesCount === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-20">
          <div className="p-6 text-center">
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Valid Coordinates</h3>
            <p className="text-gray-600">None of the data points have valid geographic coordinates.</p>
          </div>
        </div>
      )}
      
      <div className="absolute z-10 top-2 left-2 bg-white px-3 py-1 rounded shadow-md text-sm">
        <p className="font-medium text-gray-700">
          {selectedItems.size > 0 
            ? `${selectedItems.size} sample${selectedItems.size !== 1 ? 's' : ''} selected` 
            : 'Map View: Click on markers to select'}
        </p>
      </div>
      
      <div className="absolute z-10 bottom-2 left-2">
        {selectionInstructions}
      </div>
      
      <MapContainer 
        center={[-41.2865, 174.7762]} // Initial default center (Wellington, NZ)
        zoom={6} // Initial default zoom
        style={{ height: '100%', width: '100%' }}
        whenReady={() => console.log('Map container is ready')}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Use the MapUpdater component to set the view when center/zoom changes */}
        {isMapInitialized && <MapUpdater center={center} zoom={zoom} />}
        
        {formattedData.map((item, index) => {
          // Check if item has valid coordinates
          if (!item.latLng || isNaN(item.latLng[0]) || isNaN(item.latLng[1])) {
            return null;
          }
          
          // Check if item is in the selection
          const isSelected = selectedItems.has(item.id);
          
          return (
            <SelectableMarker
              key={item.id || index}
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
