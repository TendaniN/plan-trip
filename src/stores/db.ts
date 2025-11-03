import Dexie, { type EntityTable } from "dexie";
import type { HotelProps } from "types/hotels";
import { type ItineraryProps } from "types/itinerary";

const db = new Dexie("PlanTripDB") as Dexie & {
  itinerary: EntityTable<ItineraryProps, "id">;
  cities: EntityTable<{ id: number; type: string; cities: string[] }, "id">;
  hotels: EntityTable<HotelProps, "id">;
};

db.version(1).stores({
  itinerary: "++id, name, location, dat, start_time, end_time, duration, link",
  cities: "++id, type, *cities",
  hotels:
    "++id, name, area, rating, stars, distance, price, link room, breakfast",
});

export { db };
