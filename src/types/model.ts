import type { CityValues } from "./cities";
import type { CountryValues } from "./countries";

export interface Itinerary {
  id: string;
  locationId: string;
  date: string;
  time: string;
  duration: number;
  activity: string;
  link: string;
  cost: number;
  description: string;
}

export interface Location {
  id: string;
  tripId: string;
  city: CityValues;
  country: CountryValues;
  start_date: string;
  end_date: string;
  num_of_nights: number;
  accommodation?: string[];
  itinerary_activites: string[];
}

export interface Trip {
  id: string;
  userId: string;
  name?: string;
  locations: string[];
  start_date: string;
  end_date: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  first_name?: string;
  last_name?: string;
  trips: string[];
}
