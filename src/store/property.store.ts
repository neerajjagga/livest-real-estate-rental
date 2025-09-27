import { create } from 'zustand'
import { type PropertyListing } from '@/types/property'

export type propertyState = {
    propertyListings: PropertyListing[]
}

export type propertyActions = {
    setPropertyListings: (properties: PropertyListing[]) => void
    addProperty: (property: PropertyListing) => void
    clearProperties: () => void
}

export type propertyStore = propertyState & propertyActions

const defaultInitState: propertyState = {
    propertyListings: [],
}

export const usePropertyStore = create<propertyStore>((set) => ({
    ...defaultInitState,
    setPropertyListings: (properties) => set({ propertyListings: [...properties] }),
    addProperty: (property) => set((state) => ({ 
        propertyListings: [...state.propertyListings, property] 
    })),
    clearProperties: () => set(defaultInitState),
}));
