import { useDisclosure } from "@mantine/hooks";
import { ModalRoot, ModalOverlay, ModalContent, Title } from "@mantine/core";

import { Button, LocationForm } from "components";

import { FaPlus } from "react-icons/fa6";

import type { Trip } from "types/db";

import { MAX_DB_ENTRIES } from "constants/db";

interface Props {
  trip: Trip;
}

export const AddLocationModal = ({ trip }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ModalRoot opened={opened} onClose={close}>
        <ModalOverlay />
        <ModalContent bd="2px solid #000" bdrs={12} bg="green.3" p={12}>
          <Title ta="center" order={4}>
            New Location
          </Title>
          <LocationForm trip={trip} close={close} />
        </ModalContent>
      </ModalRoot>
      <Button
        color="green.4"
        onClick={open}
        disabled={trip.locations.length >= MAX_DB_ENTRIES}
      >
        <FaPlus />
        New Location
      </Button>
    </>
  );
};
