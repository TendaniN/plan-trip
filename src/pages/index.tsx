import { Navbar } from "components";
import { api } from "api";
import { useAuthStore, useDBStore } from "db/store";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import logger from "utils/logger";

import RegisterPage from "./register-page";
import LoginPage from "./login-page";
import HomePage from "./home-page";
import TripPage from "./trip-page";
import LocationPage from "./location-page";
import BudgetPage from "./budget-page";
import TripsPage from "./trips-page";
import CountriesPage from "./countries-page";
import AccommodationPage from "./accommodation-page";
import HelpPage from "./help-page";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "api/firebase";
import { Flex, Loader } from "@mantine/core";
import { getUser } from "api/user";
import LogoutPage from "./logout-page";

const Pages = () => {
  const {
    setCurrencyRates,
    setRate,
    setUser: resetUser,
  } = useDBStore((state) => state);
  const { setUser, clear } = useAuthStore((state) => state);
  const [loading, setLoading] = useState(true);

  const setExchangeRates = async () => {
    try {
      const response = await api.get("ZAR");
      if (response.data) {
        setCurrencyRates(response.data.rates);
        setRate(1);
      }
    } catch (error) {
      logger.error("Failed to fetch exchange rate: " + error);
    }
  };

  useEffect(() => {
    setExchangeRates();
  }, []);

  const authUser = async (uid: string) => {
    try {
      const user = await getUser(uid);
      if (user) {
        resetUser({
          uid: user.uid,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          trips: user.trips,
        });
      }
    } catch (error) {
      logger.error("Failed to reset user: " + error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
        });
        authUser(firebaseUser.uid);
      } else {
        clear();
      }

      setLoading(false);
    });

    return unsubscribe;
  }, [clear, setUser]);

  if (loading) {
    return (
      <Flex w="100%" h="100%">
        <Loader mx="auto" my="auto" size="5rem" color="primary.6" />
      </Flex>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/trip" element={<TripsPage />} />
        <Route path="/trip/:tripId" element={<TripPage />} />
        <Route
          path="/trip/:tripId/location/:locationId"
          element={<LocationPage />}
        />
        <Route path="/trip/:tripId/budget" element={<BudgetPage />} />
        <Route path="/profile" element={<div>Profile</div>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/country" element={<CountriesPage />} />
        <Route
          path="/country/:city/accommodation"
          element={<AccommodationPage />}
        />
        <Route path="/help" element={<HelpPage />} />
      </Routes>
    </div>
  );
};

export default Pages;
