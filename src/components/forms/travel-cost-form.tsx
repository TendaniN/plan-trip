import {
  Flex,
  LoadingOverlay,
  Loader,
  TextInput,
  NumberInput,
  ActionIcon,
  Select,
} from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { DateInput, TimeInput, type DateInputProps } from "@mantine/dates";
import dayjs from "dayjs";
import { Button } from "components";
import { FaCheck, FaX, FaRegClock } from "react-icons/fa6";
import { useState, useId } from "react";

import { db } from "db";
import { useDBStore } from "db/store";
import logger from "utils/logger";
import { DEFAULT_DATE_FORMAT } from "constants/db";
import { showNotification } from "@mantine/notifications";
import type { DexieError } from "dexie";
import { useRef } from "react";
const dateParser: DateInputProps["dateParser"] = (input) => {
  if (input === "WW2") {
    return "1939-09-01";
  }

  return dayjs(input, "YYYY-MM-DD").format("YYYY-MM-DD");
};

interface Props {
  tripId: string;
  close: () => void;
}

export const TravelCostForm = ({ tripId, close }: Props) => {
  const [creating, setCreating] = useState(false);

  const travelId = useId();

  const { addTravel, currency } = useDBStore((state) => state);

  const { values, getInputProps, onSubmit, reset } = useForm({
    initialValues: {
      cost: 0,
      type: "",
      duration: "",
      time: "",
      date: "",
      carrier: "",
    },
    onSubmitPreventDefault: "always",
    validate: {
      date: isNotEmpty("Required."),
      cost: isNotEmpty("Required."),
      time: isNotEmpty("Required."),
      type: isNotEmpty("Required."),
      carrier: isNotEmpty("Required."),
    },
  });

  const createCost = async (
    date: string,
    cost: number,
    type: "flight" | "train" | "bus" | "car",
    duration: string,
    time: string,
    carrier: string,
  ) => {
    const newCost = {
      id: travelId,
      tripId,
      date,
      type,
      duration,
      time,
      carrier,
      cost,
    };
    try {
      await db.travels.add(newCost);
      addTravel(newCost);

      logger.info(`Travel cost (${travelId}) added to Trip (${tripId}).`);
      showNotification({
        message: `Travel cost - ${type} - was added.`,
        color: "green.7",
        icon: <FaCheck />,
      });
      setCreating(false);
      handleClose();
    } catch (error) {
      logger.error("Failed to add travel cost:" + error);
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
    createCost(
      vals.date,
      vals.cost,
      vals.type as "flight" | "train" | "bus" | "car",
      vals.duration,
      vals.time,
      vals.carrier,
    );
  };

  const handleClose = () => {
    reset();
    close();
  };

  const formDisabled =
    values.type === "" ||
    values.cost === 0 ||
    values.duration === "" ||
    values.time === "" ||
    values.date === "" ||
    values.carrier === "" ||
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
        <Flex gap={8}>
          <Select
            w="100%"
            radius="md"
            required
            label="Type"
            placeholder="Select the type of travel..."
            value={values.type}
            data={["Flight", "Train", "Bus", "Car"]}
            {...getInputProps("type")}
          />
        </Flex>
        <Flex gap={8}>
          <TextInput
            w="100%"
            radius="md"
            required
            label="Carrier"
            value={values.carrier}
            {...getInputProps("carrier")}
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
        <Button type="submit" color="green.4" w="100%" disabled={formDisabled}>
          Add Cost
        </Button>
      </Flex>
    </form>
  );
};
