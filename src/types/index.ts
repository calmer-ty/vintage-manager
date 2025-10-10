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
export interface IUserID {
  uid: string;
}
export interface ICurrency {
  label: string;
  value: string;
  rate: number;
}
export interface IPrice {
  amount: string;
  currency: string;
}

// 패키지
export interface IProductPackage {
  _id: string; // 문서 id 값
  uid: string;
  products: IProduct[];
  createdAt: Timestamp;

  shipping: IPrice;
  fee: IPrice;
}
export interface IUpdateProductPackage {
  products: {
    name: string;
    brand: string;
    costPrice: IPrice;
  }[];
}
export interface ISaleProductPackage {
  shipping: IPrice;
  fee: IPrice;
}

// 상품
export interface IProduct {
  _id: string;
  brand: string;
  name: string;
  costPrice: IPrice;
  soldAt: Timestamp | null;

  uid?: string;
  salePrice?: string;
  profit?: number;
  createdAt?: Timestamp;
}
export interface IUpdateProduct {
  salePrice: string;
  profit: number;
}

// Hooks Params
export interface ICreateProductPackageParams {
  productPackage: IProductPackage;
}
export interface IUpdateProductPackageParams {
  updateTargetId: string;
  productPackage: IUpdateProductPackage | ISaleProductPackage;
}
export interface ICreateProductParams {
  uid: string;
  products: IProduct[];
}
export interface IUpdateProductParams {
  targetId: string;
  product: IUpdateProduct;
}
