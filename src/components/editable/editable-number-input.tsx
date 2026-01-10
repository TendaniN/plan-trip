import { useState } from "react";
import { ActionIcon, Flex, Text, Box, NumberInput } from "@mantine/core";
import { FaCheck, FaX, FaPen } from "react-icons/fa6";

type Props = {
  text: string | number;
  preText?: string;
  postText?: string;
  precision?: number;
  onChange: (id: string, text: string | number) => void;
  id: string;
};

export const EditableNumberInput = ({
  text,
  onChange,
  id,
  preText,
  postText,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<string | number>(text);

  const handleSave = () => {
    if (value) {
      onChange(id, value);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  return (
    <Box
      style={{
        borderBottom: "1px solid #000",
        borderRight: "1px solid #000",
        textTransform: "capitalize",
        padding: "8px 16px",
      }}
    >
      {!editing ? (
        <Text
          size="sm"
          mt="0.5rem"
          onClick={() => setEditing(true)}
          styles={{
            root: {
              cursor: "pointer",
              display: "inline-flex",
              gap: "0.5rem",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          }}
        >
          {`${preText ? preText : ""}${value}${postText ? ` ${postText}` : ""}`}
          <FaPen size="0.75rem" style={{ margin: "auto 0" }} />
        </Text>
      ) : (
        <NumberInput
          mt="0.25rem"
          value={value}
          onChange={setValue}
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
      )}
    </Box>
  );
};
