'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Search, Home, Building, Building2, Castle, Waves, Wifi, Car, Utensils, Dumbbell, Zap, Droplets, Wind, Snowflake, Tv, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocationStore } from '@/store/location.store';
import { usePropertyStore } from '@/store/property.store';
import { type SearchResponse } from '@/types/property';

interface SearchFiltersProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const propertyTypes = [
  { id: 'rooms', label: 'Rooms', icon: Home },
  { id: 'apartment', label: 'Apartment', icon: Building },
  { id: 'townhouse', label: 'Townhouse', icon: Building2 },
  { id: 'villa', label: 'Villa', icon: Castle },
  { id: 'cottage', label: 'Cottage', icon: Waves },
];

const amenities = [
  { id: 'washer-dryer', label: 'Washer Dryer', icon: Zap },
  { id: 'ac', label: 'Air Conditioning', icon: Snowflake },
  { id: 'dishwasher', label: 'Dishwasher', icon: Droplets },
  { id: 'internet', label: 'High Speed Internet', icon: Wifi },
  { id: 'hardwood', label: 'Hardwood Floors', icon: Home },
  { id: 'walk-in', label: 'Walk in Closets', icon: Building },
  { id: 'microwave', label: 'Microwave', icon: Utensils },
  { id: 'refrigerator', label: 'Refrigerator', icon: Wind },
  { id: 'pool', label: 'Pool', icon: Waves },
  { id: 'gym', label: 'Gym', icon: Dumbbell },
  { id: 'parking', label: 'Parking', icon: Car },
  { id: 'pets', label: 'Pets Allowed', icon: Home },
];

export default function SearchFilters({ isOpen = true, onClose }: SearchFiltersProps) {
  const router = useRouter();
  const { lat, lng } = useLocationStore();
  const { setPropertyListings } = usePropertyStore();

  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sqftRange, setSqftRange] = useState([0, 5000]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');

  const togglePropertyType = (typeId: string) => {
    setSelectedPropertyTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev =>
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();

    if (selectedPropertyTypes.length > 0) {
      params.set('propertyType', selectedPropertyTypes.join(','));
    }

    if (priceRange[0] > 0 || priceRange[1] < 10000) {
      params.set('priceMin', priceRange[0].toString());
      params.set('priceMax', priceRange[1].toString());
    }

    if (beds && beds !== 'any') {
      params.set('beds', beds);
    }

    if (baths && baths !== 'any') {
      params.set('baths', baths);
    }

    if (sqftRange[0] > 0 || sqftRange[1] < 5000) {
      params.set('squareFeetMin', sqftRange[0].toString());
      params.set('squareFeetMax', sqftRange[1].toString());
    }

    if (selectedAmenities.length > 0) {
      params.set('amenities', selectedAmenities.join(','));
    }

    return params;
  };

  const handleApplyFilters = () => {
    const queryParams = buildQueryParams();
    const queryString = queryParams.toString();

    const newUrl = queryString ? `/search?${queryString}` : '/search';
    router.push(newUrl);

    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    if (!lat || !lng) return;

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      try {
        const params = buildQueryParams();
        params.set('latitude', String(lat));
        params.set('longitude', String(lng));

        const url = `/api/search?${params.toString()}`;
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) return;
        const data: SearchResponse = await res.json();
        if (data?.success) {
          setPropertyListings(data.properties);
        }
      } catch (err) {
        if ((err as any)?.name !== 'AbortError') {
        }
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [lat, lng, priceRange, sqftRange, selectedPropertyTypes, selectedAmenities, beds, baths, setPropertyListings]);

  return (
    <div className={`bg-white border-r border-gray-200 h-full overflow-y-auto ${isOpen ? 'block' : 'hidden'} lg:block`}>
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">All Filters</span>
          </div>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
              ×
            </Button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">Los Angeles</Button>
          <Button variant="outline" size="sm">Any Min Price</Button>
          <Button variant="outline" size="sm">Any Max Price</Button>
          <Button variant="outline" size="sm">Any beds</Button>
          <Button variant="outline" size="sm">Any baths</Button>
          <Button variant="outline" size="sm">Any Property</Button>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Property Type</Label>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedPropertyTypes.includes(type.id);
              return (
                <Button
                  key={type.id}
                  variant={isSelected ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-3"
                  onClick={() => togglePropertyType(type.id)}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{type.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Price Range (Monthly)</Label>
          <div className="px-2">
            <Slider
              value={priceRange}
              onValueChange={setPriceRange}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Beds</Label>
            <Select value={beds} onValueChange={setBeds}>
              <SelectTrigger>
                <SelectValue placeholder="Any beds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any beds</SelectItem>
                <SelectItem value="1">1 Bed</SelectItem>
                <SelectItem value="2">2 Beds</SelectItem>
                <SelectItem value="3">3 Beds</SelectItem>
                <SelectItem value="4">4+ Beds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Baths</Label>
            <Select value={baths} onValueChange={setBaths}>
              <SelectTrigger>
                <SelectValue placeholder="Any baths" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any baths</SelectItem>
                <SelectItem value="1">1 Bath</SelectItem>
                <SelectItem value="2">2 Baths</SelectItem>
                <SelectItem value="3">3 Baths</SelectItem>
                <SelectItem value="4">4+ Baths</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Square Feet</Label>
          <div className="px-2">
            <Slider
              value={sqftRange}
              onValueChange={setSqftRange}
              max={5000}
              min={0}
              step={50}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{sqftRange[0]} sq ft</span>
            <span>{sqftRange[1]} sq ft</span>
          </div>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Amenities</Label>
          <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
            {amenities.map((amenity) => {
              const Icon = amenity.icon;
              return (
                <div key={amenity.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={amenity.id}
                    checked={selectedAmenities.includes(amenity.id)}
                    onCheckedChange={() => toggleAmenity(amenity.id)}
                  />
                  <Icon className="h-4 w-4 text-gray-500" />
                  <Label htmlFor={amenity.id} className="text-sm cursor-pointer">
                    {amenity.label}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
