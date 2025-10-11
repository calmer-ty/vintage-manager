import type { IPrice } from "@/types";

export const getPriceInKRW = (amount: number, rate: number) => {
  return Math.round(amount * rate);
};
export const getPriceInUSD = (amount: number, rate: number) => {
  return Math.round(amount / rate);
};

export const getDisplayPrice = (currency: string, price: IPrice) => {
  switch (currency) {
    case "KRW":
      return `${Math.round(price.amount * price.currency.krw).toLocaleString()} ₩`;
    case "USD":
      return `${Math.round(price.amount / price.currency.rate).toLocaleString()} $`;
    default:
      return "작업중";
  }
};
