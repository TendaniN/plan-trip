import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "api/firebase";
import { calcDaysBetween } from "utils/calc-days-between";
import { v4 as uuidv4 } from "uuid";
import { useDBStore } from "db";
import type { CityValues } from "constants/city";
import type { CountryValues } from "constants/country";
import type { Location, Trip, SavedHotel } from "types";
import { sum } from "utils/sum";
import dayjs from "dayjs";
import { editTripLocations } from "./trip";

interface LocationInput {
  tripId: string;
  city: CityValues;
  country: CountryValues;
  start: string;
  end: string;
  accommodation?: SavedHotel;
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
      accommodation: accommodation ? accommodation : null,
      itinerary: [],
    };

    await setDoc(doc(db, "locations", locationId), location);

    useDBStore.getState().addLocation(location);

    await editTripLocations(tripId, start, end, locationId);

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

  const locations = await getLocations(trip.id);
  const sortedLocations = locations.sort(
    (a, b) => dayjs(a.start_date).valueOf() - dayjs(b.start_date).valueOf(),
  );

  const start_date = start ? date : location.start_date;
  const end_date = start ? location.end_date : date;

  const trip_start_date = sortedLocations[0].start_date;
  const trip_end_date = sortedLocations[sortedLocations.length - 1].end_date;
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
  accommodation?: SavedHotel | null,
) => {
  const locationRef = doc(db, "locations", locationId);

  await updateDoc(locationRef, { accommodation });

  useDBStore.getState().updateLocation(locationId, { accommodation });

  const budgetSnapshot = await getDocs(
    query(collection(db, "budgets"), where("tripId", "==", tripId)),
  );

  const budgetDoc = budgetSnapshot.docs[0];

  if (budgetDoc) {
    const locationsSnapshot = await getDocs(
      query(collection(db, "locations"), where("tripId", "==", tripId)),
    );
    const locations = locationsSnapshot.docs.map(
      (doc) => doc.data() as Location,
    );
    const accommodationTotal = sum(
      locations.map((loc) => loc.accommodation?.price || 0),
    );
    const budgetId = budgetDoc.id;
    await updateDoc(doc(db, "budgets", budgetId), {
      accommodationTotal,
    });
    useDBStore.getState().updateBudget(budgetId, {
      accommodationTotal,
    });
  }

  return { locationId, accommodation };
};

export const deleteLocation = async (tripId: string, locationId: string) => {
  const locationRef = doc(db, "locations", locationId);
  const tripRef = doc(db, "trips", tripId);

  const snapshot = await getDoc(tripRef);
  const trip = snapshot.data();

  if (!trip) throw new Error("Trip not found");

  const locations =
    trip.locations?.filter((id: string) => id !== locationId) ?? [];

  await deleteDoc(locationRef);
  useDBStore.getState().removeLocation(tripId, locationId);

  await updateDoc(tripRef, {
    locations,
  });

  useDBStore.getState().updateTrip(tripId, {
    locations,
  });
};

export const getLocations = async (tripId?: string): Promise<Location[]> => {
  const locationsRef = collection(db, "locations");

  const snapshot = tripId
    ? await getDocs(query(locationsRef, where("tripId", "==", tripId)))
    : await getDocs(locationsRef);

  return snapshot.docs.map((doc) => doc.data() as Location);
};
