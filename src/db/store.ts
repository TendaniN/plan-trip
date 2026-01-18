import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";
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
  currencyRates: Record<string, number>;
  rate: number;
  currency: string;

  setState: (
    user: User,
    trips: Trip[],
    locations: Location[],
    itinerary: Itinerary[],
    budget: Budget[],
    travel: Travel[],
  ) => void;
  clearState: () => void;

  setCurrencyRates: (currencyRates: Record<string, number>) => void;
  setRate: (rate: number) => void;
  setCurrency: (currency: string | undefined) => void;

  addTrip: (trip: Trip) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;

  addLocation: (location: Location) => void;
  updateLocation: (locationId: string, updates: Partial<Location>) => void;
  removeLocation: (tripId: string, locationId: string) => void;

  addActivity: (itinerary: Itinerary) => void;
  updateActivity: (itineraryId: string, updates: Partial<Itinerary>) => void;
  removeActivity: (locationId: string, activityId: string) => void;

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
  currencyRates: { ZAR: 1 },
  rate: 1,
  currency: "R",
};

export const useDBStore = create<AccountState>((set) => ({
  ...initialState,

  setState: (user, trips, locations, itinerary, budgets, travel) =>
    set({
      id: user.id,
      username: user.username,
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      trips,
      locations,
      itinerary,
      budgets,
      travels: travel,
    }),

  clearState: () => set(initialState),

  setCurrencyRates: (currencyRates) =>
    set({
      currencyRates,
    }),

  setRate: (rate) => set({ rate }),

  setCurrency: (currency) => set({ currency: currency ? currency : "R" }),

  addTrip: (trip) =>
    set((state) => ({
      trips: [...state.trips, trip],
    })),
  updateTrip: (tripId, updates) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === tripId ? { ...trip, ...updates } : trip,
      ),
    })),

  addLocation: (location) =>
    set((state) => ({
      locations: [...state.locations, location],
    })),
  updateLocation: (locationId, updates) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === locationId ? { ...location, ...updates } : location,
      ),
    })),
  removeLocation: (tripId, locationId) =>
    set((state) => ({
      locations: state.locations.filter(({ id }) => id !== locationId),
      trips: state.trips.map((trip) =>
        trip.id === tripId
          ? {
              ...trip,
              locations:
                trip.locations?.filter((id) => id !== locationId) ?? [],
            }
          : trip,
      ),
    })),

  addActivity: (itinerary) =>
    set((state) => ({
      itinerary: [...state.itinerary, itinerary],
    })),
  updateActivity: (itineraryId, updates) =>
    set((state) => ({
      itinerary: state.itinerary.map((itinerary) =>
        itinerary.id === itineraryId ? { ...itinerary, ...updates } : itinerary,
      ),
    })),
  removeActivity: (locationId, activityId) =>
    set((state) => ({
      itinerary: state.itinerary.filter(({ id }) => id !== activityId),
      locations: state.locations.map((location) =>
        location.id === locationId
          ? {
              ...location,
              locations:
                location.itinerary?.filter((id) => id !== activityId) ?? [],
            }
          : location,
      ),
    })),

  addBudget: (budget) =>
    set((state) => ({
      budgets: [...state.budgets, budget],
    })),
  updateBudget: (budgetId, updates) =>
    set((state) => ({
      budgets: state.budgets.map((budget) =>
        budget.id === budgetId ? { ...budget, ...updates } : budget,
      ),
    })),

  addTravel: (travel) =>
    set((state) => ({
      travels: [...state.travels, travel],
    })),
  updateTravel: (travelId, updates) =>
    set((state) => ({
      travels: state.travels.map((travel) =>
        travel.id === travelId ? { ...travel, ...updates } : travel,
      ),
    })),
}));

export const useTrip = (tripId?: string): Trip | null =>
  useDBStore((state) => state.trips.find((trip) => trip.id === tripId) ?? null);

export const useTripLocations = (tripId?: string): Location[] =>
  useDBStore(
    useShallow((state) =>
      state.locations.filter((location) => location.tripId === tripId),
    ),
  );

export const useLocation = (locationId?: string): Location | null =>
  useDBStore(
    (state) =>
      state.locations.find((location) => location.id === locationId) ?? null,
  );

export const useLocationItinerary = (locationId?: string): Itinerary[] =>
  useDBStore(
    useShallow((state) =>
      state.itinerary.filter(
        (itinerary) => itinerary.locationId === locationId,
      ),
    ),
  );

export const useTripBudget = (tripId?: string): Budget | null =>
  useDBStore(
    (state) => state.budgets.find((budget) => budget.tripId === tripId) ?? null,
  );
