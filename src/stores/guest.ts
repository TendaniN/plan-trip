import { type CityValues } from "types/cities";
import { type CountryValues } from "types/countries";
import { create } from "zustand";

interface GuestLocation {
  city: CityValues;
  country: CountryValues;
  start_date: string;
  end_date: string;
}

type State = {
  name?: string;
  locations: GuestLocation[];
  start_date: string;
  end_date: string;
};

type Actions = {
  getLocations: () => void;
  updateLocation: ({
    city,
    country,
    start_date,
    end_date,
  }: {
    city: CityValues;
    country: CountryValues;
    start_date: string;
    end_date: string;
  }) => void;
  updateStart: (start: string) => void;
  updateEnd: (end: string) => void;
};

type Action = {
  type: keyof Actions;
  start: string;
  end: string;
  location: GuestLocation;
};

const cityReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "getLocations":
      return state.locations;
    case "updateLocation": {
      return state.locations.push(action.location);
    }
    case "updateStart": {
      state.start_date = action.start;
      return action.start;
    }
    case "updateEnd": {
      state.end_date = action.end;
      return action.end;
    }
    default:
      return state;
  }
};

export const useGuestStore = create((set) => ({
  name: null,
  locations: new Array<GuestLocation>(),
  start_date: "",
  end_date: "",
  dispatch: (args: Action) => set((state: State) => cityReducer(state, args)),
}));
