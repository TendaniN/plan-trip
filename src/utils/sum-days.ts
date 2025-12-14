import type { Moment } from "moment";

export const sumDays = (days: number[]) => {
  return days.reduce((partialSum, a) => partialSum + a, 0);
};

export const workingSumDays = (start: Moment, end: Moment) => {
  let count = 0;
  let daysRemaining = end.diff(start, "days");
  const newDate = start.clone();
  while (daysRemaining > -1) {
    if (newDate.day() !== 0 && newDate.day() !== 6) {
      count += 1;
    }
    newDate.add(1, "days");
    daysRemaining -= 1;
  }
  return count;
};
