import { create } from "zustand";
import type { Trip, User, Location, Itinerary } from "types/model";

interface AccountState {
  id: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  trips: Trip[];
  locations: Location[];
  itinerarys: Itinerary[];

  setState: (
    user: User,
    trips: Trip[],
    locations: Location[],
    itinerarys: Itinerary[]
  ) => void;
  clearState: () => void;
  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;
}

const initialState = {
  id: "",
  username: "",
  password: "",
  first_name: undefined,
  last_name: undefined,
  trips: [] as Trip[],
  locations: [] as Location[],
  itinerarys: [] as Itinerary[],
};

export const useAccountStore = create<AccountState>((set) => ({
  ...initialState,
  setState: (user, trips, locations, itinerarys) =>
    set({
      id: user.id,
      username: user.username,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      trips: trips,
      locations: locations,
      itinerarys: itinerarys,
    }),

  clearState: () => set(initialState),

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

// Locations for a specific trip
export const useTripLocations = (tripId: string): Location[] =>
  useAccountStore(
    (state) =>
      state.locations.filter((location) => location.tripId === tripId) ?? []
  );

// Itinerary for a specific location
export const useLocationItinerary = (locationId: string): Itinerary[] =>
  useAccountStore(
    (state) =>
      state.itinerarys.filter(
        (itinerary) => itinerary.locationId === locationId
      ) ?? []
  );
