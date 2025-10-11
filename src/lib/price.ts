import type { IPrice } from "@/types";

export const getPriceInKRW = (amount: number, rate: number) => {
  return Math.round(amount * rate);
};
export const getPriceInUSD = (amount: number, rate: number) => {
  return Math.round(amount / rate);
};

export const getExchangeDisplayPrice = (currency: string, price: IPrice) => {
  switch (currency) {
    case "KRW":
      return `${Math.round(price.amount * price.exchange.krw).toLocaleString()} ₩`;
    case "USD":
      return `${Math.round(price.amount / price.exchange.rate).toLocaleString()} $`;
    default:
      return "작업중";
  }
};
