import { useDisclosure } from "@mantine/hooks";
import { ModalRoot, ModalOverlay, ModalContent, Title } from "@mantine/core";

import { Button, TripForm } from "components";

import { FaPlus } from "react-icons/fa6";

import { MAX_DB_ENTRIES } from "constants/db";
import { useDBStore } from "db/store";

export const AddTripModal = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const trips = useDBStore((state) => state.trips);
  return (
    <>
      <ModalRoot opened={opened} onClose={close}>
        <ModalOverlay />
        <ModalContent bd="2px solid #000" bdrs={12} bg="primary.3" p={12}>
          <Title ta="center" order={4}>
            New Trip
          </Title>
          <TripForm />
        </ModalContent>
      </ModalRoot>
      <Button
        color="secondary.2"
        onClick={open}
        disabled={trips.length >= MAX_DB_ENTRIES}
      >
        <FaPlus />
        New Trip
      </Button>
    </>
  );
};
