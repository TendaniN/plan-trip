import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { ButtonSpinner, FormContainer } from "components";
import * as yup from "yup";
import { db } from "stores/db";
import logger from "utils/logger";
import { useAccountStore } from "stores/account";
import { startSession } from "utils/session";

export const RegisterForm = () => {
  const navigate = useNavigate();

  const setState = useAccountStore((state) => state.setState);

  const [submitting, setSubmitting] = useState(false);
  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
        password2: "",
        first_name: "",
        last_name: "",
      },
      onSubmit: (values) => {
        setSubmitting(true);
        createUser({
          username: values.username,
          password: values.password,
          first_name: values.first_name,
          last_name: values.last_name,
          trips: new Array<number>(),
        });
      },
      validationSchema: yup.object().shape({
        username: yup
          .string()
          .min(5, "Username must be at least 6 characters.")
          .required("Required"),
        password: yup
          .string()
          .min(8, "Password must be at least 8 characters.")
          .max(30, "Password must be less than 30 characters.")
          .matches(/[0-9]/, "Password must contain a number.")
          .required("Required"),
        password2: yup
          .string()
          .oneOf([yup.ref("password")], "Passwords must match.")
          .required("Required"),
        first_name: yup
          .string()
          .min(3, "First name must be at least 3 characters.")
          .max(30, "First name must be less than 30 characters.")
          .matches(/^[^\d]*$/, "First name cannot have numbers."),
        last_name: yup
          .string()
          .min(3, "Last name must be at least 3 characters.")
          .max(30, "First name must be less than 30 characters.")
          .matches(/^[^\d]*$/, "Last name cannot have numbers."),
      }),
    });

  const createUser = async (user: {
    username: string;
    password: string;
    first_name?: string;
    last_name?: string;
    trips: number[];
  }) => {
    try {
      const userId = await db.user.add(user);
      setState({ ...user, id: userId }, [], [], []);
      logger.info(`User (${userId}) created.`);
      startSession();
      setSubmitting(false);
      navigate("/");
    } catch (error) {
      logger.error("Failed to create user:" + error);
      setSubmitting(false);
    }
  };

  const submitDisabled =
    values.username === "" || values.password === "" || values.password2 === "";

  return (
    <FormContainer onSubmit={handleSubmit}>
      <div className="input-group">
        <TextField
          fullWidth
          sx={{
            borderRadius: "1rem",
            "& .MuiInputLabel-root": {
              "&.Mui-focused": { marginTop: "-8px" },
            },
          }}
          required
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
          sx={{
            width: "50%",
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
        <TextField
          required
          sx={{
            width: "50%",
            borderRadius: "1rem",
            "& .MuiInputLabel-root": {
              "&.Mui-focused": { marginTop: "-8px" },
            },
          }}
          type="password"
          id="password2"
          name="password2"
          label="Confirm Password"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.password2}
          helperText={
            touched.password2 &&
            errors.password2 !== undefined &&
            errors.password2
          }
          error={touched.password2 && errors.password2 !== undefined}
        />
      </div>
      <div className="input-group">
        <TextField
          sx={{
            width: "50%",
            borderRadius: "1rem",
            "& .MuiInputLabel-root": {
              "&.Mui-focused": { marginTop: "-8px" },
            },
          }}
          id="first_name"
          name="first_name"
          label="First Name"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.first_name}
          helperText={
            touched.first_name &&
            errors.first_name !== undefined &&
            errors.first_name
          }
          error={touched.first_name && errors.first_name !== undefined}
        />
        <TextField
          sx={{
            width: "50%",
            borderRadius: "1rem",
            "& .MuiInputLabel-root": {
              "&.Mui-focused": { marginTop: "-8px" },
            },
          }}
          id="last_name"
          name="last_name"
          label="Last Name"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.last_name}
          helperText={
            touched.last_name &&
            errors.last_name !== undefined &&
            errors.last_name
          }
          error={touched.last_name && errors.last_name !== undefined}
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        disabled={submitDisabled}
        aria-disabled={submitDisabled}
        sx={{
          display: "flex",
          gap: "0.5rem",
          bgcolor: "var(--color-accent-500)",
          color: "#000",
        }}
      >
        {submitting && <ButtonSpinner />}Submit
      </Button>
      <Box sx={{ margin: "0 auto" }}>
        Have have an account? Login <Link to="/login">here</Link>.
      </Box>
    </FormContainer>
  );
};
