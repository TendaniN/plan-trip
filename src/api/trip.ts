import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "api/firebase";
import { calcDaysBetween } from "utils/calc-days-between";
import { v4 as uuidv4 } from "uuid";
import { useDBStore } from "db";
import type { CityValues } from "constants/city";
import type { CountryValues } from "constants/country";
import type { Budget, Trip } from "types";
import dayjs from "dayjs";
import { DEFAULT_DATE_FORMAT } from "constants/db";
import logger from "utils/logger";

interface TripInput {
  user_uid: string;
  name: string;
  city: CityValues;
  country: CountryValues;
  start: string;
  end: string;
}

export const createTrip = async ({
  user_uid,
  name,
  city,
  country,
  start,
  end,
}: TripInput) => {
  try {
    // generate ids
    const tripId = uuidv4();
    const locationId = uuidv4();
    const budgetId = uuidv4();

    // create Firestore objects
    const trip = {
      id: tripId,
      userId: user_uid,
      name,
      start_date: start,
      end_date: end,
      locations: [locationId],
      travels: [],
      budgets: [budgetId], // link budget
    };

    const location = {
      id: locationId,
      tripId,
      city,
      country,
      start_date: start,
      end_date: end,
      nights: calcDaysBetween(start, end),
      itinerary: [],
    };

    const budget = {
      id: budgetId,
      tripId,
      accommodationTotal: 0,
      itineraryTotal: 0,
      travel: [],
      buffer: 0,
    };

    // Firestore batch (optional, but ensures atomic write)
    await Promise.all([
      setDoc(doc(db, "trips", tripId), trip),
      setDoc(doc(db, "locations", locationId), location),
      setDoc(doc(db, "budgets", budgetId), budget),
    ]);

    logger.info("Created batch trip, location & budget entries.");
    useDBStore.getState().addTrip(trip, location, budget);

    return { trip, location, budget };
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
};

export const editTripName = async (tripId: string, name: string) => {
  const tripRef = doc(db, "trips", tripId);

  await updateDoc(tripRef, { name });

  useDBStore.getState().updateTrip(tripId, { name });

  return { id: tripId, name };
};

export const editTripLocations = async (
  tripId: string,
  start_date: string,
  end_date: string,
  locationId: string,
) => {
  const tripRef = doc(db, "trips", tripId);

  const snapshot = await getDoc(tripRef);
  const trip = snapshot.data();

  if (!trip) throw new Error("Trip not found");

  const locations = [...trip.locations, locationId];

  let trip_start_date = trip.start_date;
  if (dayjs(start_date).isBefore(dayjs(trip_start_date))) {
    trip_start_date = dayjs(start_date, DEFAULT_DATE_FORMAT).format(
      DEFAULT_DATE_FORMAT,
    );
  }
  let trip_end_date = trip.end_date;
  if (dayjs(end_date).isAfter(dayjs(trip_end_date))) {
    trip_end_date = dayjs(end_date, DEFAULT_DATE_FORMAT).format(
      DEFAULT_DATE_FORMAT,
    );
  }

  await updateDoc(tripRef, {
    start_date: trip_start_date,
    end_date: trip_end_date,
    locations,
  });

  useDBStore.getState().updateTrip(tripId, {
    start_date: trip_start_date,
    end_date: trip_end_date,
    locations,
  });
};

export const getTrips = async (userId?: string): Promise<Trip[]> => {
  const tripsRef = collection(db, "trips");

  const snapshot = userId
    ? await getDocs(query(tripsRef, where("userId", "==", userId)))
    : await getDocs(tripsRef);

  return snapshot.docs.map((doc) => doc.data() as Trip);
};

export const getBudgets = async (tripId?: string): Promise<Budget[]> => {
  const budgetRef = collection(db, "budgets");

  const snapshot = tripId
    ? await getDocs(query(budgetRef, where("tripId", "==", tripId)))
    : await getDocs(budgetRef);

  return snapshot.docs.map((doc) => doc.data() as Budget);
};
