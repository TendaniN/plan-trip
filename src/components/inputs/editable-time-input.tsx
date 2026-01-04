import { useState, useRef } from "react";
import { ActionIcon, Flex, Text, Box } from "@mantine/core";
import { FaRegClock, FaX, FaPen, FaCheck } from "react-icons/fa6";
import { TimeInput } from "@mantine/dates";

type Props = {
  text: string;
  onChange: (id: string, text: string) => void;
  id: string;
};

export const EditableTimeInput = ({ text, onChange, id }: Props) => {
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

  const ref = useRef<HTMLInputElement>(null);

  const pickerControl = (
    <ActionIcon
      variant="subtle"
      color="gray"
      onClick={() => ref.current?.showPicker()}
    >
      <FaRegClock />
    </ActionIcon>
  );

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
          {value}
          <FaPen size="0.75rem" style={{ margin: "auto 0" }} />
        </Text>
      ) : (
        <TimeInput
          mt="0.25rem"
          value={value}
          onBlur={handleCancel}
          onChange={(e) => setValue(e.target.value)}
          size="xs"
          autoFocus
          leftSection={pickerControl}
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
