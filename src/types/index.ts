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

// 패키지
export interface IProductPackage {
  _id: string; // 문서 id 값
  uid: string;
  currency: string;
  shipping: string;
  products: IReceivingProduct[];
  createdAt: Timestamp;
}
export interface IUpdateProductPackage {
  shipping: string;
  products: IReceivingProduct[];
}
export interface IUpdateProductPackageParams {
  updateTargetId: string;
  productPackage: IUpdateProductPackage;
}

// 상품
export interface IReceivingProduct {
  name: string;
  brand: string;
  costPrice: string;
}
export interface ICreateProduct {
  packageId: string;
  uid: string;
  currency: string;
  products: IReceivingProduct[];
  createdAt: Timestamp;
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
export interface IProduct2 {
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
export interface IUpdateProduct {
  salePrice: string;
  profit: number;
}
export interface IUpdateItemParams {
  updateTargetId: string;
  product: IUpdateProduct;
}

export interface IUserID {
  uid: string;
}
