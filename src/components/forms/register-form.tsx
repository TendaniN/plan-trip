import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm, matchesField } from "@mantine/form";
import { Flex, TextInput, LoadingOverlay, Loader } from "@mantine/core";

import { useAuthStore, useDBStore } from "db/store";

import logger from "utils/logger";
import { Button } from "components";
import { showNotification } from "@mantine/notifications";
import { registerUser } from "api/auth";
import { getUser } from "api/user";

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
  const setUser = useAuthStore((state) => state.setUser);

  const [submitting, setSubmitting] = useState(false);

  const { values, getInputProps, onSubmit } = useForm({
    initialValues: {
      email: "",
      password: "",
      password2: "",
      firstName: "",
      lastName: "",
    },
    onSubmitPreventDefault: "always",
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
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
      firstName: (value) => nameValidation(value),
      lastName: (value) => nameValidation(value),
    },
  });

  const createUser = async ({
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    try {
      const newUser = await registerUser(email, password, firstName, lastName);
      const user = await getUser(newUser.uid);
      setUser(newUser);
      setState(user, [], [], [], [], []);

      logger.info(`User (${newUser}) created.`);
      showNotification({
        message: "Registration successful",
        color: "green.7",
      });
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
      email: vals.email,
      password: vals.password,
      firstName: vals.firstName,
      lastName: vals.lastName,
    });
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
            {...getInputProps("firstName")}
            radius="md"
            value={values.firstName}
            required
            placeholder="Jane"
            label="First Name"
          />
          <TextInput
            w="50%"
            {...getInputProps("lastName")}
            radius="md"
            value={values.lastName}
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
      </Flex>
    </form>
  );
};
