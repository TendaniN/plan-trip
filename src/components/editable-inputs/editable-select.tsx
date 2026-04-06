import { Text, Select } from "@mantine/core";
import { useState } from "react";
import type { SavedHotel, Hotel } from "types";
import { FaChevronDown } from "react-icons/fa6";
import logger from "utils/logger";
import { searchHotels } from "api/hotel";

type Props = {
  id: string;
  city: string;
  accommodation?: SavedHotel | null;
  onChange: (id: string, accommodation?: SavedHotel) => void;
};

export const EditableSelect = ({
  accommodation,
  onChange,
  id,
  city,
}: Props) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState<string | null>(
    accommodation ? accommodation.name : null,
  );
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [hotelOptions, setHotelOptions] = useState<
    { value: string; label: string; hotel: Hotel }[]
  >([]);

  const handleSave = (val: string | null) => {
    const hotel = hotelOptions.find((h) => h.value === val)?.hotel;

    setValue(val);
    onChange(id, hotel);
    setEditing(false);
  };

  const loadHotels = async () => {
    if (!city) return;

    setLoadingHotels(true);

    try {
      const { combined } = await searchHotels(city);

      setHotelOptions(
        combined.map((hotel) => ({
          value: hotel.placeId,
          label: `${hotel.name} (${hotel.rating ?? "-"}⭐)`,
          hotel,
        })),
      );
    } catch (err) {
      logger.error("Failed to load hotels", err);
    }

    setLoadingHotels(false);
  };

  return !editing ? (
    <Text
      size="sm"
      mt="0.5rem"
      onClick={() => {
        setEditing(true);
        loadHotels();
      }}
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
      data={hotelOptions}
      value={value}
      onChange={handleSave}
      onBlur={() => setEditing(false)}
      size="xs"
      autoFocus
      searchable
      nothingFoundMessage={loadingHotels ? "Loading..." : "No hotels found"}
    />
  );
};
