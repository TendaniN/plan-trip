import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  updateDoc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "api/firebase";
import { v4 as uuidv4 } from "uuid";
import { useDBStore } from "db";
import type { Itinerary } from "types";
import { sum } from "utils/sum";

interface ItineraryInput {
  locationId: string;
  tripId: string;
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
  tripId,
  date,
  activity,
  description,
  time,
  duration,
  link,
  cost,
}: ItineraryInput) => {
  try {
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

    const locationRef = doc(db, "locations", locationId);

    const snapshot = await getDoc(locationRef);
    const location = snapshot.data();

    if (!location) throw new Error("Location not found");

    const activities = [...location.itinerary, activityId];

    await updateDoc(locationRef, {
      itinerary: activities,
    });

    useDBStore.getState().updateLocation(locationId, {
      itinerary: activities,
    });

    const budgetSnapshot = await getDocs(
      query(collection(db, "budgets"), where("tripId", "==", tripId)),
    );
    const budgetDoc = budgetSnapshot.docs[0];

    if (budgetDoc) {
      const itinerarySnapshot = await getDocs(
        query(
          collection(db, "itinerary"),
          where("locationId", "==", locationId),
        ),
      );
      const activities = itinerarySnapshot.docs.map(
        (doc) => doc.data() as Itinerary,
      );

      const itineraryTotal = sum(
        activities.map((act) => Number(act.cost) || 0),
      );

      const budgetId = budgetDoc.id;
      await updateDoc(doc(db, "budgets", budgetId), {
        itineraryTotal,
      });
      useDBStore.getState().updateBudget(budgetId, {
        itineraryTotal,
      });
    }
    return { activity: newActivity };
  } catch (error) {
    console.error("Error creating itinerary activity:", error);
    throw error;
  }
};

export const editItineraryActivity = async ({
  locationId,
  tripId,
  activityId,
  change,
}: {
  locationId: string;
  tripId: string;
  activityId: string;
  change: Partial<Itinerary>;
}) => {
  try {
    const activityRef = doc(db, "itinerary", activityId);
    await updateDoc(activityRef, change);

    useDBStore.getState().updateActivity(activityId, change);

    const budgetSnapshot = await getDocs(
      query(collection(db, "budgets"), where("tripId", "==", tripId)),
    );

    const budgetDoc = budgetSnapshot.docs[0];

    if (budgetDoc) {
      const itinerarySnapshot = await getDocs(
        query(
          collection(db, "itinerary"),
          where("locationId", "==", locationId),
        ),
      );
      const activities = itinerarySnapshot.docs.map(
        (doc) => doc.data() as Itinerary,
      );

      const itineraryTotal = sum(
        activities.map((act) => Number(act.cost) || 0),
      );

      const budgetId = budgetDoc.id;
      await updateDoc(doc(db, "budgets", budgetId), {
        itineraryTotal,
      });
      useDBStore.getState().updateBudget(budgetId, {
        itineraryTotal,
      });
    }
    return { change };
  } catch (error) {
    console.error("Error creating itinerary activity:", error);
    throw error;
  }
};

export const deleteActivity = async (
  locationId: string,
  activityId: string,
) => {
  const activityRef = doc(db, "itinerary", locationId);
  const locationRef = doc(db, "locations", locationId);

  const snapshot = await getDoc(locationRef);
  const location = snapshot.data();

  if (!location) throw new Error("Location not found");

  const activities =
    location.itinerary?.filter((id: string) => id !== activityId) ?? [];

  await updateDoc(locationRef, {
    itinerary: activities,
  });

  useDBStore.getState().updateLocation(locationId, {
    itinerary: activities,
  });

  await deleteDoc(activityRef);
  useDBStore.getState().removeActivity(locationId, activityId);
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
