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
export interface IProductPackage {
  _id: string; // 문서 id 값
  uid: string;
  currency: string;
  shipping: string;
  products: IReceivingProduct[];
  createdAt: Timestamp;
}
export interface IReceivingProduct {
  name: string;
  brand: string;
  costPrice: string;
}
export interface ICurrency {
  label: string;
  value: string;
  rate: string;
}

export interface IProduct {
  _id: string; // 문서 id 값
  uid: string;
  name: string;
  brand: string;
  costPrice: string;
  salePrice: number;
  costPriceKRW: number;
  profit?: number;
  exchangeRate?: number;
  createdAt: Timestamp;
  soldAt: Timestamp | null;
}
export interface IUpdateProduct {
  name: string;
  brand: string;
  salePrice: number;
  profit: number;
}
export interface IUpdateItemParams {
  updateTargetId: string;
  itemData: IUpdateProduct;
}

export interface IUserID {
  uid: string;
}
