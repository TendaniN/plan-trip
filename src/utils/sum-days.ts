import dayjs from "dayjs";

export const workingSumDays = (start: string, end: string) => {
  let count = 0;
  let daysRemaining = dayjs(end).diff(dayjs(start), "days", true);
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
