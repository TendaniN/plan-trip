import { useDisclosure } from "@mantine/hooks";
import {
  ModalRoot,
  ModalOverlay,
  ModalContent,
  Title,
  ModalBody,
  Flex,
  Radio,
  InputLabel,
  Divider,
} from "@mantine/core";

import { Button, ExcelExportForm } from "components";

import { FaFileExcel, FaCheck } from "react-icons/fa6";
import { useState } from "react";
import { type ExportValues } from "constants/export";

export const ExportModal = ({ tripId }: { tripId: string }) => {
  const [opened, { open, close }] = useDisclosure(false);

  const [type, setType] = useState<ExportValues>("excel");

  return (
    <>
      <ModalRoot opened={opened} onClose={close}>
        <ModalOverlay />
        <ModalContent bd="2px solid #000" bdrs={12} bg="purple.2" p={12}>
          <Title ta="center" order={4} td="underline">
            Export Modal
          </Title>
          <ModalBody>
            <Flex mt="xs" direction="column">
              <InputLabel mb="sm">Select the type of export file</InputLabel>
              <Flex direction="row">
                <Radio
                  icon={FaCheck}
                  iconColor="#000"
                  size="md"
                  color="green.6"
                  id="excel"
                  name="excel"
                  label="Excel"
                  checked={"excel" === type}
                  onChange={(e) => setType(e.target.value as ExportValues)}
                />
              </Flex>
            </Flex>
            <Divider my="md" />
            {type === "excel" && <ExcelExportForm tripId={tripId} />}
          </ModalBody>
        </ModalContent>
      </ModalRoot>
      <Button color="secondary.2" onClick={open}>
        <FaFileExcel /> Export
      </Button>
    </>
  );
};
