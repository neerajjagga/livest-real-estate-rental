'use client';

import { useEffect, useState } from 'react';
import SearchHeader from './SearchHeader';
import SearchFilters from './SearchFilters';
import PropertyList from './PropertyList';
import dynamic from 'next/dynamic';
import { usePropertyStore } from '@/store/property.store';
import { useLocationStore } from '@/store/location.store';
import { type PropertyListing, type PropertyMapMarker, type SearchResponse } from '@/types/property';

interface Property_Legacy {
  id: string;
  title: string;
  address: string;
  price: number;
  rating: number;
  reviewCount: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  amenities: string[];
  isFavorited?: boolean;
  badges?: string[];
  lat: number;
  lng: number;
}

const PropertyMap = dynamic(() => import('./PropertyMap'), { ssr: false });

export default function SearchLayout() {
  const { lat, lng } = useLocationStore();
  const { propertyListings, setPropertyListings } = usePropertyStore();

  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMap, setShowMap] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [isLoadingProperties, setIsLoadingProperties] = useState<boolean>(true);

  useEffect(() => {
    const fetchPropertyListings = async () => {
      setIsLoadingProperties(true);
      try {
        const response = await fetch(`/api/search?latitude=${lat}&longitude=${lng}`);
        const data: SearchResponse = await response.json();
        if (data.success) {
          setPropertyListings(data.properties);
        }
      } catch (error) {
        console.error('Failed to fetch property listings:', error);
      } finally {
        setIsLoadingProperties(false);
      }
    }

    if (lat && lng) {
      fetchPropertyListings();
    }
  }, [lat, lng, setPropertyListings]);

  const handleMenuToggle = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  const handleFiltersClose = () => {
    setIsFiltersOpen(false);
  };

  const handlePropertySelect = (propertyId: string) => {
    setSelectedProperty(propertyId);
  };

  const handleFavoriteToggle = (propertyId: string) => {
    console.log('Toggled favorite for property:', propertyId);
  };

  const handlePropertyClick = (propertyId: string) => {
    console.log('Clicked property:', propertyId);
  };

  const convertToMapMarkers = (properties: PropertyListing[]): PropertyMapMarker[] => {
    return properties.map(property => ({
      id: property.id,
      lat: property.location.coordinates.latitude,
      lng: property.location.coordinates.longitude,
      price: property.pricePerMonth,
      title: property.name
    }));
  };

  const convertToLegacyFormat = (properties: PropertyListing[]): Property_Legacy[] => {
    return properties.map(property => ({
      id: property.id,
      title: property.name,
      address: `${property.location.address}, ${property.location.city}`,
      price: property.pricePerMonth,
      rating: property.averageRating || 0,
      reviewCount: property.numberOfReviews || 0,
      beds: property.beds,
      baths: property.baths,
      sqft: property.squareFeet,
      image: property.photoUrls[0] || '/api/placeholder/400/300',
      amenities: property.amenities.map(amenity => amenity.toString()),
      lat: property.location.coordinates.latitude,
      lng: property.location.coordinates.longitude,
      // isFavorited: property.isFavorited,
      // badges: property.badges
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader onMenuToggle={handleMenuToggle} />
      <div className="flex h-[calc(100vh-80px)]">
        <div className={`
          ${isFiltersOpen ? 'block' : 'hidden'} lg:block
          w-80 flex-shrink-0 bg-white border-r border-gray-200
          fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto
          transform transition-transform duration-300 ease-in-out
          ${isFiltersOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <SearchFilters
            isOpen={isFiltersOpen}
            onClose={handleFiltersClose}
          />
        </div>

        {isFiltersOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={handleFiltersClose}
          />
        )}

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className={`
            ${showMap ? 'lg:w-2/3' : 'w-full'} 
            flex-shrink-0 overflow-y-auto
          `}>
            <PropertyList
              properties={convertToLegacyFormat(propertyListings)}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onFavoriteToggle={handleFavoriteToggle}
              onPropertyClick={handlePropertyClick}
              isLoadingProperties={isLoadingProperties}
            />
          </div>

          {showMap && (
            <div className="hidden lg:block lg:w-1/2 border-l border-gray-200">
              <PropertyMap
                properties={convertToMapMarkers(propertyListings)}
                onPropertySelect={handlePropertySelect}
                className="w-full h-full"
              />
            </div>
          )}
        </div>

        <button
          onClick={() => setShowMap(!showMap)}
          className="lg:hidden fixed bottom-4 right-4 z-50 bg-black text-white px-4 py-2 rounded-full shadow-lg"
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>

        {showMap && (
          <div className="lg:hidden fixed inset-0 z-40 bg-white">
            <div className="h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="font-semibold">Map View</h2>
                <button
                  onClick={() => setShowMap(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <PropertyMap
                properties={convertToMapMarkers(propertyListings)}
                onPropertySelect={handlePropertySelect}
                className="w-full h-[calc(100%-60px)]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
