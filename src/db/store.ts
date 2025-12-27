import { create } from "zustand";
import type { Trip, User, Location, Itinerary, Budget, Travel } from "types/db";

interface AccountState {
  id: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  trips: Trip[];
  locations: Location[];
  itinerary: Itinerary[];
  budgets: Budget[];
  travels: Travel[];

  setState: (
    user: User,
    trips: Trip[],
    locations: Location[],
    itinerary: Itinerary[],
    budget: Budget[],
    travel: Travel[]
  ) => void;
  clearState: () => void;

  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;

  addLocation: (location: Location) => void;
  updateLocation: (locationId: string, updates: Partial<Location>) => void;

  addActivity: (itinerary: Itinerary) => void;
  updateActivity: (itineraryId: string, updates: Partial<Itinerary>) => void;

  addBudget: (budget: Budget) => void;
  updateBudget: (budgetId: string, updates: Partial<Budget>) => void;

  addTravel: (travel: Travel) => void;
  updateTravel: (travelId: string, updates: Partial<Travel>) => void;
}

const initialState = {
  id: "",
  username: "",
  password: "",
  first_name: undefined,
  last_name: undefined,
  trips: [] as Trip[],
  locations: [] as Location[],
  itinerary: [] as Itinerary[],
  budgets: [] as Budget[],
  travels: [] as Travel[],
};

export const useDBStore = create<AccountState>((set) => ({
  ...initialState,

  setState: (user, trips, locations, itinerary) =>
    set({
      id: user.id,
      username: user.username,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      trips: trips,
      locations: locations,
      itinerary: itinerary,
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

  addLocation: (location) =>
    set((state) => ({
      locations: [...state.locations, location],
    })),
  updateLocation: (locationId, updates) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === locationId ? { ...location, ...updates } : location
      ),
    })),

  addActivity: (itinerary) =>
    set((state) => ({
      itinerary: [...state.itinerary, itinerary],
    })),
  updateActivity: (itineraryId, updates) =>
    set((state) => ({
      itinerary: state.itinerary.map((itinerary) =>
        itinerary.id === itineraryId ? { ...itinerary, ...updates } : itinerary
      ),
    })),

  addBudget: (budget) =>
    set((state) => ({
      budgets: [...state.budgets, budget],
    })),
  updateBudget: (budgetId, updates) =>
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === budgetId ? { ...budget, ...updates } : budget
      ),
    })),

  addTravel: (travel) =>
    set((state) => ({
      travels: [...state.travels, travel],
    })),
  updateTravel: (travelId, updates) =>
    set((state) => ({
      travels: state.travels.map((travel) =>
        travel.id === travelId ? { ...travel, ...updates } : travel
      ),
    })),
}));

// Locations for a specific trip
export const useTripLocations = (tripId: string): Location[] =>
  useDBStore(
    (state) =>
      state.locations.filter((location) => location.tripId === tripId) ?? []
  );

// Itinerary for a specific location
export const useLocationItinerary = (locationId: string): Itinerary[] =>
  useDBStore(
    (state) =>
      state.itinerary.filter(
        (itinerary) => itinerary.locationId === locationId
      ) ?? []
  );
