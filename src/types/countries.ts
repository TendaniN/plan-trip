const ASIAN_COUNTRIES = {
  JAPAN: "japan",
  SOUTH_KOREA: "south korea",
} as const;

export const ALL_COUNTRIES = {
  ...ASIAN_COUNTRIES,
} as const;

export type CountryKeys = keyof typeof ALL_COUNTRIES;
export type CountryValues = (typeof ALL_COUNTRIES)[CountryKeys];

export const CONTINENT_MAP = [
  { type: "asia", cities: Object.values(ASIAN_COUNTRIES) },
];
