import dayjs from "dayjs";
import { calcDaysBetween } from "./calc-days-between";

export const workingSumDays = (start: string, end: string) => {
  let count = 0;
  let daysRemaining = calcDaysBetween(start, end);
  let newDate = dayjs(start).clone();
  while (daysRemaining > -1) {
    if (newDate.day() !== 0 && newDate.day() !== 6) {
      count += 1;
    }
    newDate = newDate.add(1, "day");
    daysRemaining -= 1;
  }
  return count;
};
