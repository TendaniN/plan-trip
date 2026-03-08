import { useEffect } from "react";
import { useDBStore } from "db/store";
import logger from "utils/logger";
import { getBudgets, getTrips } from "api/trip";
import { getLocations, getItineraryActivities } from "api/location";

export default function useTripListener() {
  const { setDb, uid, trips, locations, itinerary, budgets } = useDBStore(
    (state) => state,
  );

  useEffect(() => {
    const loadDB = async () => {
      if (!uid) return;

      const dbEmpty =
        trips.length === 0 &&
        locations.length === 0 &&
        itinerary.length === 0 &&
        budgets.length === 0;

      if (!dbEmpty) return;

      try {
        const trips = await getTrips(uid);
        const locations = await getLocations();
        const itinerary = await getItineraryActivities();
        const budgets = await getBudgets();

        if (trips && locations && itinerary && budgets) {
          setDb(trips, locations, itinerary, budgets);
        }
      } catch (error) {
        logger.error("Failed to load db:", error);
      }
    };

    loadDB();
  }, [
    budgets.length,
    itinerary.length,
    locations.length,
    setDb,
    trips.length,
    uid,
  ]);
}
