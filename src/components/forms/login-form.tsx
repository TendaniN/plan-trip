import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, isNotEmpty } from "@mantine/form";
import { Flex, TextInput, LoadingOverlay, Loader } from "@mantine/core";

import { useAuthStore, useDBStore } from "db/store";

import logger from "utils/logger";
import { Button } from "components";
import { showNotification } from "@mantine/notifications";
import { loginUser } from "api/auth";
import { getBudgets, getTrips } from "api/trip";
import { getLocations, getItineraryActivities } from "api/location";

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setState } = useDBStore((state) => state);
  const setUser = useAuthStore((state) => state.setUser);

  const [submitting, setSubmitting] = useState(false);

  const { values, getInputProps, onSubmit } = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmitPreventDefault: "always",
    validate: {
      email: isNotEmpty("Required."),
      password: isNotEmpty("Required."),
    },
  });

  const findUser = async (email: string, password: string) => {
    try {
      const user = await loginUser(email, password);
      if (user) {
        setUser(user.authUser);
        const trips = await getTrips(user.userDoc.uid);
        const locations = await getLocations();
        const itinerary = await getItineraryActivities();
        const budgets = await getBudgets();

        setState(user.userDoc, trips, locations, itinerary, budgets);
        logger.info(`User (${user.authUser.email}) logged in.`);
        showNotification({ message: "Login successful", color: "green.7" });

        const from = location.state?.from ?? "/";
        navigate(from);
      }
      setSubmitting(false);
    } catch (error) {
      logger.error("Error logging in", error);
      setSubmitting(false);
      showNotification({
        color: "red",
        message: "Login failed. Please try again.",
      });
    }
  };
  const handleSubmit = (vals: typeof values) => {
    setSubmitting(true);
    findUser(vals.email, vals.password);
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Flex
        direction="column"
        gap={18}
        bdrs={12}
        bd="6px solid #000"
        p={20}
        bg="primary.3"
      >
        <LoadingOverlay
          visible={submitting}
          loaderProps={{ children: <Loader color="blue.5" type="dots" /> }}
        />
        <Flex>
          <TextInput
            {...getInputProps("email")}
            w="100%"
            radius="md"
            value={values.email}
            required
            label="Email"
            placeholder="jane.doe@example.com"
          />
        </Flex>
        <Flex>
          <TextInput
            type="password"
            w="100%"
            {...getInputProps("password")}
            radius="md"
            value={values.password}
            required
            label="Password"
          />
        </Flex>
        <Button type="submit" color="green.4" w="100%">
          Login
        </Button>
        <Flex justify="center">
          Don't have an account? Register{" "}
          <Link to="/register" style={{ marginLeft: 4 }}>
            here
          </Link>
          .
        </Flex>
      </Flex>
    </form>
  );
};
