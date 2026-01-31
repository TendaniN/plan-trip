const JAPAN_CITIES = {
  OSAKA: "osaka",
  TOKYO: "tokyo",
} as const;
const SOUTH_KOREA_CITIES = {
  SEOUL: "seoul",
} as const;

const UNITED_ARAB_EMIRATES_CITIES = {
  DUBAI: "dubai",
  ABU_DHABI: "abu dhabi",
} as const;
const OMAN_CITIES = {
  MUSCAT: "muscat",
} as const;

const BRAZIL_CITIES = {
  RIO_DE_JANEIRO: "rio de janeiro",
  SAO_PAULO: "sao paulo",
} as const;
const ARGENTINA_CITIES = {
  BUENOS_AIRES: "buenos aires",
  MENDOZA: "mendoza",
} as const;
const CHILE_CITIES = {
  SANTIAGO: "santiago",
} as const;

export const ALL_CITIES = {
  ...JAPAN_CITIES,
  ...SOUTH_KOREA_CITIES,
  ...UNITED_ARAB_EMIRATES_CITIES,
  ...OMAN_CITIES,
  ...BRAZIL_CITIES,
  ...ARGENTINA_CITIES,
  ...CHILE_CITIES,
} as const;

export type CityKeys = keyof typeof ALL_CITIES;
export type CityValues = (typeof ALL_CITIES)[CityKeys];

export const CITY_MAP = [
  {
    country: "argentina",
    cities: Object.values(ARGENTINA_CITIES),
  },
  {
    country: "brazil",
    cities: Object.values(BRAZIL_CITIES),
  },
  {
    country: "chile",
    cities: Object.values(CHILE_CITIES),
  },
  { country: "japan", cities: Object.values(JAPAN_CITIES) },
  {
    country: "oman",
    cities: Object.values(OMAN_CITIES),
  },
  { country: "south korea", cities: Object.values(SOUTH_KOREA_CITIES) },
  {
    country: "united arab emirates",
    cities: Object.values(UNITED_ARAB_EMIRATES_CITIES),
  },
];
