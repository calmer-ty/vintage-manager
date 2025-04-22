import { Timestamp } from "firebase/firestore";

export interface IExchangeRate {
  base: string;
  data: {
    base_code: string;
    conversion_rates: {
      USD: number;
      KRW: number;
      JPY: number;
    };
  };
  time_last_update_utc: string;
}
export interface IIncomeItemData {
  id: string;
  brandName: string;
  itemName: string;
  price: string;
  createdAt: Timestamp;
}
