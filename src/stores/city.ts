import { CITY_MAP, type CityValues } from "types/cities";
import { type CountryValues } from "types/countries";
import { create } from "zustand";

type State = {
  cities: { country: string; cities: string[] };
};

type Actions = {
  getCountryCities: (country: CountryValues) => void;
  setCity: (city: CityValues) => void;
};

type Action = {
  type: keyof Actions;
  city: CityValues;
  country: CountryValues;
};

const cityReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "setCity":
      return { city: action.city };
    case "getCountryCities":
      return {
        cities: CITY_MAP.find(({ country }) => country === action.country),
      };
    default:
      return state;
  }
};

export const useHotelStore = create((set) => ({
  cities: CITY_MAP,
  dispatch: (args: Action) => set((state: State) => cityReducer(state, args)),
}));
