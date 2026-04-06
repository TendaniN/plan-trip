import { useState } from "react";
import { NativeSelect } from "@mantine/core";
import { useDBStore } from "db";
import getSymbolFromCurrency from "currency-symbol-map";
import { FaAngleDown } from "react-icons/fa6";

export const CurrencyDropdown = () => {
  const { currencyRates, setRate, setCurrency, currency } = useDBStore(
    (state) => state,
  );
  const countries = Object.keys(currencyRates);

  const [current, setCurrent] = useState("ZAR");

  const handleUpdateRate = (value: string) => {
    setCurrent(value);
    setRate(currencyRates[value]);
    setCurrency(getSymbolFromCurrency(value));
  };

  return (
    <NativeSelect
      value={current}
      styles={{
        root: {
          border: "1px solid #000",
          borderRadius: 12,

          "& select": {
            borderRadius: 12,
            border: "none",
          },

          "& svg": {
            color: "#000",
          },
        },
      }}
      my="auto"
      leftSection={currency}
      radius="md"
      onChange={(event) => handleUpdateRate(event.target.value)}
      rightSection={<FaAngleDown size="0.7rem" color="#000" />}
      data={countries}
    />
  );
};
