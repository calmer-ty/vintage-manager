import axios from "axios";
import { useEffect, useState } from "react";
import { IExchangeRate } from "@/types";

export const useExchangeRate = () => {
  const [rates, setRates] = useState<IExchangeRate>();
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

  // const USD = rates?.data.conversion_rates.USD ?? 0;
  const KRW = rates?.data.conversion_rates.KRW ?? 0;
  const JPY = rates?.data.conversion_rates.JPY ?? 0;

  const baseRate = 1;
  const usdToKrw = KRW; // 1 USD = 1400 KRW
  const jpyToKrw = KRW / JPY;

  //   console.log("usdToKrw", usdToKrw);
  //   console.log("jpyToKrw", jpyToKrw);

  return {
    baseRate,
    usdToKrw,
    jpyToKrw,
  };
};
