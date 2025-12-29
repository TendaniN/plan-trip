import dayjs from "dayjs";

export const calcDaysBetween = (start: string, end: string) => {
  return Math.ceil(dayjs(start).diff(dayjs(end), "days", true));
};
