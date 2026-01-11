import { Box, Flex, Select, LoadingOverlay, Loader } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { DateInput, type DateInputProps } from "@mantine/dates";
import dayjs from "dayjs";
import { Button } from "components";
import { CITY_MAP, type CityValues } from "constants/city";
import type { HotelProps } from "types/hotel";
import { FaCheck, FaX } from "react-icons/fa6";
import { ALL_HOTELS } from "constants/hotels";
import { useMemo, useState, useId } from "react";
import type { Trip } from "types/db";
import { calcDaysBetween } from "utils/calc-days-between";
import type { CountryValues } from "constants/country";

import { db } from "db";
import { useDBStore } from "db/store";
import logger from "utils/logger";
import { DEFAULT_DATE_FORMAT } from "constants/db";
import { showNotification } from "@mantine/notifications";
import type { DexieError } from "dexie";

const dateParser: DateInputProps["dateParser"] = (input) => {
  if (input === "WW2") {
    return "1939-09-01";
  }

  return dayjs(input, "YYYY-MM-DD").format("YYYY-MM-DD");
};

interface Props {
  trip: Trip;
  close: () => void;
}

export const LocationForm = ({ trip, close }: Props) => {
  const [creating, setCreating] = useState(false);

  const locationId = useId();

  const { updateTrip, addLocation } = useDBStore((state) => state);

  const { values, getInputProps, onSubmit, reset } = useForm({
    initialValues: {
      city: "",
      start_date: "",
      end_date: "",
      accommodation: "",
    },
    onSubmitPreventDefault: "always",
    validate: {
      start_date: isNotEmpty("Required."),
      end_date: isNotEmpty("Required."),
      city: isNotEmpty("Required."),
    },
  });

  const filteredAccommodations = useMemo(() => {
    if (values.city !== "") {
      const hotels = ALL_HOTELS.find(({ type }) => type === values.city);
      if (hotels) {
        return hotels.hotels;
      }
      return [];
    }
    return [];
  }, [values.city]);

  const createLocation = async (
    city: CityValues,
    country: CountryValues,
    start: string,
    end: string,
    accommodation?: HotelProps
  ) => {
    const location = {
      id: locationId,
      tripId: trip.id,
      city,
      country,
      start_date: start,
      end_date: end,
      nights: calcDaysBetween(start, end),
      accommodation,
      itinerary: [],
    };
    try {
      let start_date = trip.start_date;
      if (dayjs(start).isBefore(dayjs(start_date))) {
        start_date = dayjs(start, DEFAULT_DATE_FORMAT).format(
          DEFAULT_DATE_FORMAT
        );
      }
      let end_date = trip.end_date;
      if (dayjs(end).isAfter(dayjs(end_date))) {
        end_date = dayjs(end, DEFAULT_DATE_FORMAT).format(DEFAULT_DATE_FORMAT);
      }
      await db.trips.update(trip.id, {
        start_date: start_date,
        end_date: end_date,
        locations: [...trip.locations, locationId],
      });
      await db.locations.add(location);
      addLocation(location);
      updateTrip(trip.id, { locations: [...trip.locations, locationId] });

      logger.info(`Location (${locationId}) added to Trip (${trip.id}).`);
      showNotification({
        message: `Location - ${city} - was added.`,
        color: "green.7",
        icon: <FaCheck />,
      });
      setCreating(false);
      handleClose();
    } catch (error) {
      logger.error("Failed to add location:" + error);
      showNotification({
        title: "Something Went Wrong",
        message: (error as DexieError).message,
        color: "red",
        icon: <FaX />,
      });
      setCreating(false);
    }
  };

  const handleSubmit = (vals: typeof values) => {
    setCreating(true);
    const country = CITY_MAP.find(
      ({ cities }) => cities.filter((val) => val === vals.city).length > 0
    );

    const hotel = vals.accommodation
      ? filteredAccommodations.find(({ name }) => name === vals.accommodation)
      : undefined;

    if (country) {
      createLocation(
        vals.city as CityValues,
        country.country as CountryValues,
        vals.start_date,
        vals.end_date,
        hotel
      );
    }
  };

  const handleClose = () => {
    reset();
    close();
  };

  const formDisabled =
    values.city === "" ||
    values.start_date === "" ||
    values.end_date === "" ||
    creating;

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Box
        display="flex"
        style={{
          flexDirection: "column",
          gap: 18,
        }}
      >
        <LoadingOverlay
          visible={creating}
          loaderProps={{
            children: <Loader color="blue.5" type="dots" />,
          }}
        />
        <Flex>
          <Select
            w="100%"
            radius="md"
            required
            label="City"
            placeholder="Select a city you want to travel to..."
            value={values.city}
            data={CITY_MAP.map(({ country, cities }) => {
              return { group: country, items: cities };
            })}
            {...getInputProps("city")}
          />
        </Flex>
        <Flex gap={8}>
          <DateInput
            w="50%"
            radius="md"
            required
            valueFormat={DEFAULT_DATE_FORMAT}
            placeholder={DEFAULT_DATE_FORMAT}
            dateParser={dateParser}
            minDate={dayjs().format("YYYY-MM-DD")}
            label="Start Date"
            value={dayjs(values.start_date).format("YYYY-MM-DD")}
            {...getInputProps("start_date")}
          />
          <DateInput
            w="50%"
            radius="md"
            required
            valueFormat={DEFAULT_DATE_FORMAT}
            placeholder={DEFAULT_DATE_FORMAT}
            dateParser={dateParser}
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
          <Select
            w="100%"
            radius="md"
            label="Accommodation"
            placeholder="Select a place to stay"
            value={values.accommodation}
            disabled={values.city === ""}
            data={filteredAccommodations.map(({ name }) => name)}
            {...getInputProps("accommodation")}
          />
        </Flex>
        <Button type="submit" color="purple.3" w="100%" disabled={formDisabled}>
          Add Location
        </Button>
      </Box>
    </form>
  );
};
