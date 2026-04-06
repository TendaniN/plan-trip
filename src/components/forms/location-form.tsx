import { Flex, Select, LoadingOverlay, Loader } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { DateInput } from "@mantine/dates";
import dayjs from "dayjs";
import { Button } from "components";
import { CITY_MAP, type CityValues } from "constants/city";
import { FaCheck, FaX } from "react-icons/fa6";
import { useState, useEffect } from "react";
import type { Trip, Hotel } from "types";
import type { CountryValues } from "constants/country";

import logger from "utils/logger";
import { DEFAULT_DATE_FORMAT } from "constants/db";
import { showNotification } from "@mantine/notifications";
import type { FirestoreError } from "firebase/firestore";
import { createLocation } from "api/location";
import { searchHotels } from "api/hotel";

interface Props {
  trip: Trip;
  close: () => void;
}

export const LocationForm = ({ trip, close }: Props) => {
  const [creating, setCreating] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [hotelOptions, setHotelOptions] = useState<
    { value: string; label: string; hotel: Hotel }[]
  >([]);
  const [searchValue, setSearchValue] = useState("");

  const { values, getInputProps, onSubmit, reset, setFieldValue } = useForm<{
    city: CityValues | "";
    start_date: string;
    end_date: string;
    accommodation: string;
  }>({
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

  const loadHotels = async (search?: string) => {
    if (!values.city) return;

    setLoadingHotels(true);

    try {
      const { combined } = await searchHotels(values.city, search);

      setHotelOptions(
        combined.map((hotel) => ({
          value: hotel.placeId,
          label: `${hotel.name} (${hotel.rating ?? "-"}⭐)`,
          hotel,
        })),
      );
    } catch (err) {
      logger.error("Failed to load hotels", err);
    }

    setLoadingHotels(false);
  };

  const addLocation = async (
    city: CityValues,
    country: CountryValues,
    start: string,
    end: string,
    accommodation?: Hotel,
  ) => {
    try {
      await createLocation({
        tripId: trip.id,
        city,
        country,
        start,
        end,
        accommodation,
      });

      showNotification({
        message: `Location - ${city} - was added.`,
        color: "green.7",
        icon: <FaCheck />,
      });

      setCreating(false);
      handleClose();
    } catch (error) {
      showNotification({
        title: "Something Went Wrong",
        message: (error as FirestoreError).message,
        color: "red",
        icon: <FaX />,
      });

      setCreating(false);
    }
  };

  const handleSubmit = (vals: typeof values) => {
    setCreating(true);

    if (!vals.city) return;

    const country = CITY_MAP.find(
      ({ cities }) => cities.filter((val) => val === vals.city).length > 0,
    );

    const selectedHotel = hotelOptions.find(
      (h) => h.value === vals.accommodation,
    )?.hotel;

    if (country) {
      addLocation(
        vals.city as CityValues,
        country.country as CountryValues,
        vals.start_date,
        vals.end_date,
        selectedHotel,
      );
    }
  };

  const handleClose = () => {
    reset();
    setHotelOptions([]);
    close();
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadHotels(searchValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchValue]);

  const formDisabled =
    !values.city || !values.start_date || !values.end_date || creating;

  return (
    <form onSubmit={onSubmit(handleSubmit)}>
      <Flex direction="column" gap={18}>
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
        <Select
          label="Accommodation"
          placeholder="Search hotels..."
          data={hotelOptions}
          value={values.accommodation}
          onChange={(val) => setFieldValue("accommodation", val || "")}
          disabled={!values.city}
          onSearchChange={setSearchValue}
          searchable
          nothingFoundMessage={loadingHotels ? "Loading..." : "No hotels found"}
        />
        <Button type="submit" disabled={formDisabled}>
          Add Location
        </Button>
      </Flex>
    </form>
  );
};
