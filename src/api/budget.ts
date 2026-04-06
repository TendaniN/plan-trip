import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "api/firebase";
import { v4 as uuidv4 } from "uuid";
import { useDBStore } from "db";
import type { Budget, Travel } from "types";

interface TravelInput {
  type: "flight" | "train" | "bus" | "car";
  duration: string;
  time: string;
  date: string;
  carrier: string;
  cost: number;
}

export const createTravel = async (
  tripId: string,
  budgetId: string,
  travel: TravelInput,
) => {
  const budgetRef = doc(db, "budgets", budgetId);

  const travelId = uuidv4();

  const newTravel = {
    id: travelId,
    tripId,
    ...travel,
  };

  const snapshot = await getDoc(budgetRef);
  const budget = snapshot.data();

  if (!budget) throw new Error("Budget not found");

  const travels = [...budget.travel, newTravel];

  await updateDoc(budgetRef, { travel: travels });

  useDBStore.getState().updateBudget(budgetId, { travel: travels });
};

export const deleteTravel = async (budgetId: string, travelId: string) => {
  const budgetRef = doc(db, "budgets", budgetId);

  const snapshot = await getDoc(budgetRef);
  const budget = snapshot.data();

  if (!budget) throw new Error("Budget not found");

  const budgetTravels =
    budget.travel?.filter((travel: Travel) => travel.id !== travelId) ?? [];

  await updateDoc(budgetRef, { travel: budgetTravels });

  useDBStore.getState().updateBudget(budgetId, { travel: budgetTravels });
};

export const editBudget = async (budgetId: string, change: Partial<Budget>) => {
  const budgetRef = doc(db, "budgets", budgetId);

  const snapshot = await getDoc(budgetRef);
  const budget = snapshot.data();

  if (!budget) throw new Error("Budget not found");

  await updateDoc(budgetRef, change);

  useDBStore.getState().updateBudget(budgetId, change);

  return { id: budgetId, change };
};
