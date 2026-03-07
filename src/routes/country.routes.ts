import CountriesPage from "features/country/countries.page";
import AccommodationPage from "features/country/accommodation.page";

export const countryRoutes = [
  {
    path: "country",
    children: [
      {
        index: true, // /country
        Component: CountriesPage,
      },
      {
        path: ":city/accommodation", // /country/:city/accommodation
        Component: AccommodationPage,
      },
    ],
  },
];
