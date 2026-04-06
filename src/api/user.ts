import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "types";

export const addTripToUser = async (uid: string, tripId: string) => {
  await updateDoc(doc(db, "users", uid), {
    trips: arrayUnion(tripId),
  });
};

export const getUser = async (uid: string) => {
  const snapshot = await getDoc(doc(db, "users", uid));

  return snapshot.data() as User;
};
