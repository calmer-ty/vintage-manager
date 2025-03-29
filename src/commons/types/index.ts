import { Timestamp } from "firebase/firestore";

export interface ExchangeRate {
  base: string;
  date: string;
  rates: {
    KRW: string;
    JPY: string;
  };
}
export interface IncomeItemData {
  id: string;
  brandName: string;
  itemName: string;
  JPY: string;
  createdAt: Timestamp;
}
