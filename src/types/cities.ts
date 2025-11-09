const JAPAN_CITIES = {
  OSAKA: "osaka",
  TOKYO: "tokyo",
} as const;

const SOUTH_KOREA_CITIES = {
  SEOUL: "seoul",
} as const;

export const ALL_CITIES = {
  ...JAPAN_CITIES,
  ...SOUTH_KOREA_CITIES,
} as const;

export type CityKeys = keyof typeof ALL_CITIES;
export type CityValues = (typeof ALL_CITIES)[CityKeys];

export const CITY_MAP = [
  { country: "japan", cities: Object.values(JAPAN_CITIES) },
  { country: "south korea", cities: Object.values(SOUTH_KOREA_CITIES) },
];
