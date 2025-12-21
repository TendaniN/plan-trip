import styled from "@emotion/styled";
import { Typography, Autocomplete, TextField, Button } from "@mui/material";
import moment, { type Moment } from "moment";
import { CITIES_MAP } from "constants/cities";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { type DateValidationError } from "@mui/x-date-pickers/models";
import { useState, useId } from "react";
import { FaSpinner } from "react-icons/fa6";
import { CityListContainer, PageContainer } from "components";
import { useNavigate } from "react-router-dom";

import logger from "utils/logger";
import { calcDaysBetween } from "utils/calc-days-between";
import type { CityValues } from "types/cities";
import type { CountryValues } from "types/countries";
import { useFormik } from "formik";
import { db } from "stores/db";
import { useAccountStore } from "stores/account";

const SearchContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  border-radius: 1.5rem;
  border: 0.25rem solid #000;
  background-color: var(--color-tertiary-500);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  fieldset {
    border-radius: 1rem;
  }

  @media (max-width: 48rem) {
    padding: 1rem;
  }
`;

const DateContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 40rem) {
    flex-direction: column;

    .datepicker {
      width: 100%;
    }
  }
`;

const Spinner = styled(FaSpinner)`
  animation: spin 1.5s linear infinite;
  margin: auto 0;
  width: 1rem;
  height: 1rem;

  @keyframes spin {
    0% {
      transform: rotate(0deg); /* Start at 0 degrees rotation */
    }
    100% {
      transform: rotate(360deg); /* Rotate 360 degrees */
    }
  }
`;

const HomePage = () => {
  const navigate = useNavigate();

  const { id, addTrip, addLocation } = useAccountStore((state) => state);

  const [searching, setSearching] = useState(false);
  const tripId = useId();
  const locationId = useId();

  const {
    handleChange,
    handleBlur,
    handleSubmit,
    values,
    touched,
    errors,
    setFieldValue,
    setFieldError,
  } = useFormik({
    initialValues: {
      start_date: null as Moment | null,
      end_date: null as Moment | null,
      cityValue: null as {
        id: string;
        label: string;
        country: string;
      } | null,
      trip_name: "",
    },
    onSubmit: (values) => {
      setSearching(true);
      if (values.cityValue && values.start_date && values.end_date) {
        handleDBUpdate(
          values.start_date,
          values.end_date,
          values.cityValue.id as CityValues,
          values.cityValue.country as CountryValues,
          values.trip_name
        );
      } else {
        logger.error("Missing Inputs.");
        setSearching(false);
      }
    },
  });

  const formDisabled =
    !values.cityValue || !values.start_date || !values.end_date || searching;

  const handleDBUpdate = async (
    start: Moment,
    end: Moment,
    city: CityValues,
    country: CountryValues,
    trip_name?: string
  ) => {
    const name = trip_name ? trip_name : `${city} ${start.format("YYYY")}`;
    const trip = {
      id: tripId,
      userId: id,
      name,
      start_date: start.format("YYYY-MM-DD"),
      end_date: end.format("YYYY-MM-DD"),
      locations: [locationId],
    };
    const location = {
      id: locationId,
      tripId,
      city,
      country,
      start_date: start.format("YYYY-MM-DD"),
      end_date: end.format("YYYY-MM-DD"),
      num_of_nights: calcDaysBetween(start, end),
      itinerary_activites: new Array<string>(),
    };
    try {
      await db.trips.add(trip);
      await db.locations.add(location);
      addTrip(trip);
      addLocation(location);
      logger.info(`Location (${locationId}) added to Trip (${tripId}).`);
      setSearching(false);
      navigate(`/trip`);
    } catch (error) {
      logger.error("Failed to update:" + error);
      setSearching(false);
    }
  };

  const getErrorMessage = (error: DateValidationError) => {
    switch (error) {
      case "maxDate":
      case "minDate": {
        return "Please select a date in the first quarter of 2022";
      }
      case "invalidDate": {
        return "Your date is not valid";
      }
      default:
        return "";
    }
  };

  return (
    <PageContainer>
      <Typography
        align="center"
        variant="h2"
        sx={{ fontFamily: '"Chango", system-ui' }}
      >
        Where are you headed?
      </Typography>
      <form onSubmit={handleSubmit}>
        <SearchContainer>
          <Autocomplete
            id="cityValue"
            options={CITIES_MAP}
            groupBy={(option) => option.country}
            openOnFocus
            fullWidth
            sx={{
              bgcolor: "#fff",
              borderRadius: "1rem",
              "& .MuiInputLabel-root": {
                "&.Mui-focused": { marginTop: "-8px" },
              },
            }}
            value={values.cityValue}
            onChange={(_event, newValue) =>
              setFieldValue("cityValue", newValue)
            }
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Select a city..."
                helperText={
                  touched.cityValue &&
                  errors.cityValue !== undefined &&
                  errors.cityValue
                }
                error={touched.cityValue && errors.cityValue !== undefined}
              />
            )}
          />
          <DateContainer>
            <DatePicker
              name="start_date"
              className="datepicker"
              value={values.start_date}
              minDate={moment()}
              label="Start Date"
              onChange={(value) =>
                setFieldValue("start_date", value ? value : null)
              }
              disablePast
              sx={{
                bgcolor: "#fff",
                borderRadius: "1rem",
                width: "48%",
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": { marginTop: "-8px" },
                },
              }}
              slotProps={{
                textField: {
                  error: touched.start_date && errors.start_date !== undefined,
                  required: true,
                  helperText:
                    touched.start_date &&
                    errors.start_date !== undefined &&
                    errors.start_date,
                },
              }}
              onError={(newError) =>
                setFieldError("start_date", getErrorMessage(newError))
              }
            />
            <div style={{ margin: "auto" }}>to</div>
            <DatePicker
              name="end_date"
              className="datepicker"
              value={values.end_date}
              disablePast
              label="End Date"
              minDate={values.start_date ? values.start_date : moment()}
              onChange={(value) =>
                setFieldValue("end_date", value ? value : null)
              }
              slotProps={{
                textField: {
                  error: touched.end_date && errors.end_date !== undefined,
                  required: true,
                  helperText:
                    touched.end_date &&
                    errors.end_date !== undefined &&
                    errors.end_date,
                },
              }}
              sx={{
                bgcolor: "#fff",
                borderRadius: "1rem",
                width: "48%",
                "& .MuiInputLabel-root": {
                  "&.Mui-focused": { marginTop: "-8px" },
                },
              }}
              onError={(newError) =>
                setFieldError("end_date", getErrorMessage(newError))
              }
            />
          </DateContainer>
          <TextField
            fullWidth
            sx={{
              bgcolor: "#fff",
              borderRadius: "1rem",
              "& .MuiInputLabel-root": {
                "&.Mui-focused": { marginTop: "-8px" },
              },
            }}
            id="trip_name"
            name="trip_name"
            label="Trip Name"
            placeholder={
              values.cityValue && values.start_date
                ? `${values.cityValue.label} ${values.start_date.format(
                    "YYYY"
                  )}`
                : "Tokyo 2026"
            }
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.trip_name}
            helperText={
              touched.trip_name &&
              errors.trip_name !== undefined &&
              errors.trip_name
            }
            error={touched.trip_name && errors.trip_name !== undefined}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={formDisabled}
            aria-disabled={formDisabled}
            sx={{
              display: "flex",
              gap: "0.5rem",
              bgcolor: "var(--color-accent-500)",
              color: "#000",
            }}
          >
            {searching && <Spinner />}Submit
          </Button>
        </SearchContainer>
      </form>
      <Typography align="center" variant="h4">
        OR
      </Typography>
      <Typography
        align="center"
        variant="h2"
        sx={{ fontFamily: '"Chango", system-ui' }}
      >
        Pick a city to explore
      </Typography>
      <CityListContainer />
    </PageContainer>
  );
};

export default HomePage;
