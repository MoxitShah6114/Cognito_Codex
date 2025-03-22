import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

// Fix the missing marker icon issue
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
  });
};

// Route planner component
const RoutePlanner = ({ sourceCoords, destCoords, onRouteFound }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!sourceCoords || !destCoords) return;
    
    // Remove any existing routing control
    map.eachLayer((layer) => {
      if (layer._route) {
        map.removeLayer(layer);
      }
    });
    
    // Create routing control
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(sourceCoords.lat, sourceCoords.lng),
        L.latLng(destCoords.lat, destCoords.lng)
      ],
      routeWhileDragging: false,
      showAlternatives: false,
      fitSelectedRoutes: true,
      show: false, // Don't show the instruction panel
      lineOptions: {
        styles: [
          { color: '#2196F3', opacity: 0.8, weight: 6 },
          { color: '#64B5F6', opacity: 0.5, weight: 10 }
        ],
        extendToWaypoints: true,
        missingRouteTolerance: 1
      },
      createMarker: () => null // Don't create default markers
    }).addTo(map);
    
    // Get route summary when route is found
    routingControl.on('routesfound', (e) => {
      const routes = e.routes;
      const summary = routes[0].summary;
      onRouteFound({
        distance: {
          text: `${(summary.totalDistance / 1000).toFixed(1)} km`,
          value: summary.totalDistance
        },
        duration: {
          text: `${Math.round(summary.totalTime / 60)} mins`,
          value: summary.totalTime
        }
      });
    });
    
    // Cleanup on unmount
    return () => {
      map.removeControl(routingControl);
    };
  }, [map, sourceCoords, destCoords, onRouteFound]);
  
  return null;
};

const MapView = ({ 
  sourceLocation, 
  destinationLocation,
  sourceCoords = { lat: 28.6139, lng: 77.2090 }, // Default: Delhi
  destCoords = { lat: 28.7041, lng: 77.1025 },   // Default: Nearby location
  height = 400,
  currentLocation = null,
  onRouteFound
}) => {
  const [map, setMap] = useState(null);
  
  // Create a custom source marker icon
  const sourceIcon = createCustomIcon('#4CAF50');
  
  // Create a custom destination marker icon
  const destIcon = createCustomIcon('#F44336');
  
  // Create a custom current location marker icon
  const currentLocationIcon = createCustomIcon('#2196F3');
  
  return (
    <MapContainer 
      center={sourceCoords} 
      zoom={13} 
      style={{ height: height, width: '100%', borderRadius: '8px' }}
      whenCreated={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {sourceCoords && (
        <Marker position={sourceCoords} icon={sourceIcon}>
          <Popup>
            <strong>Pickup Location</strong><br />
            {sourceLocation || 'Start point'}
          </Popup>
        </Marker>
      )}
      
      {destCoords && (
        <Marker position={destCoords} icon={destIcon}>
          <Popup>
            <strong>Drop-off Location</strong><br />
            {destinationLocation || 'End point'}
          </Popup>
        </Marker>
      )}
      
      {currentLocation && (
        <Marker position={currentLocation} icon={currentLocationIcon}>
          <Popup>
            <strong>Current Location</strong>
          </Popup>
        </Marker>
      )}
      
      {/* Add bike stations - you can customize this with your own data */}
      {[
        { lat: 28.6229, lng: 77.2090, name: "Connaught Place Station", bikes: 8 },
        { lat: 28.6330, lng: 77.2200, name: "Janpath Station", bikes: 5 },
        { lat: 28.6381, lng: 77.1982, name: "Karol Bagh Station", bikes: 3 }
      ].map((station, index) => (
        <Marker 
          key={index} 
          position={[station.lat, station.lng]}
          icon={L.divIcon({
            className: 'bike-station-marker',
            html: `<div style="background-color: #FF9800; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 10px;">${station.bikes}</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })}
        >
          <Popup>
            <strong>{station.name}</strong><br />
            Available bikes: {station.bikes}
          </Popup>
        </Marker>
      ))}
      
      {sourceCoords && destCoords && (
        <RoutePlanner 
          sourceCoords={sourceCoords} 
          destCoords={destCoords} 
          onRouteFound={onRouteFound}
        />
      )}
    </MapContainer>
  );
};

export default MapView;
