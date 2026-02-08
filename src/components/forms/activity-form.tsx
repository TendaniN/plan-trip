import {
  Flex,
  LoadingOverlay,
  Loader,
  TextInput,
  NumberInput,
  Textarea,
  ActionIcon,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { DateInput, TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import { Button } from "components";
import { FaCheck, FaX, FaRegClock } from "react-icons/fa6";
import { useState, useId } from "react";
import type { Location } from "types/db";

import { db } from "db";
import { useDBStore } from "db/store";
import logger from "utils/logger";
import { DEFAULT_DATE_FORMAT } from "constants/db";
import { showNotification } from "@mantine/notifications";
import type { DexieError } from "dexie";
import { useRef } from "react";

interface Props {
  location: Location;
  close: () => void;
}

export const ActivityForm = ({ location, close }: Props) => {
  const [creating, setCreating] = useState(false);

  const activityId = useId();

  const { updateLocation, addActivity, currency } = useDBStore(
    (state) => state,
  );

  const { values, getInputProps, onSubmit, reset } = useForm({
    initialValues: {
      date: "",
      activity: "",
      description: "",
      time: "",
      duration: 0,
      link: "",
      cost: 0,
    },
    onSubmitPreventDefault: "always",
    validate: {
      date: isNotEmpty("Required."),
      activity: isNotEmpty("Required."),
      time: isNotEmpty("Required."),
      link: isNotEmpty("Required."),
      cost: isNotEmpty("Required."),
    },
  });

  const createActivity = async (
    date: string,
    activity: string,
    description: string,
    time: string,
    duration: number,
    link: string,
    cost: string | number,
  ) => {
    const newActivity = {
      id: activityId,
      locationId: location.id,
      date,
      activity,
      description,
      time,
      duration,
      link,
      cost,
    };
    try {
      await db.itinerary.add(newActivity);
      await db.locations.update(location.id, {
        itinerary: [...location.itinerary, activityId],
      });
      addActivity(newActivity);
      updateLocation(location.id, {
        itinerary: [...location.itinerary, activityId],
      });

      logger.info(
        `Itinerary activity (${activityId}) added to Location (${location.id}).`,
      );
      showNotification({
        message: `Activity - ${activity} - was added.`,
        color: "green.7",
        icon: <FaCheck />,
      });
      setCreating(false);
      handleClose();
    } catch (error) {
      logger.error("Failed to add itinerary activity:" + error);
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
    createActivity(
      vals.date,
      vals.activity,
      vals.description,
      vals.time,
      vals.duration,
      vals.link,
      vals.cost,
    );
  };

  const handleClose = () => {
    reset();
    close();
  };

  const formDisabled =
    values.date === "" ||
    values.activity === "" ||
    values.time === "" ||
    values.link === "" ||
    values.cost <= 0 ||
    creating;

  const ref = useRef<HTMLInputElement>(null);

  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => ref.current?.showPicker()}
    >
      <FaRegClock />
    </ActionIcon>
  );

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
          <TextInput
            w="100%"
            radius="md"
            required
            label="Activity"
            value={values.activity}
            {...getInputProps("activity")}
          />
        </Flex>
        <Flex gap={8}>
          <DateInput
            w="50%"
            radius="md"
            required
            valueFormat={DEFAULT_DATE_FORMAT}
            placeholder={DEFAULT_DATE_FORMAT}
            minDate={dayjs(location.start_date).format("YYYY-MM-DD")}
            maxDate={dayjs(location.end_date).format("YYYY-MM-DD")}
            label="Date"
            value={dayjs(values.date).format("YYYY-MM-DD")}
            {...getInputProps("date")}
          />
          <TimeInput
            w="50%"
            radius="md"
            required
            label="Time"
            value={values.time}
            ref={ref}
            rightSection={pickerControl}
            {...getInputProps("time")}
          />
        </Flex>
        <Flex>
          <TextInput
            w="100%"
            radius="md"
            required
            label="Link"
            value={values.link}
            {...getInputProps("link")}
          />
        </Flex>
        <Flex gap={8}>
          <NumberInput
            w="50%"
            radius="md"
            required
            label="Cost"
            value={values.cost}
            leftSection={currency}
            {...getInputProps("cost")}
          />
          <NumberInput
            w="50%"
            radius="md"
            label="Duration"
            value={values.duration}
            {...getInputProps("duration")}
          />
        </Flex>
        <Flex>
          <Textarea
            w="100%"
            radius="md"
            label="Description"
            value={values.description}
            {...getInputProps("description")}
            resize="vertical"
          />
        </Flex>
        <Button type="submit" color="green.4" w="100%" disabled={formDisabled}>
          Add Activity
        </Button>
      </Flex>
    </form>
  );
};
