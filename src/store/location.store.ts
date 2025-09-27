import { create } from 'zustand'

export type locationState = {
    lat: number | null
    lng: number | null
}

export type locationActions = {
    setLocation: (lat: number, lng: number) => void
    clearLocation: () => void
}

export type locationStore = locationState & locationActions

const defaultInitState: locationState = {
    lat: null,
    lng: null,
}

export const useLocationStore = create<locationStore>((set) => ({
    ...defaultInitState,
    setLocation: (lat: number, lng: number) => set({ lat, lng }),
    clearLocation: () => set(defaultInitState),
}));