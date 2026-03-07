import { useEffect } from "react";
import { useDBStore } from "db/store";
import logger from "utils/logger";
import {
  getBudgets,
  getItineraryActivities,
  getLocations,
  getTrips,
} from "api/trip";

export default function useTripListener() {
  const setDb = useDBStore((state) => state.setDb);

  useEffect(() => {
    const loadDB = async () => {
      try {
        const trips = await getTrips();
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
  }, [setDb]);
}
