import { type Property } from '@prisma/client';

export interface PropertyListing extends Property {
  location: {
    id: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    coordinates: {
      longitude: number;
      latitude: number;
    };
  };
  manager?: {
    id: string;
    name: string;
    email: string;
    image?: string;
  };
}

export interface SearchResponse {
  success: boolean;
  properties: PropertyListing[];
}

export interface PropertyMapMarker {
  id: string;
  lat: number;
  lng: number;
  price: number;
  title: string;
}