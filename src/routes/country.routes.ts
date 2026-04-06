import CountriesPage from "features/country/countries.page";
import AccommodationPage from "features/country/accommodation.page";
import ProtectedLayout from "layouts/ProtectedLayout";

export const countryRoutes = [
  {
    path: "country",
    Component: ProtectedLayout,
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
