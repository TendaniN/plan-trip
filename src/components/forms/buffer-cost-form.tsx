import { Flex, LoadingOverlay, Loader, NumberInput } from "@mantine/core";
import { useForm, isNotEmpty } from "@mantine/form";
import { Button } from "components";
import { FaCheck, FaX } from "react-icons/fa6";
import { useState, useId } from "react";

import { useDBStore } from "db";
import type { FirestoreError } from "firebase/firestore";
import logger from "utils/logger";
import { showNotification } from "@mantine/notifications";
import { editBudget } from "api/budget";
interface Props {
  tripId: string;
  close: () => void;
}

export const BufferCostForm = ({ tripId, close }: Props) => {
  const [creating, setCreating] = useState(false);

  const budgetId = useId();

  const { currency } = useDBStore((state) => state);

  const { values, getInputProps, onSubmit, reset } = useForm({
    initialValues: {
      cost: 0,
    },
    onSubmitPreventDefault: "always",
    validate: {
      cost: isNotEmpty("Required."),
    },
  });

  const createCost = async (cost: number) => {
    try {
      await editBudget(budgetId, { buffer: cost });

      logger.info(`Cost (${budgetId}) added to Trip (${tripId}).`);
      showNotification({
        message: `Cost - buffer - was added.`,
        color: "green.7",
        icon: <FaCheck />,
      });
      setCreating(false);
      handleClose();
    } catch (error) {
      logger.error("Failed to add cost:" + error);
      showNotification({
        title: "Something Went Wrong",
        message:
          (error as FirestoreError).message ||
          "Failed to add cost. Please try again.",
        color: "red",
        icon: <FaX />,
      });
      setCreating(false);
    }
  };

  const handleSubmit = (vals: typeof values) => {
    setCreating(true);
    createCost(vals.cost);
  };

  const handleClose = () => {
    reset();
    close();
  };

  const formDisabled = values.cost <= 0 || creating;

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
          <NumberInput
            w="100%"
            radius="md"
            required
            label="Cost"
            value={values.cost}
            leftSection={currency}
            {...getInputProps("cost")}
          />
        </Flex>
        <Button type="submit" color="green.4" w="100%" disabled={formDisabled}>
          Add Cost
        </Button>
      </Flex>
    </form>
  );
};
