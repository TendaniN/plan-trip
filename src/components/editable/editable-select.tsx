import { Box, Text, Select } from "@mantine/core";
import { ALL_HOTELS } from "constants/hotels";
import { useState, useMemo } from "react";
import type { HotelProps } from "types/hotel";
import { FaChevronDown } from "react-icons/fa6";

type Props = {
  id: string;
  city: string;
  accommodation?: HotelProps;
  onChange: (id: string, accommodation?: HotelProps) => void;
};

export const EditableSelect = ({
  accommodation,
  onChange,
  id,
  city,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<string | null>(
    accommodation ? accommodation.name : null
  );

  const filteredAccommodations = useMemo(() => {
    const hotels = ALL_HOTELS.find(({ type }) => type === city);
    if (hotels) {
      return hotels.hotels;
    }
    return [];
  }, [city]);

  const handleSave = (val: string | null) => {
    const hotel = val
      ? filteredAccommodations.find(({ name }) => name === val)
      : undefined;

    setValue(val);
    onChange(id, hotel);
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
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              cursor: "pointer",
              textDecoration: "none",

              "&:hover": {
                textDecoration: "underline",
              },
            },
          }}
        >
          {accommodation?.name ?? "none"}
          <FaChevronDown style={{ margin: "auto 0" }} />
        </Text>
      ) : (
        <Select
          value={value}
          data={filteredAccommodations.map(({ name }) => name)}
          onChange={handleSave}
          onBlur={() => setEditing(false)}
          size="xs"
          autoFocus
          searchable
        />
      )}
    </Box>
  );
};
