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
export interface IItemData {
  _id: string; // 문서 id 값
  uid: string;
  category: string;
  brandName: string;
  name: string;
  price: string;
  currency: string;
  priceKRW: string;
  createdAt: Timestamp;
  isSell: boolean;
}
export interface IUserID {
  uid: string;
}
