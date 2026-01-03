import { useDisclosure } from "@mantine/hooks";
import {
  Flex,
  Text,
  ModalRoot,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Title,
  ActionIcon,
} from "@mantine/core";
import { FaRegTrashCan } from "react-icons/fa6";

import { db } from "db";
import { useDBStore } from "db/store";
import logger from "utils/logger";

import { Button } from "components";
import { useState } from "react";

export const RemoveLocationModal = ({
  tripId,
  locationId,
}: {
  tripId: string;
  locationId: string;
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [removing, setRemoving] = useState(false);

  const { removeLocation } = useDBStore((state) => state);

  const deleteLocation = async () => {
    try {
      await db.trips.update(tripId, (trip) => {
        trip.locations = trip.locations.filter((id) => id !== locationId);
      });
      await db.locations.delete(locationId);
      removeLocation(tripId, locationId);

      logger.info(`Removed (${locationId}) from Trip (${tripId}).`);

      setRemoving(false);
      close();
    } catch (error) {
      logger.error("Failed to remove location:" + error);
      setRemoving(false);
    }
  };

  const handleDelete = () => {
    setRemoving(true);
    deleteLocation();
  };

  return (
    <>
      <ModalRoot opened={opened} onClose={close}>
        <ModalOverlay />
        <ModalContent bd="2px solid #000" bdrs={12} bg="primary.1" p={12}>
          <Title ta="center" order={4}>
            Remove Location?
          </Title>
          <ModalBody mt={8}>
            <Flex gap="0.5rem" direction="column">
              <Text ta="center" fz="sm">
                If you remove this location, we’ll automatically adjust your
                trip dates to keep everything in sync.
              </Text>
              <Text fw="600" ta="center">
                This cannot be undone.
              </Text>
            </Flex>
            <Flex mt={8} direction="row" justify="space-between">
              <Button onClick={close}>Go back</Button>
              <Button color="red.6" disabled={removing} onClick={handleDelete}>
                Yes, remove it
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </ModalRoot>
      <ActionIcon color="red.4" mt="0.5rem" mx="0.5rem" onClick={open}>
        <FaRegTrashCan />
      </ActionIcon>
    </>
  );
};
