import AppLayout from "layouts/AppLayout";
import { Routes, Route } from "react-router-dom";
import LoginPage from "pages/login.page";
import RegisterPage from "pages/register.page";
import LogoutPage from "pages/logout.page";
import ProtectedLayout from "layouts/ProtectedLayout";
import TripsPage from "./trips.page";
import TripPage from "./trip.page";
import LocationPage from "./location.page";
import BudgetPage from "./budget.page";
import CountriesPage from "./countries.page";
import AccommodationPage from "./accommodation.page";
import HomePage from "./home.page";
import HelpPage from "./help.page";

export const Pages = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/trip" element={<TripsPage />} />
          <Route path="/trip/:tripId" element={<TripPage />} />
          <Route
            path="/trip/:tripId/location/:locationId"
            element={<LocationPage />}
          />
          <Route path="/trip/:tripId/budget" element={<BudgetPage />} />
          <Route path="/country" element={<CountriesPage />} />
          <Route
            path="/country/:city/accommodation"
            element={<AccommodationPage />}
          />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/help" element={<HelpPage />} />
      </Route>

      <Route path="/logout" element={<LogoutPage />} />
    </Routes>
  );
};
