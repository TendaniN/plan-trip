// hotel.ts

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import type { Hotel, SavedHotel } from "types";
import { db } from "./firebase";

const HOTEL_COLLECTION = "hotels";

// FIREBASE: GET HOTELS BY CITY (CACHE FIRST)
export const getHotelsByCity = async (city: string): Promise<SavedHotel[]> => {
  const q = query(collection(db, HOTEL_COLLECTION), where("city", "==", city));

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<SavedHotel, "id">),
  }));
};

// SERPAPI RESPONSE TYPE
interface PlacesProps {
  position: number;
  title: string;
  place_type: string;
  place_id: string;
  link: string;
  serpapi_link: string;
  description?: string;
  rating: number;
  reviews: number;
  location: string;
  thumbnail: string;
}

// MAP API → CLEAN HOTEL MODEL
const mapToHotel = (place: PlacesProps, city: string): Hotel => ({
  id: place.place_id,
  placeId: place.place_id,

  name: place.title,
  city,
  area: place.location,

  rating: place.rating,
  reviewCount: place.reviews,
  description: place.description,

  stars: place.rating ? Math.round(place.rating) : undefined,

  link: place.link,
  image: place.thumbnail,
});

// EXTERNAL SEARCH (SERPAPI)
export const searchHotelsExternal = async (
  city: string,
  searchString?: string,
): Promise<Hotel[]> => {
  const res = await fetch(
    `https://serpapi.com/search?engine=tripadvisor&q=${encodeURIComponent(city)}${searchString ? encodeURIComponent(searchString) : ""}&ssrc=h&api_key=${import.meta.env.VITE_SERPAPI_API_KEY}`,
  );
  const data = await res.json();

  return data.places.map((place: PlacesProps) => mapToHotel(place, city));
};

// COMBINED SEARCH (CACHE → API)
export const searchHotels = async (city: string) => {
  const cached = await getHotelsByCity(city);
  const external = await searchHotelsExternal(city);

  // Deduplicate by placeId OR name fallback
  const cachedIds = new Set(cached.map((h) => h.placeId || h.name));

  const filteredExternal = external.filter(
    (h) => !cachedIds.has(h.placeId || h.name),
  );

  return {
    cached,
    external: filteredExternal,
    combined: [...cached, ...filteredExternal],
  };
};

// SAVE SELECTED HOTEL
export const saveHotel = async (hotel: Hotel | SavedHotel) => {
  const docRef = await addDoc(collection(db, HOTEL_COLLECTION), {
    ...hotel,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
};

// OPTIONAL: PREVENT DUPLICATES
export const saveHotelIfNotExists = async (hotel: Hotel | SavedHotel) => {
  const existing = await getHotelsByCity(hotel.city);

  const exists = existing.some(
    (h) => h.placeId === hotel.placeId || h.name === hotel.name,
  );

  if (!exists) {
    return saveHotel(hotel);
  }

  return null;
};
