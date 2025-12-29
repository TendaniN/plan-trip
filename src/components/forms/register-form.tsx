import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, hasLength, matchesField } from "@mantine/form";
import { Flex, TextInput, LoadingOverlay, Loader, Box } from "@mantine/core";

import { db } from "db";
import { useDBStore } from "db/store";

import { startSession } from "utils/session";
import logger from "utils/logger";
import { Button } from "components";

const hasNumber = (value: string) => /\d/.test(value);
const hasNoNumbers = (value: string) => !/\d/.test(value);

const nameValidation = (value: string) => {
  if (value.length < 3) {
    return "Must be at least 3 characters.";
  }
  if (value.length > 30) {
    return "Must be less than 30 characters.";
  }
  if (!hasNoNumbers(value)) {
    return "Cannot have numbers.";
  }
  return null;
};

export const RegisterForm = () => {
  const navigate = useNavigate();

  const setState = useDBStore((state) => state.setState);

  const [submitting, setSubmitting] = useState(false);

  const { values, getInputProps, onSubmit } = useForm({
    initialValues: {
      username: "",
      password: "",
      password2: "",
      first_name: "",
      last_name: "",
    },
    onSubmitPreventDefault: "always",
    validate: {
      username: hasLength(
        { min: 5 },
        "Username must be at least 6 characters."
      ),
      password: (value) => {
        if (value.length < 8) {
          return "Password must be at least 8 characters.";
        }
        if (value.length > 30) {
          return "Password must be less than 30 characters.";
        }
        if (!hasNumber(value)) {
          return "Password must contain a number.";
        }
        return null;
      },
      password2: matchesField("password", "Passwords must match."),
      first_name: (value) => nameValidation(value),
      last_name: (value) => nameValidation(value),
    },
  });

  const createUser = async (user: {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    trips: string[];
  }) => {
    try {
      const userId = await db.user.add(user);
      setState({ ...user, id: userId }, [], [], [], [], []);
      logger.info(`User (${userId}) created.`);
      startSession();
      setSubmitting(false);
      navigate("/");
    } catch (error) {
      logger.error("Failed to create user:" + error);
      setSubmitting(false);
    }
  };

  const handleSubmit = (vals: typeof values) => {
    setSubmitting(true);
    createUser({
      username: vals.username,
      password: vals.password,
      first_name: vals.first_name,
      last_name: vals.last_name,
      trips: new Array<string>(),
    });
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
        <Flex gap={10}>
          <TextInput
            type="password"
            w="50%"
            {...getInputProps("password")}
            radius="md"
            value={values.password}
            required
            label="Password"
          />
          <TextInput
            type="password"
            w="50%"
            {...getInputProps("password2")}
            radius="md"
            value={values.password2}
            required
            label="Confirm Password"
          />
        </Flex>
        <Flex gap={10}>
          <TextInput
            w="50%"
            {...getInputProps("first_name")}
            radius="md"
            value={values.first_name}
            required
            placeholder="Jane"
            label="First Name"
          />
          <TextInput
            w="50%"
            {...getInputProps("last_name")}
            radius="md"
            value={values.last_name}
            required
            placeholder="Doe"
            label="Last Name"
          />
        </Flex>
        <Button type="submit" color="green.4" w="100%">
          Register
        </Button>
        <Flex justify="center">
          Already have an account? Login{" "}
          <Link to="/register" style={{ marginLeft: 4 }}>
            here
          </Link>
          .
        </Flex>
      </Box>
    </form>
  );
};
