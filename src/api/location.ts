import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "api/firebase";
import { calcDaysBetween } from "utils/calc-days-between";
import { v4 as uuidv4 } from "uuid";
import { useDBStore } from "db/store";
import type { CityValues } from "constants/city";
import type { CountryValues } from "constants/country";
import type { Location, Itinerary, Trip } from "types/db";
import type { HotelProps } from "types/hotel";
import { sum } from "utils/sum";
import dayjs from "dayjs";

import { DEFAULT_DATE_FORMAT } from "constants/db";

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

export const editLocationDate = async (
  locationId: string,
  trip: Trip,
  date: string,
  start = true,
) => {
  const locationRef = doc(db, "locations", locationId);
  const tripRef = doc(db, "trips", trip.id);

  const snapshot = await getDoc(locationRef);
  const location = snapshot.data();

  if (!location) throw new Error("Location not found");

  const start_date = start ? date : location.start_date;
  const end_date = start ? location.end_date : date;

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

  const nights = calcDaysBetween(start_date, end_date);

  const change = start ? { start_date, nights } : { end_date, nights };

  await updateDoc(locationRef, change);

  useDBStore.getState().updateLocation(locationId, change);

  await updateDoc(tripRef, {
    start_date: trip_start_date,
    end_date: trip_end_date,
  });

  useDBStore.getState().updateTrip(trip.id, {
    start_date: trip_start_date,
    end_date: trip_end_date,
  });

  return { id: locationId, change };
};

export const editLocationHotel = async (
  locationId: string,
  tripId: string,
  accommodation?: HotelProps,
) => {
  const locationRef = doc(db, "locations", locationId);

  await updateDoc(locationRef, { accommodation });

  // update store immediately
  useDBStore.getState().updateLocation(locationId, { accommodation });

  // recalc hotel totals
  const locationsSnapshot = await getDocs(
    query(collection(db, "locations"), where("tripId", "==", tripId)),
  );

  const locations = locationsSnapshot.docs.map((doc) => doc.data());

  const hotelTotal = sum(locations.map((loc) => loc.accommodation?.price || 0));

  const budgetSnapshot = await getDocs(
    query(collection(db, "budgets"), where("tripId", "==", tripId)),
  );

  const budgetDoc = budgetSnapshot.docs[0];

  if (budgetDoc) {
    const budgetData = budgetDoc.data();

    await updateDoc(doc(db, "budgets", budgetDoc.id), {
      "accommodation.hotelTotal": hotelTotal,
    });

    // update zustand
    useDBStore.getState().updateBudget(budgetDoc.id, {
      accommodation: {
        hotelTotal,
        itineraryTotal: budgetData.accommodation?.itineraryTotal || 0,
      },
    });
  }

  return { locationId, accommodation, hotelTotal };
};

export const getLocations = async (tripId?: string): Promise<Location[]> => {
  const locationsRef = collection(db, "locations");

  const snapshot = tripId
    ? await getDocs(query(locationsRef, where("tripId", "==", tripId)))
    : await getDocs(locationsRef);

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

    return { activity: newActivity };
  } catch (error) {
    console.error("Error creating itinerary activity:", error);
    throw error;
  }
};

export const getItineraryActivities = async (
  locationId?: string,
): Promise<Itinerary[]> => {
  const itineraryRef = collection(db, "itinerary");

  const snapshot = locationId
    ? await getDocs(query(itineraryRef, where("locationId", "==", locationId)))
    : await getDocs(itineraryRef);

  return snapshot.docs.map((doc) => doc.data() as Itinerary);
};
