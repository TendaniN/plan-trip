import { Navbar } from "components/index";
import { db } from "db";
import { useDBStore } from "db/store";
import { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import logger from "utils/logger";

import { clearSession, isSessionExpired } from "utils/session";
import RegisterPage from "./register-page";
import LoginPage from "./login-page";
import HomePage from "./home-page";
import TripPage from "./trip-page";
import { showNotification } from "@mantine/notifications";
import LocationPage from "./location-page";

const Pages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setState, id, username } = useDBStore((state) => state);

  const addToStore = async () => {
    try {
      const users = await db.user.toArray();
      const trips = await db.trips.toArray();
      const locations = await db.locations.toArray();
      const itinerary = await db.itinerary.toArray();
      const travels = await db.travels.toArray();
      const budgets = await db.budgets.toArray();

      if (users.length > 0) {
        setState(
          users[0],
          trips.filter(({ userId }) => userId === users[0].id),
          locations,
          itinerary,
          budgets,
          travels
        );

        logger.info("Restoring session...");

        if (
          location.pathname === "/register" ||
          location.pathname === "/login"
        ) {
          navigate("/");
        }
      } else if (
        location.pathname !== "/register" &&
        location.pathname !== "/login"
      ) {
        logger.info("No users found in db.");
        showNotification({
          title: "No users found in database",
          message: "Redirecting to register...",
        });
        navigate("/register");
      }
    } catch (error) {
      logger.error("Could not find a user in db: ", error);
      navigate("/register");
    }
  };

  useEffect(() => {
    if (isSessionExpired()) {
      clearSession();
      addToStore();
    } else if (id === "" && username === "") {
      addToStore();
    }
  }, [id, username]);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/trip/:tripId" element={<TripPage />} />
        <Route
          path="/trip/:tripId/location/:locationId"
          element={<LocationPage />}
        />
        <Route path="/trip/:tripId/budget" element={<div>Trip Budget</div>} />
        <Route path="/city/:cityId" element={<div>City</div>} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<div>Logout</div>} />
      </Routes>
    </div>
  );
};

export default Pages;
