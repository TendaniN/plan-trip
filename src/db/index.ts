import Dexie, { type EntityTable } from "dexie";
import type { Trip, Location, Budget, Travel, Itinerary } from "types/db";
import logger from "utils/logger";

const db = new Dexie("PlanTripDB") as Dexie & {
  trips: EntityTable<Trip, "id">;
  locations: EntityTable<Location, "id">;
  budgets: EntityTable<Budget, "id">;
  travels: EntityTable<Travel, "id">;
  itinerary: EntityTable<Itinerary, "id">;
};

db.version(1).stores({
  trips:
    "++id, userId, name, start_date, end_date, *locations, *travels, *budgets",
  budgets: "++id, &tripId, accommodation, itinerary, travel, buffer",
  travels: "++id, tripId, type, duration, time, date, carrier",
  locations:
    "++id, tripId, city, country, start_date, end_date, nights, accommodation, *itinerary",
  itinerary:
    "++id, locationId, string, activity, description, date, time, duration, cost, link",
});

export const initDB = async () => {
  const exists = await Dexie.exists("PlanTripDB");

  if (exists) {
    logger.log('Database "PlanTripDB" already exists ✅');
  } else {
    logger.info('Database "PlanTripDB" does not exist — creating... 🆕');
  }

  await db.open();
  return db;
};

export { db };
