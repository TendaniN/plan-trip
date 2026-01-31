const ASIAN_COUNTRIES = {
  JAPAN: "japan",
  SOUTH_KOREA: "south_korea",
} as const;

const MIDDLE_EASTERN_COUNTRIES = {
  UNITED_ARAB_EMIRATES: "united_arab_emirates",
  OMAN: "oman",
} as const;

const SOUTH_AMERICAN_COUNTRIES = {
  BRAZIL: "brazil",
  ARGENTINA: "argentina",
  CHILE: "chile",
} as const;

export const ALL_COUNTRIES = {
  ...ASIAN_COUNTRIES,
  ...MIDDLE_EASTERN_COUNTRIES,
  ...SOUTH_AMERICAN_COUNTRIES,
} as const;

export type CountryKeys = keyof typeof ALL_COUNTRIES;
export type CountryValues = (typeof ALL_COUNTRIES)[CountryKeys];

export const CONTINENT_MAP = [
  { continent: "Asia", cities: Object.values(ASIAN_COUNTRIES) },
  { continent: "Middle East", cities: Object.values(MIDDLE_EASTERN_COUNTRIES) },
  {
    continent: "South America",
    cities: Object.values(SOUTH_AMERICAN_COUNTRIES),
  },
];
