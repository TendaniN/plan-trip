import Dexie, { type EntityTable } from "dexie";
import logger from "utils/logger";
import type { User } from "types/model";

// Define the db instance type
const db = new Dexie("PlanTripDB") as Dexie & {
  user: EntityTable<User, "id">;
};

// Define schema
db.version(1).stores({
  user: "++id, &username, password, first_name, last_name, *trips",
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
