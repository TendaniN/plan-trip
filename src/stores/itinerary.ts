import Dexie, { type EntityTable } from "dexie";
import { type ItineraryProps } from "types/itinerary";

const db = new Dexie("PlanTripDB") as Dexie & {
  itinerary: EntityTable<ItineraryProps, "id">;
};

db.version(1).stores({
  itinerary: "++id, name, location, dat, start_time, end_time, duration, link",
});

export { db };
