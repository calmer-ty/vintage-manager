// import type { Timestamp } from "firebase/firestore";

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
export interface IItemData {
  _id: string; // 문서 id 값
  uid: string;
  category: string;
  brandName: string;
  name: string;
  costPrice: string;
  costPriceKRW: number;
  salePrice: number;
  profit: number;
  exchangeRate: number;
  createdAt: Date;
  soldAt: Date | null;
}
export interface IUserID {
  uid: string;
}
