'use client';
import { Marker, Popup, useMap } from 'react-leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState, useRef } from 'react';
import { getCurrentLocation } from '@/lib/utils';
import { useLocationStore } from '@/store/location.store';

import L, { latLng } from 'leaflet';
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userLocationIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="24" height="24">
      <circle cx="12" cy="12" r="10" fill="#3B82F6" stroke="white" stroke-width="3"/>
      <circle cx="12" cy="12" r="4" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

interface PropertyMapProps {
  properties?: Array<{
    id: string;
    lat: number;
    lng: number;
    price: number;
    title: string;
  }>;
  onPropertySelect?: (propertyId: string) => void;
  className?: string;
}

interface UserLocation {
  lat: number;
  lng: number;
}

function MapController({ userLocation, properties }: {
  userLocation: UserLocation | null;
  properties: Array<{ id: string; lat: number; lng: number; price: number; title: string; }>;
}) {
  const map = useMap();
  const hasUserLocationRef = useRef(false);
  const { lat, lng } = useLocationStore();

  useEffect(() => {
    if (lat && lng && !hasUserLocationRef.current) {
      map.setView([lat, lng], 13);
      hasUserLocationRef.current = true;
    }
  }, [lat, lng, map]);

  return null;
}

export default function PropertyMap({
  properties = [],
  onPropertySelect,
  className = "w-full h-full"
}: PropertyMapProps) {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);

  const { lat, lng, setLocation } = useLocationStore();

  useEffect(() => {
    const getUserLocation = async () => {
      try {
        setIsLoadingLocation(true);
        setLocationError(null);

        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by this browser');
        }

        const position = await getCurrentLocation();
        const newUserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(newUserLocation.lat, newUserLocation.lng);

        setUserLocation(newUserLocation);
        setLocationError(null);
      } catch (error) {
        let errorMessage = 'Failed to get location';
        if (error instanceof GeolocationPositionError) {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        setLocationError(errorMessage);
      } finally {
        setIsLoadingLocation(false);
      }
    };

    getUserLocation();
  }, []);

  const center: [number, number] = properties.length > 0
    ? [
      properties.reduce((sum, p) => sum + p.lat, 0) / properties.length,
      properties.reduce((sum, p) => sum + p.lng, 0) / properties.length
    ]
    : [34.0522, -118.2437];
  return (
    <div className={className} style={{ minHeight: '400px' }}>
      {isLoadingLocation && (
        <div className="absolute top-4 left-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-md">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Getting your location...</span>
          </div>
        </div>
      )}

      {locationError && !isLoadingLocation && (
        <div className="absolute top-4 left-4 z-[1000] bg-red-50 border border-red-200 px-3 py-2 rounded-lg shadow-md">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-red-600">📍 Using default location</span>
          </div>
        </div>
      )}

      <MapContainer
        center={center}
        zoom={properties.length > 0 ? 11 : 10}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController userLocation={userLocation} properties={properties} />

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-sm mb-1">📍 Your Location</h3>
                <p className="text-xs text-gray-600">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {properties.map((property) => (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            eventHandlers={{
              click: () => onPropertySelect?.(property.id)
            }}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
                <p className="text-lg font-bold text-blue-600">
                  ${property.price.toLocaleString()}/month
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}