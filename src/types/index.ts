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
export interface ICurrency {
  label: string;
  value: string;
  rate: number;
}

export interface IReceivingProduct {
  _id: string;
  name: string;
  brand: string;
  costPrice: string;
}
// 패키지
export interface IProductPackage {
  _id: string; // 문서 id 값
  uid: string;
  currency: string;
  shipping: string;
  products: IReceivingProduct[];
  createdAt: Timestamp;
}

// 상품

export interface IProduct {
  _id: string; // 문서 id 값
  uid: string;
  brand: string;
  name: string;
  costPrice: string;
  salePrice: string;
  profit: number;
  currency: string;
  createdAt: Timestamp;
  soldAt: Timestamp | null;
}
export interface ICreateProductParams {
  packageId: string;
  uid: string;
  currency: string;
  products: IReceivingProduct[];
  createdAt: Timestamp;
}

// 수정 상품
export interface IUpdateProduct {
  salePrice: string;
  profit: number;
}
export interface IUpdateProductParams {
  targetId: string;
  product: IUpdateProduct;
}

export interface IUserID {
  uid: string;
}
