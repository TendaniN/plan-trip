import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ButtonSpinner } from "components/button-spinner";
import * as yup from "yup";
import { Form } from "../containers/form-container";
import { db } from "stores/db";
import logger from "utils/logger";
import { useAccountStore } from "stores/account";

export const LoginForm = () => {
  const setUser = useAccountStore((state) => state.setUser);

  const [submitting, setSubmitting] = useState(false);
  const {
    handleBlur,
    handleChange,
    handleSubmit,
    values,
    errors,
    touched,
    dirty,
  } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: (values) => {
      setSubmitting(true);
      findUser(values.username, values.password);
    },
    validationSchema: yup.object().shape({
      username: yup
        .string()
        .min(5, "Username must be at least 6 characters.")
        .required("Required"),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters.")
        .required("Required"),
    }),
  });

  const findUser = async (username: string, password: string) => {
    try {
      const user = await db.user.get([username, password]);
      if (user) {
        setUser(user);
        logger.info(`User (${user.username}) logged in.`);
      }
      setSubmitting(false);
    } catch (error) {
      logger.error("Failed to create user:" + error);
      setSubmitting(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="input-group">
        <TextField
          required
          fullWidth
          sx={{
            borderRadius: "1rem",
            "& .MuiInputLabel-root": {
              "&.Mui-focused": { marginTop: "-8px" },
            },
          }}
          id="username"
          name="username"
          label="Username"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.username}
          helperText={
            touched.username && errors.username !== undefined && errors.username
          }
          error={touched.username && errors.username !== undefined}
        />
      </div>
      <div className="input-group">
        <TextField
          required
          fullWidth
          sx={{
            borderRadius: "1rem",
            "& .MuiInputLabel-root": {
              "&.Mui-focused": { marginTop: "-8px" },
            },
          }}
          id="password"
          type="password"
          name="password"
          label="Password"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password}
          helperText={
            touched.password && errors.password !== undefined && errors.password
          }
          error={touched.password && errors.password !== undefined}
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        disabled={dirty}
        aria-disabled={dirty}
        sx={{
          display: "flex",
          gap: "0.5rem",
          bgcolor: "var(--color-accent-500)",
          color: "#000",
          borderRadius: "1rem",
        }}
      >
        {submitting && <ButtonSpinner />}Submit
      </Button>
      Don't have an account? Register <Link to="/register">here</Link>.
    </Form>
  );
};
