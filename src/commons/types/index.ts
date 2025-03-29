import { Timestamp } from "firebase/firestore";

export interface IExchangeRate {
  base: string;
  date: string;
  rates: {
    KRW: string;
    JPY: string;
  };
}
export interface IIncomeItemData {
  id: string;
  brandName: string;
  itemName: string;
  price: string;
  createdAt: Timestamp;
}
