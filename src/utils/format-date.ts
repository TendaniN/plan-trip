import moment, { type Moment } from "moment";

export const formatDate = (date: Moment, format?: string) => {
  if (format) {
    return `${moment(date).format(format)}`;
  }
  return `${date.format("ddd, MMM D, YYYY")}`;
};
