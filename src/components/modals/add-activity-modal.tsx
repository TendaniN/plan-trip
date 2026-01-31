import { useDisclosure } from "@mantine/hooks";
import { ModalRoot, ModalOverlay, ModalContent, Title } from "@mantine/core";
import { ActivityForm, Button } from "components";
import { FaPlus } from "react-icons/fa6";
import type { Location } from "types/db";

import { MAX_DB_ENTRIES } from "constants/db";

interface Props {
  location: Location;
}

export const AddActivityModal = ({ location }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ModalRoot opened={opened} onClose={close}>
        <ModalOverlay />
        <ModalContent bd="2px solid #000" bdrs={12} bg="blue.3" p={12}>
          <Title ta="center" order={4} td="underline">
            New Activity
          </Title>
          <ActivityForm close={close} location={location} />
        </ModalContent>
      </ModalRoot>
      <Button
        color="blue.3"
        onClick={open}
        disabled={location.itinerary.length >= MAX_DB_ENTRIES}
      >
        <FaPlus />
        Add Activity
      </Button>
    </>
  );
};
