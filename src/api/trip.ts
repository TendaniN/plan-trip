import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "api/firebase";
import { calcDaysBetween } from "utils/calc-days-between";
import { v4 as uuidv4 } from "uuid";
import { useDBStore } from "db/store";
import type { CityValues } from "constants/city";
import type { CountryValues } from "constants/country";
import type { Budget, Itinerary, Trip, Location } from "types/db";
import type { HotelProps } from "types/hotel";

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
      accommodation: { itineraryTotal: 0, hotelTotal: 0 },
      travel: [],
      buffer: 0,
    };

    // Firestore batch (optional, but ensures atomic write)
    await Promise.all([
      setDoc(doc(db, "trips", tripId), trip),
      setDoc(doc(db, "locations", locationId), location),
      setDoc(doc(db, "budgets", budgetId), budget),
      setDoc(doc(db, "budgets", budgetId), budget),
    ]);

    useDBStore.getState().addTrip(trip, location, budget);

    return { trip, location, budget };
  } catch (error) {
    console.error("Error creating trip:", error);
    throw error;
  }
};

export const getTrips = async () => {
  const snapshot = await getDocs(collection(db, "trips"));

  return snapshot.docs.map((doc) => doc.data() as Trip);
};

interface LocationInput {
  tripId: string;
  city: CityValues;
  country: CountryValues;
  start: string;
  end: string;
  accommodation?: HotelProps;
}

export const createLocation = async ({
  tripId,
  city,
  country,
  start,
  end,
  accommodation,
}: LocationInput) => {
  try {
    // generate ids
    const locationId = uuidv4();

    const location = {
      id: locationId,
      tripId,
      city,
      country,
      start_date: start,
      end_date: end,
      nights: calcDaysBetween(start, end),
      accommodation,
      itinerary: [],
    };

    await setDoc(doc(db, "locations", locationId), location);

    useDBStore.getState().addLocation(location);

    return { location };
  } catch (error) {
    console.error("Error creating location:", error);
    throw error;
  }
};

export const getLocations = async () => {
  const snapshot = await getDocs(collection(db, "locations"));

  return snapshot.docs.map((doc) => doc.data() as Location);
};

interface ItineraryInput {
  locationId: string;
  date: string;
  activity: string;
  description: string;
  time: string;
  duration: number;
  link: string;
  cost: string | number;
}

export const createItineraryActivity = async ({
  locationId,
  date,
  activity,
  description,
  time,
  duration,
  link,
  cost,
}: ItineraryInput) => {
  try {
    // generate ids
    const activityId = uuidv4();

    const newActivity = {
      id: activityId,
      locationId,
      date,
      activity,
      description,
      time,
      duration,
      link,
      cost,
    };

    await setDoc(doc(db, "itinerary", activityId), newActivity);

    useDBStore.getState().addActivity(newActivity);

    return { location };
  } catch (error) {
    console.error("Error creating itinerary activity:", error);
    throw error;
  }
};

export const getItineraryActivities = async () => {
  const snapshot = await getDocs(collection(db, "itinerary"));

  return snapshot.docs.map((doc) => doc.data() as Itinerary);
};

export const getBudgets = async () => {
  const snapshot = await getDocs(collection(db, "budgets"));

  return snapshot.docs.map((doc) => doc.data() as Budget);
};
