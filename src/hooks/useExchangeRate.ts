import axios from "axios";
import { useEffect, useMemo, useState } from "react";

import type { IExchangeRate } from "@/types";

export const useExchangeRate = () => {
  const [rates, setRates] = useState<IExchangeRate>();

  // const USD = rates?.data.conversion_rates.USD ?? 0;
  const USD = 1;
  const KRW = rates?.data.conversion_rates.KRW ?? 0;
  const JPY = rates?.data.conversion_rates.JPY ?? 0;

  const exchangeOptions = useMemo(
    () => [
      { code: "USD", label: "$", rate: USD, krw: USD * KRW },
      { code: "KRW", label: "₩", rate: KRW, krw: 1 },
      { code: "JPY", label: "¥", rate: JPY, krw: KRW / JPY },
    ],
    [USD, KRW, JPY]
  );

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/exchange-rate");
      setRates(response.data);
    } catch (err) {
      console.error("환율 정보 불러오기 실패:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    exchangeOptions,
  };
};
