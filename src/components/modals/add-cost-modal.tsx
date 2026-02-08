import { useDisclosure } from "@mantine/hooks";
import { ModalRoot, ModalOverlay, ModalContent, Title } from "@mantine/core";
import { BufferCostForm, Button, TravelCostForm } from "components";
import { FaPlus } from "react-icons/fa6";

interface Props {
  tripId: string;
  type?: "buffer" | "travel";
}

export const AddCostModal = ({ tripId, type }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <ModalRoot opened={opened} onClose={close}>
        <ModalOverlay />
        <ModalContent bd="2px solid #000" bdrs={12} bg="blue.3" p={12}>
          <Title ta="center" order={4} td="underline">
            New Cost
          </Title>
          {type === "travel" ? (
            <TravelCostForm tripId={tripId} close={close} />
          ) : (
            <BufferCostForm tripId={tripId} close={close} />
          )}
        </ModalContent>
      </ModalRoot>
      <Button color="blue.3" onClick={open}>
        <FaPlus />
        {`Add ${type === "buffer" ? "Buffer" : "Travel"} Cost`}
      </Button>
    </>
  );
};
