import { useFormik } from "formik";
import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ButtonSpinner, FormContainer } from "components";
import * as yup from "yup";
import { db } from "stores/db";
import logger from "utils/logger";
import { useAccountStore } from "stores/account";

export const LoginForm = () => {
  const navigate = useNavigate();

  const setUser = useAccountStore((state) => state.setUser);

  const [submitting, setSubmitting] = useState(false);
  const { handleBlur, handleChange, handleSubmit, values, errors, touched } =
    useFormik({
      initialValues: {
        username: "",
        password: "",
      },
      onSubmit: (values) => {
        setSubmitting(true);
        findUser(values.username, values.password);
      },
      validationSchema: yup.object().shape({
        username: yup.string().required("Required"),
        password: yup.string().required("Required"),
      }),
    });

  const findUser = async (username: string, password: string) => {
    try {
      const user = await db.user
        .where("username")
        .equals(username)
        .and((user) => user.password === password)
        .first();
      if (user) {
        setUser(user);
        logger.info(`User (${user.username}) logged in.`);
        navigate("/");
      }
      setSubmitting(false);
    } catch (error) {
      logger.error("Failed to create user:" + error);
      setSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
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
        disabled={values.password === "" || values.username === ""}
        aria-disabled={values.password === "" || values.username === ""}
        sx={{
          display: "flex",
          gap: "0.5rem",
          bgcolor: "var(--color-accent-500)",
          color: "#000",
        }}
      >
        {submitting && <ButtonSpinner />}Submit
      </Button>
      <div>
        Don't have an account? Register <Link to="/register">here</Link>.
      </div>
    </FormContainer>
  );
};
