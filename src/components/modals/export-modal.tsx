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

import { Button, ExportForm } from "components";

import { FaDownload, FaFileExcel, FaFilePdf } from "react-icons/fa6";
import { useState } from "react";
import { type ExportValues } from "constants/export";
import type { IconType } from "react-icons/lib";

const TypeRadio = ({
  type,
  onChange,
  checked,
  label,
  icon,
}: {
  type: ExportValues;
  onChange: (value: ExportValues) => void;
  checked: boolean;
  label: string;
  icon: IconType;
}) => (
  <Radio
    icon={icon}
    iconColor="#000"
    size="lg"
    fz="sm"
    color="green.6"
    id={type}
    name={type}
    label={label}
    checked={checked}
    value={type}
    onChange={(e) => onChange(e.target.value as ExportValues)}
  />
);

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
              <Flex direction="row" gap={12}>
                <TypeRadio
                  checked={"excel" === type}
                  onChange={setType}
                  type={"excel" as ExportValues}
                  icon={FaFileExcel}
                  label="Excel"
                />
                <TypeRadio
                  checked={"pdf" === type}
                  onChange={setType}
                  type={"pdf" as ExportValues}
                  icon={FaFilePdf}
                  label="PDF"
                />
              </Flex>
            </Flex>
            <Divider my="md" />
            <ExportForm tripId={tripId} type={type} />
          </ModalBody>
        </ModalContent>
      </ModalRoot>
      <Button color="secondary.2" onClick={open}>
        <FaDownload /> Export
      </Button>
    </>
  );
};
