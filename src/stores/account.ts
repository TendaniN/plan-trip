import { create } from "zustand";
import type { Trip, User, Location, Itinerary } from "types/model";

interface AccountState {
  id: number;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  trips: Trip[];

  setUser: (user: User) => void;
  clearUser: () => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
}

const initialState = {
  id: 0,
  username: "",
  password: "",
  first_name: undefined,
  last_name: undefined,
  trips: [] as Trip[],
};

export const useAccountStore = create<AccountState>((set) => ({
  ...initialState,
  setUser: (user) =>
    set({
      id: user.id,
      username: user.username,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      trips: user.trips,
    }),

  clearUser: () => set(initialState),

  addTrip: (trip) =>
    set((state) => ({
      trips: [...state.trips, trip],
    })),
  updateTrip: (tripId, updates) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId ? { ...trip, ...updates } : trip
      ),
    })),
}));

// All trips
export const useTrips = (): Trip[] => useAccountStore((state) => state.trips);

// Locations for a specific trip
export const useTripLocations = (tripId: string): Location[] =>
  useAccountStore(
    (state) => state.trips.find((trip) => trip.id === tripId)?.locations ?? []
  );

// Itinerary for a specific location
export const useLocationItinerary = (locationId: string): Itinerary[] =>
  useAccountStore(
    (state) =>
      state.trips
        .flatMap((trip) => trip.locations)
        .find((location) => location.id === locationId)?.itinerary_activites ??
      []
  );
