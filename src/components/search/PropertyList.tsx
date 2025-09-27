'use client';

import { useState } from 'react';
import { Grid3X3, List, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PropertyCard from './PropertyCard';

interface Property {
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
}

interface PropertyListProps {
  properties: Property[];
  onFavoriteToggle?: (id: string) => void;
  onPropertyClick?: (id: string) => void;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  isLoadingProperties: boolean
}

export default function PropertyList({
  properties,
  onFavoriteToggle,
  onPropertyClick,
  viewMode = 'grid',
  onViewModeChange,
  isLoadingProperties
}: PropertyListProps) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleFavoriteToggle = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
    onFavoriteToggle?.(propertyId);
  };

  return (
    <div className="flex-1 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {properties.length} Properties Found
          </h2>

          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange?.('grid')}
              className="h-8 w-8 p-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onViewModeChange?.('list')}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={{
                ...property,
                isFavorited: favorites.has(property.id)
              }}
              onFavoriteToggle={handleFavoriteToggle}
              onCardClick={onPropertyClick}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property.id} className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="w-48 h-32 flex-shrink-0">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <p className="text-gray-600">{property.address}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFavoriteToggle(property.id)}
                  >
                    <span className={favorites.has(property.id) ? 'text-red-500' : 'text-gray-400'}>
                      ♥
                    </span>
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <span>{property.beds} bed</span>
                  <span>{property.baths} bath</span>
                  <span>{property.sqft} sq ft</span>
                  <span>★ {property.rating} ({property.reviewCount})</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {property.badges?.map((badge, index) => (
                      <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                        {badge}
                      </span>
                    ))}
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold">${property.price}</span>
                    <span className="text-gray-500"> /month</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoadingProperties && (
        <div className='flex items-center justify-center'>
          <Loader size={24} className='animate-spin' />
        </div>
      )}

      {!isLoadingProperties && properties.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Grid3X3 className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
          <p className="text-gray-500">Try adjusting your search filters to see more results.</p>
        </div>
      )}
    </div>
  );
}
