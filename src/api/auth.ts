import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { setDoc, getDoc, doc } from "firebase/firestore";
import { auth, db } from "./firebase";
import type { User } from "types/db";
import logger from "utils/logger";

export const registerUser = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) => {
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );

  const user = credential.user;

  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    email: user.email,
    firstName: firstName,
    lastName: lastName,
    trips: [],
    createdAt: new Date(),
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);

  const authUser = credential.user;

  const snapshot = await getDoc(doc(db, "users", authUser.uid));

  const data = snapshot.data();
  if (!data) {
    logger.error("User document not found");
  }
  return { authUser, userDoc: data as User };
};

export const logoutUser = () => signOut(auth);

export const subscribeToAuth = (
  callback: (user: FirebaseUser | null) => void,
) => onAuthStateChanged(auth, callback);

setPersistence(auth, browserLocalPersistence);
