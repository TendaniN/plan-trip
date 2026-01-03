import dayjs from "dayjs";

export const calcDaysBetween = (start: string, end: string) => {
  return Math.ceil(dayjs(end).diff(dayjs(start), "days", true));
};
