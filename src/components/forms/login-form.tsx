import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm, isNotEmpty } from "@mantine/form";
import { Flex, TextInput, LoadingOverlay, Loader, Box } from "@mantine/core";

import { db } from "db";
import { useDBStore } from "db/store";

import { startSession } from "utils/session";
import logger from "utils/logger";
import { Button } from "components";
import { showNotification } from "@mantine/notifications";

export const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { setState, trips } = useDBStore((state) => state);

  const [submitting, setSubmitting] = useState(false);

  const { values, getInputProps, onSubmit } = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmitPreventDefault: "always",
    validate: {
      username: isNotEmpty("Required."),
      password: isNotEmpty("Required."),
    },
  });

  const findUser = async (username: string, password: string) => {
    try {
      const user = await db.user
        .where("username")
        .equals(username)
        .and((user) => user.password === password)
        .first();
      if (user) {
        const locations = await db.locations.toArray();
        const itinerary = await db.itinerary.toArray();
        const budgets = await db.budgets.toArray();
        const travels = await db.travels.toArray();

        setState(
          user,
          trips.filter((trip) => trip.userId === user.id),
          locations,
          itinerary,
          budgets,
          travels
        );
        startSession();
        logger.info(`User (${user.username}) logged in.`);
        showNotification({ message: "Login successful", color: "green.7" });

        const from = location.state?.from ?? "/";
        navigate(from);
      }
      setSubmitting(false);
    } catch (error) {
      logger.error("Failed to create user:" + error);
      setSubmitting(false);
    }
  };
  const handleSubmit = (vals: typeof values) => {
    setSubmitting(true);
    findUser(vals.username, vals.password);
  };

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Box
        bdrs={12}
        bd="6px solid #000"
        p={20}
        display="flex"
        style={{
          flexDirection: "column",
          gap: 18,
          backgroundColor: "var(--mantine-color-primary-3)",
        }}
      >
        <LoadingOverlay
          visible={submitting}
          loaderProps={{ children: <Loader color="blue.5" type="dots" /> }}
        />
        <Flex>
          <TextInput
            {...getInputProps("username")}
            w="100%"
            radius="md"
            value={values.username}
            required
            label="Username"
            placeholder="janeDoe"
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
      </Box>
    </form>
  );
};
