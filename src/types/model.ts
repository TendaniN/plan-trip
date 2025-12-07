import type { CityValues } from "./cities";
import type { CountryValues } from "./countries";
import type { HotelProps } from "./hotels";

export interface Itinerary {
  id: number;
  date: string;
  time: string;
  duration: number;
  activity: string;
  link: string;
  cost: number;
  description: string;
}

export interface Location {
  id: number;
  city: CityValues;
  country: CountryValues;
  start_date: string;
  end_date: string;
  num_of_nights: number;
  accommodation: HotelProps;
  itinerary_activites: Itinerary[];
}

export interface Trip {
  id: number;
  name?: string;
  locations: Location[];
  start_date: string;
  end_date: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  trips: Trip[];
}
