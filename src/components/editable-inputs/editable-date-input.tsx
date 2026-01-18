import { DateInput, type DateInputProps } from "@mantine/dates";
import { useState } from "react";
import dayjs from "dayjs";
import { ActionIcon, Flex, Text, Box } from "@mantine/core";
import { FaCheck, FaX, FaPen } from "react-icons/fa6";

const dateParser: DateInputProps["dateParser"] = (input) => {
  if (input === "WW2") {
    return "1939-09-01";
  }

  return dayjs(input, "YYYY-MM-DD").format("YYYY-MM-DD");
};

type Props = {
  date: string;
  onChange: (id: string, date: string, start: boolean) => void;
  id: string;
  start: boolean;
};

export const EditableDateInput = ({
  date,
  onChange,
  id,
  start = true,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<string | null>(
    dayjs(date).format("ddd, DD MMM YY")
  );

  const handleSave = () => {
    if (value) {
      onChange(id, value, start);
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
          {dayjs(date).format("ddd, DD MMM YY")}
          <FaPen size="0.75rem" style={{ margin: "auto 0" }} />
        </Text>
      ) : (
        <DateInput
          mt="0.25rem"
          value={dayjs(value).format("ddd, DD MMM YY")}
          dateParser={dateParser}
          minDate={dayjs().format("YYYY-MM-DD")}
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
