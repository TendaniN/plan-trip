import { Loader } from "@mantine/core";
import { db } from "db";
import { useDBStore } from "db/store";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logger from "utils/logger";

import { clearSession, isSessionExpired } from "utils/session";

const Pages = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setState, id, username } = useDBStore((state) => state);

  const [siteLoading, setSiteLoading] = useState(true);

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
    if (isSessionExpired() || (id === "" && username === "")) {
      if (isSessionExpired()) clearSession();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      addToStore();
    }
  }, [id, username]);

  return siteLoading ? <Loader color="primary-5" size="xl" /> : <div></div>;
};

export default Pages;
