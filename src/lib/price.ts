import type { IExchange } from "@/types";

export const getPriceInKRW = (amount: number, rate: number) => {
  return Math.round(amount * rate);
};
export const getPriceInUSD = (amount: number, rate: number) => {
  return Math.round(amount / rate);
};

export const getDisplayPrice = (currency: string, price: number) => {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: currency === "USD" ? 2 : 0, // 달러만 소수점 둘째자리
  }).format(price);
};

export const getExchangeDisplayPrice = (viewCurrency: string, price: number, exchange: IExchange) => {
  // 변환된 금액 계산
  let convertedAmount = 0;

  switch (viewCurrency) {
    case "KRW":
      convertedAmount = price * exchange.krw;
      break;
    case "USD":
      if (exchange.rate === 0 || price === 0) {
        convertedAmount = 0; // 0/0 방지
      } else {
        convertedAmount = price / exchange.rate;
      }
      break;
    default:
      return "작업중";
  }

  // Intl.NumberFormat으로 포맷 (자동 기호 처리)
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: viewCurrency,
    minimumFractionDigits: viewCurrency === "USD" ? 2 : 0, // 달러만 소수점 둘째자리
  }).format(convertedAmount);
};
