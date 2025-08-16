// import type { Timestamp } from "firebase/firestore";

import type { Timestamp } from "firebase/firestore";

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
  createdAt: Timestamp;
  soldAt: Timestamp | null;
}
export interface IUpdateItemData {
  category: string;
  brandName: string;
  name: string;
  salePrice: number;
  profit: number;
}
export interface IUpdateItemParams {
  updateTargetId: string;
  itemData: IUpdateItemData;
}

export interface IUserID {
  uid: string;
}
