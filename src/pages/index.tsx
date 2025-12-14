import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import HomePage from "./home";
import { useEffect, useState } from "react";

import RegisterPage from "./register";
import LoginPage from "./login";
import { Navbar, PageSpinner } from "components";
import { useAccountStore } from "stores/account";
import TripsPage from "./trips";
import { clearSession, isSessionExpired } from "utils/session";
import { db } from "stores/db";
import logger from "utils/logger";

const Pages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser, id, username } = useAccountStore((state) => state);

  const [siteLoading, setSiteLoading] = useState(true);

  const addToStore = async () => {
    try {
      const users = await db.user.toArray();
      if (users.length > 0) {
        setUser(users[0]);
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
        logger.info("Session expired.");
        navigate("/login");
        setSiteLoading(false);
      }
    } catch (error) {
      logger.error("Could not find user in db: ", error);
      navigate("/register");
      setSiteLoading(false);
    }
  };

  useEffect(() => {
    if (isSessionExpired()) {
      clearSession();
      setSiteLoading(false);
    } else if (id === 0 && username === "") {
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
