import type { CityValues } from "types/cities";
import type { HotelProps } from "types/hotels";
import { ALL_HOTELS } from "constants/hotels";
import { create } from "zustand";

type State = {
  hotel: HotelProps | null;
  hotels: HotelProps[];
};

type Actions = {
  getCityHotels: (city: CityValues) => void;
  getCityHotel: (city: CityValues, name: string) => void;
};

type Action = {
  type: keyof Actions;
  city: CityValues;
  name?: string;
};

const hotelReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "getCityHotel": {
      const hotel = ALL_HOTELS.find(
        ({ type }) => type === action.city
      )?.hotels.find(({ name }) => name === action.name);
      return { hotel };
    }
    case "getCityHotels": {
      return {
        hotels: ALL_HOTELS.find(({ type }) => type === action.city)?.hotels,
      };
    }
    default:
      return state;
  }
};

export const useHotelStore = create((set) => ({
  hotel: null,
  hotels: new Array<HotelProps>(),
  dispatch: (args: Action) => set((state: State) => hotelReducer(state, args)),
}));
