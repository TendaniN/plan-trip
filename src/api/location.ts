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
import type { Location, Itinerary } from "types/db";
import type { HotelProps } from "types/hotel";
import { sum } from "utils/sum";

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
  date: string,
  start = true,
) => {
  const locationRef = doc(db, "locations", locationId);

  const snapshot = await getDoc(locationRef);
  const location = snapshot.data();

  if (!location) throw new Error("Location not found");

  const start_date = start ? date : location.start_date;
  const end_date = start ? location.end_date : date;

  const nights = calcDaysBetween(start_date, end_date);

  const change = start ? { start_date, nights } : { end_date, nights };

  await updateDoc(locationRef, change);

  return { id: locationId, change };
};

export const editLocationHotel = async (
  locationId: string,
  tripId: string,
  accommodation?: HotelProps,
) => {
  const locationRef = doc(db, "locations", locationId);

  // update location
  await updateDoc(locationRef, { accommodation });

  // get all locations for the trip
  const locationsSnapshot = await getDocs(
    query(collection(db, "locations"), where("tripId", "==", tripId)),
  );

  const locations = locationsSnapshot.docs.map((doc) => doc.data());

  // calculate hotel total
  const hotelTotal = sum(locations.map((loc) => loc.accommodation?.price || 0));

  // get budget
  const budgetSnapshot = await getDocs(
    query(collection(db, "budgets"), where("tripId", "==", tripId)),
  );

  const budgetDoc = budgetSnapshot.docs[0];

  if (budgetDoc) {
    await updateDoc(doc(db, "budgets", budgetDoc.id), { hotelTotal });
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

    return { location };
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
