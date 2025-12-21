import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./home-page";
import { useEffect, useState } from "react";

import RegisterPage from "./register-page";
import LoginPage from "./login-page";
import { Navbar, PageSpinner } from "components";
import { useAccountStore } from "stores/account";
import TripsPage from "./trips-page";
import { clearSession, isSessionExpired } from "utils/session";
import { db } from "stores/db";
import logger from "utils/logger";

const Pages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setState, id, username } = useAccountStore((state) => state);

  const [siteLoading, setSiteLoading] = useState(true);

  const addToStore = async () => {
    try {
      const users = await db.user.toArray();
      const trips = await db.trips.toArray();
      const locations = await db.locations.toArray();
      const itinerarys = await db.itinerarys.toArray();

      if (users.length > 0) {
        setState(
          users[0],
          trips.filter(({ userId }) => userId === users[0].id),
          locations,
          itinerarys
        );
        logger.info("Restoring session...");
        if (
          location.pathname === "/register" ||
          location.pathname === "/login"
        ) {
          navigate("/");
        }

        setSiteLoading(false);
      } else if (
        location.pathname !== "/register" &&
        location.pathname !== "/login"
      ) {
        logger.info("No users found in db.");
        navigate("/register");
        setSiteLoading(false);
      }
    } catch (error) {
      logger.error("Could not find a user in db: ", error);
      navigate("/register");
      setSiteLoading(false);
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

  return siteLoading ? (
    <PageSpinner />
  ) : (
    <>
      <Navbar />
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/trip" element={<TripsPage />}>
          <Route path="/trip/:trip_id" element={<div>Trip</div>}>
            <Route
              path="/trip/:trip_id/:location_id"
              element={<div>Location</div>}
            />
          </Route>
        </Route>
        <Route path="/city/:city_id" element={<div>City</div>} />
        <Route path="/account" element={<div>Account</div>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
};

export default Pages;
