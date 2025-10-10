import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import type { IExchangeRate } from "@/types";

export const useExchangeRate = () => {
  const [rates, setRates] = useState<IExchangeRate>();

  // const USD = rates?.data.conversion_rates.USD ?? 0;
  const USD = 1;
  const KRW = rates?.data.conversion_rates.KRW ?? 0;
  const JPY = rates?.data.conversion_rates.JPY ?? 0;

  // const usdToKrw = KRW; // 1 USD = 1400 KRW
  // const jpyToKrw = KRW / JPY;

  const currencyOptions = useMemo(
    () => [
      { label: "$", value: "USD", rate: USD },
      { label: "₩", value: "KRW", rate: KRW },
      { label: "¥", value: "JPY", rate: JPY },
    ],
    [USD, KRW, JPY]
  );

  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await axios.get("/api/exchange-rate");
        setRates(response.data);
      } catch (err) {
        console.error("환율 정보 불러오기 실패:", err);
      }
    };
    fetchExchangeRate();
  }, []);

  return {
    currencyOptions,
  };
};
