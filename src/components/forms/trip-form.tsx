import { useState, useId } from "react";
import { useNavigate } from "react-router-dom";
import { isNotEmpty, useForm } from "@mantine/form";
import { Flex, TextInput, LoadingOverlay, Loader, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";

import { db } from "db";
import { useDBStore } from "db/store";

import logger from "utils/logger";
import { Button } from "components";
import dayjs from "dayjs";
import { CITY_MAP, type CityValues } from "constants/city";
import { calcDaysBetween } from "utils/calc-days-between";
import type { CountryValues } from "constants/country";
import { showNotification } from "@mantine/notifications";
import { FaCheck, FaX } from "react-icons/fa6";
import type { DexieError } from "dexie";

export const TripForm = () => {
  const navigate = useNavigate();

  const [creating, setCreating] = useState(false);

  const { uid, addTrip, addLocation, addBudget } = useDBStore((state) => state);

  const { values, getInputProps, onSubmit } = useForm({
    initialValues: {
      start_date: "",
      end_date: "",
      cityValue: "",
      trip_name: "",
    },
    onSubmitPreventDefault: "always",
    validate: {
      start_date: isNotEmpty("Required."),
      end_date: isNotEmpty("Required."),
      cityValue: isNotEmpty("Required."),
    },
  });

  const tripId = useId();
  const locationId = useId();
  const budgetId = useId();

  const createTrip = async (
    start: string,
    end: string,
    city: CityValues,
    country: CountryValues,
    trip_name: string,
  ) => {
    const name = trip_name ? trip_name : `${city} ${start.substring(0, 4)}`;

    try {
      if (uid) {
        const trip = {
          id: tripId,
          userId: uid,
          name,
          start_date: start,
          end_date: end,
          locations: [locationId],
          travels: [],
          budgets: [],
        };
        const location = {
          id: locationId,
          tripId,
          city,
          country,
          start_date: start,
          end_date: end,
          nights: calcDaysBetween(start, end),
          itinerary: [],
        };
        const budget = {
          id: budgetId,
          tripId,
          travel: [],
          buffer: 0,
        };

        await db.trips.add(trip);
        await db.locations.add(location);
        await db.budgets.add(budget);
        addTrip(trip);
        addLocation(location);
        addBudget(budget);
      }

      logger.info(
        `Location (${locationId}), Budget (${budgetId}) added to Trip (${tripId}).`,
      );
      showNotification({
        title: "New trip and location created.",
        message: "Redirecting to your trip now...",
        color: "green.7",
        icon: <FaCheck />,
      });
      setCreating(false);
      navigate(`/trip/${tripId}`);
    } catch (error) {
      logger.error("Failed to update:" + error);
      setCreating(false);
      showNotification({
        title: "Something Went Wrong",
        message: (error as DexieError).message,
        color: "red",
        icon: <FaX />,
      });
    }
  };

  const handleSubmit = (vals: typeof values) => {
    setCreating(true);
    const country = CITY_MAP.find(
      ({ cities }) => cities.filter((val) => val === vals.cityValue).length > 0,
    );
    if (country) {
      createTrip(
        vals.start_date,
        vals.end_date,
        vals.cityValue as CityValues,
        country.country as CountryValues,
        vals.trip_name,
      );
    }
  };

  const formDisabled =
    values.cityValue === "" ||
    values.start_date === "" ||
    values.end_date === "" ||
    creating;

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Flex direction="column" gap={18}>
        <LoadingOverlay
          visible={creating}
          loaderProps={{ children: <Loader color="blue.5" type="dots" /> }}
        />
        <Flex>
          <Select
            w="100%"
            radius="md"
            description="Select the main city for your trip. Cities are grouped by country."
            classNames={{
              groupLabel: "group-label",
              option: "group-option",
            }}
            required
            label="City"
            placeholder="Select a city you want to travel to..."
            value={values.cityValue}
            data={CITY_MAP.map(({ country, cities }) => {
              return { group: country, items: cities };
            })}
            {...getInputProps("cityValue")}
          />
        </Flex>
        <Flex gap={8}>
          <DateInput
            w="50%"
            radius="md"
            required
            valueFormat="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            minDate={dayjs().format("YYYY-MM-DD")}
            label="Start Date"
            value={dayjs(values.start_date).format("YYYY-MM-DD")}
            {...getInputProps("start_date")}
          />
          <DateInput
            w="50%"
            radius="md"
            required
            valueFormat="YYYY-MM-DD"
            placeholder="YYYY-MM-DD"
            minDate={
              values.start_date
                ? dayjs(values.start_date).format("YYYY-MM-DD")
                : dayjs().format("YYYY-MM-DD")
            }
            label="End Date"
            value={dayjs(values.end_date).format("YYYY-MM-DD")}
            {...getInputProps("end_date")}
          />
        </Flex>
        <Flex>
          <TextInput
            {...getInputProps("trip_name")}
            w="100%"
            radius="md"
            value={values.trip_name}
            required
            label="Trip Name"
            placeholder={
              values.cityValue && values.start_date
                ? `${values.cityValue} ${values.start_date.substring(0, 4)}`
                : "Tokyo 2026"
            }
          />
        </Flex>
        <Button
          type="submit"
          color="secondary.2"
          w="100%"
          disabled={formDisabled}
        >
          Create
        </Button>
      </Flex>
    </form>
  );
};
