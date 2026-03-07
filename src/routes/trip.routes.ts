import TripsPage from "features/trip/trips.page";
import TripPage from "features/trip/trip.page";
import LocationPage from "features/trip/location.page";
import BudgetPage from "features/trip/budget.page";

export const tripRoutes = [
  {
    path: "trip",
    children: [
      {
        index: true, // /trip
        Component: TripsPage,
      },
      {
        path: ":tripId", // /trip/:tripId
        children: [
          {
            index: true, // /trip/:tripId
            Component: TripPage,
          },
          {
            path: "location/:locationId", // /trip/:tripId/location/:locationId
            Component: LocationPage,
          },
          {
            path: "budget", // /trip/:tripId/budget
            Component: BudgetPage,
          },
        ],
      },
    ],
  },
];
