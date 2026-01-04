import type { CityValues } from "constants/city";
import type { CountryValues } from "constants/country";
import type { HotelProps } from "./hotel";

export interface Itinerary {
  id: string;
  locationId: string;
  activity: string;
  description: string;
  date: string;
  time: string;
  duration: number;
  cost: string | number;
  link: string;
}

export interface Location {
  id: string;
  tripId: string;
  city: CityValues;
  country: CountryValues;
  start_date: string;
  end_date: string;
  nights: number;
  accommodation?: HotelProps;
  itinerary: string[];
}

export interface Travel {
  id: string;
  tripId: string;
  type: "flight" | "train" | "bus" | "car";
  duration: string;
  time: string;
  date: string;
  carrier: string;
}

export interface Budget {
  id: string;
  tripId: string;
  accommodation: number;
  itinerary: number;
  travel: number;
  buffer: number;
}

export interface Trip {
  id: string;
  userId: string;
  name: string;
  start_date: string;
  end_date: string;
  locations: string[];
  travels: string[];
  budgets: string[];
}

export interface User {
  id: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  trips: string[];
}
