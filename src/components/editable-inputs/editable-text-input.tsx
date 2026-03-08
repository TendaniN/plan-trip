import { useState } from "react";
import { ActionIcon, Flex, Text, TextInput } from "@mantine/core";
import { FaCheck, FaX, FaPen } from "react-icons/fa6";

type Props = {
  text: string;
  onChange: (id: string, text: string) => void;
  id: string;
};

export const EditableTextInput = ({ text, onChange, id }: Props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<string>(text);

  const handleSave = () => {
    if (value) {
      onChange(id, value);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return !editing ? (
    <Text
      size="sm"
      mt="0.5rem"
      onClick={() => setEditing(true)}
      styles={{
        root: {
          cursor: "pointer",
          display: "flex",
          gap: "0.5rem",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      }}
    >
      <span
        style={{
          wordBreak: "break-all",
          width: "88%",
          lineHeight: 1.5,
          height: 26,
          overflow: "clip",
          margin: "auto 0",
        }}
      >
        {value}
      </span>
      <FaPen size="0.75rem" style={{ margin: "0.25rem auto 0 auto" }} />
    </Text>
  ) : (
    <TextInput
      mt="0.25rem"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      size="xs"
      autoFocus
      rightSectionWidth={60}
      rightSectionPointerEvents="all"
      rightSection={
        <Flex gap={4}>
          <ActionIcon
            variant="light"
            color="green.8"
            aria-label="Save"
            size="sm"
            onClick={handleSave}
          >
            <FaCheck />
          </ActionIcon>
          <ActionIcon
            variant="light"
            color="red"
            aria-label="Cancel"
            size="sm"
            onClick={handleCancel}
          >
            <FaX />
          </ActionIcon>
        </Flex>
      }
    />
  );
};
