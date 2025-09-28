'use client';

import { Star, Bed, Bath, Square, MapPin, Wifi, Car, Waves } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

interface PropertyCardProps {
  property: {
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
    badges?: string[];
  };
  onCardClick?: (id: string) => void;
}

export default function PropertyCard({
  property,
  onCardClick
}: PropertyCardProps) {
  const {
    id,
    title,
    address,
    price,
    rating,
    reviewCount,
    beds,
    baths,
    sqft,
    image,
    amenities,
    badges = []
  } = property;


  const handleCardClick = () => {
    onCardClick?.(id);
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
      case 'internet':
        return <Wifi className="h-3 w-3" />;
      case 'parking':
        return <Car className="h-3 w-3" />;
      case 'pool':
        return <Waves className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={image || '/no-photo.jpg'}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>


        {badges.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-green-600 text-white text-xs px-2 py-1"
              >
                {badge}
              </Badge>
            ))}
          </div>
        )}

        {amenities.length > 0 && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {amenities.slice(0, 3).map((amenity, index) => {
              const icon = getAmenityIcon(amenity);
              return icon ? (
                <div
                  key={index}
                  className="bg-white/80 rounded-full p-1.5"
                  title={amenity}
                >
                  {icon}
                </div>
              ) : null;
            })}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-1 mb-3">
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="h-3 w-3" />
            <span className="text-sm line-clamp-1">{address}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium text-sm">{rating}</span>
          <span className="text-gray-500 text-sm">({reviewCount} Reviews)</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{beds} Bed</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{baths} Bath</span>
            </div>
            <div className="flex items-center gap-1">
              <Square className="h-4 w-4" />
              <span>{sqft} sq ft</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">${price}</span>
            <span className="text-gray-500 text-sm"> /month</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
