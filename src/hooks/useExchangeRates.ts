import { useEffect } from "react";
import { api } from "api";
import { useDBStore } from "db/store";
import logger from "utils/logger";

export default function useExchangeRates() {
  const { setCurrencyRates, setRate } = useDBStore();

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const { data } = await api.get("ZAR");

        if (data?.rates) {
          setCurrencyRates(data.rates);
          setRate(1);
        }
      } catch (error) {
        logger.error("Failed to fetch exchange rate:", error);
      }
    };

    fetchRates();
  }, [setCurrencyRates, setRate]);
}
