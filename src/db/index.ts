import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";
import type { User, Trip, Location, Itinerary, Budget, Travel } from "types";

interface AccountState {
  uid: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  trips: Trip[];
  locations: Location[];
  itinerary: Itinerary[];
  budgets: Budget[];
  currencyRates: Record<string, number>;
  rate: number;
  currency: string;

  setState: (
    user: User,
    trips: Trip[],
    locations: Location[],
    itinerary: Itinerary[],
    budget: Budget[],
  ) => void;
  clearState: () => void;

  setDb: (
    trips: Trip[],
    locations: Location[],
    itinerary: Itinerary[],
    budget: Budget[],
  ) => void;

  setUser: (user: User) => void;

  setCurrencyRates: (currencyRates: Record<string, number>) => void;
  setRate: (rate: number) => void;
  setCurrency: (currency: string | undefined) => void;

  addTrip: (trip: Trip, location: Location, budget: Budget) => void;
  updateTrip: (tripId: string, updates: Partial<Trip>) => void;

  addLocation: (location: Location) => void;
  updateLocation: (locationId: string, updates: Partial<Location>) => void;
  removeLocation: (tripId: string, locationId: string) => void;

  addActivity: (itinerary: Itinerary) => void;
  updateActivity: (itineraryId: string, updates: Partial<Itinerary>) => void;
  removeActivity: (locationId: string, activityId: string) => void;

  addBudget: (budget: Budget) => void;
  updateBudget: (budgetId: string, updates: Partial<Budget>) => void;
}

const initialState = {
  uid: null,
  email: null,
  firstName: null,
  lastName: null,
  trips: [] as Trip[],
  locations: [] as Location[],
  itinerary: [] as Itinerary[],
  budgets: [] as Budget[],
  travels: [] as Travel[],
  currencyRates: { ZAR: 1 },
  rate: 1,
  currency: "R",
};

interface AuthState {
  uid: string | null;
  email: string | null;
  setUser: (user: { uid: string; email: string | null }) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      uid: null,
      email: null,

      setUser: (user: { uid: string; email: string | null }) =>
        set({
          uid: user.uid,
          email: user.email,
        }),

      clear: () => set({ uid: "", email: "" }),
    }),
    {
      name: "plantrip-auth", // localStorage key
      partialize: (state) => ({
        uid: state.uid,
        email: state.email,
      }),
    },
  ),
);

export const useDBStore = create<AccountState>((set) => ({
  ...initialState,

  setState: (user, trips, locations, itinerary, budgets) =>
    set({
      uid: user.uid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      trips,
      locations,
      itinerary,
      budgets,
    }),

  clearState: () => set(initialState),

  setDb: (trips, locations, itinerary, budgets) =>
    set({
      trips,
      locations,
      itinerary,
      budgets,
    }),

  setUser: (user) =>
    set({
      uid: user.uid,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }),

  setCurrencyRates: (currencyRates) =>
    set({
      currencyRates,
    }),

  setRate: (rate) => set({ rate }),

  setCurrency: (currency) => set({ currency: currency ? currency : "R" }),

  addTrip: (trip, location, budget) =>
    set((state) => ({
      trips: [...state.trips, trip],
      locations: [...state.locations, location],
      budgets: [...state.budgets, budget],
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
}));

export const useTrip = (tripId?: string): Trip | null =>
  useDBStore((state) => state.trips.find((trip) => trip.id === tripId) ?? null);

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
