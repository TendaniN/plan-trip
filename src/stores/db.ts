import Dexie, { type EntityTable } from "dexie";
import logger from "utils/logger";
import type { User } from "types/model";

export interface CityProps {
  id: number;
  country: string;
  label: string;
  startDate: string;
  endDate: string;
}

export interface Location {
  id: number;
  city: string;
}

export interface Trip {
  id: number;
  name?: string;
  locations: [];
  start_date: string;
  end_date: string;
}

export interface UserProps {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  trips: Trip[];
}

// Define the db instance type
const db = new Dexie("PlanTripDB") as Dexie & {
  user: EntityTable<User, "id">;
};

// Define schema
db.version(1).stores({
  user: "++id, username, password, first_name, last_name, trips, *trips",
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
