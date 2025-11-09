import Dexie, { type EntityTable } from "dexie";
import type { HotelProps } from "types/hotels";
import type { ItineraryProps } from "types/itinerary";
import { Dayjs } from "dayjs";
import logger from "utils/logger";

// Define the db instance type
const db = new Dexie("PlanTripDB") as Dexie & {
  itinerary: EntityTable<ItineraryProps, "id">;
  cities: EntityTable<{ id: number; country: string; label: string }, "id">;
  hotels: EntityTable<HotelProps, "id">;
  startDate: EntityTable<{ id: number; date: Dayjs | null }, "id">;
  endDate: EntityTable<{ id: number; date: Dayjs | null }, "id">;
};

// Define schema
db.version(1).stores({
  itinerary: "++id, name, location, date, start_time, end_time, duration, link",
  cities: "++id, country, label",
  hotels:
    "++id, name, area, rating, stars, distance, price, link, room, breakfast",
  startDate: "id, date",
  endDate: "id, date",
});

// Check if db exists or create it
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
