import axios from "axios";
import { useEffect, useState } from "react";

// MUI
import TextField from "@mui/material/TextField";

interface ExchangeRate {
  base: string;
  date: string;
  rates: {
    KRW: string;
    JPY: string;
  };
}

const CACHE_EXPIRY = 60 * 60 * 1000; // 캐시 만료 시간 1시간 (1시간 마다 새로 고침)

export default function ApiTest() {
  const [rates, setRates] = useState<ExchangeRate>();

  useEffect(() => {
    const fetchExchangeRate = async () => {
      const cachedData = localStorage.getItem("exchangeRate");
      const cachedTime = localStorage.getItem("exchangeRateTime");
      const currentTime = new Date().getTime();

      // 1시간 이내에 데이터가 있으면 로컬스토리지 데이터 사용
      if (cachedData && cachedTime && currentTime - Number(cachedTime) < CACHE_EXPIRY) {
        setRates(JSON.parse(cachedData)); // 로컬스토리지 데이터 사용
        return;
      }

      // 캐시가 없거나 만료된 경우 새로 API 호출
      const url = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${process.env.NEXT_PUBLIC_EXCHANGE_RATE_APIKEY}&symbols=JPY,KRW`;
      try {
        const response = await axios.get(url);
        setRates(response.data);

        // 새로운 데이터를 로컬스토리지에 저장
        localStorage.setItem("exchangeRate", JSON.stringify(response.data));
        localStorage.setItem("exchangeRateTime", currentTime.toString());
      } catch (error) {
        console.log(error);
      }
    };
    fetchExchangeRate();
  }, []);

  // 1달러 당
  const usdToJPY = 150.06;
  const usdToKRW = 1467.6;

  // 엔화 대비 원화 계산 비율
  const JPYPerKrw = usdToKRW / usdToJPY;

  const [inputValue, setInputValue] = useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // event.target.value는 입력 필드의 현재 값
  };
  const calculateKRW = (JPY: number) => {
    if (isNaN(JPY) || JPY <= 0) return 0;
    return JPY * JPYPerKrw;
  };
  const jpyValue = Number(inputValue);
  return (
    <>
      <TextField id="input-jpy" label="엔화" onChange={handleChange} />
      <div>원화: {calculateKRW(jpyValue)}</div>
    </>
  );
}
