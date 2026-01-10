import { useState } from "react";
import { ActionIcon, Flex, Text, Box, Textarea } from "@mantine/core";
import { FaCheck, FaX, FaPen } from "react-icons/fa6";

type Props = {
  text: string;
  onChange: (id: string, text: string) => void;
  id: string;
};

export const EditableTextareaInput = ({ text, onChange, id }: Props) => {
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

  return (
    <Box p={8}>
      {!editing ? (
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
          <span style={{ width: "97%" }}>
            {value ? value : "No description"}
          </span>
          <FaPen size="1rem" style={{ margin: "0 auto" }} />
        </Text>
      ) : (
        <Textarea
          mt="0.25rem"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          size="sm"
          autosize
          minRows={4}
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
