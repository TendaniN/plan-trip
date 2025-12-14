import type { Moment } from "moment";

export const calcDaysBetween = (start: Moment, end: Moment) => {
  return Math.ceil(end.diff(start, "days", true));
};
