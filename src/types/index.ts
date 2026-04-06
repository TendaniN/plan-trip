import type { CityValues } from "constants/city";
import type { CountryValues } from "constants/country";

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
  accommodation?: SavedHotel | null;
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
  cost: number;
}

export interface Budget {
  id: string;
  tripId: string;
  accommodationTotal: number;
  itineraryTotal: number;
  travel: Travel[];
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
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  trips: string[];
}

// CORE (aligned with SerpApi)
export interface Hotel {
  id: string; // internal or placeId
  placeId: string;
  name: string;
  city: string;
  area?: string;
  rating: number;
  reviewCount: number;
  stars?: number;
  description?: string;
  link: string;
  image?: string;
}

export interface SavedHotel extends Hotel {
  price?: string | number;
  createdAt?: string;
}

export type CostProps = "Accommodation" | "Itinerary" | "Buffer" | "Travel";
