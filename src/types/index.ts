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
export interface IPrice {
  currency: string;
  amount: string;
}

// 패키지
export interface IProductPackage {
  _id: string; // 문서 id 값
  uid: string;
  products: IProduct[];
  shipping?: IPrice;
  createdAt: Timestamp;
}
export interface ICreateProductPackageParams {
  productPackage: IProductPackage;
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
}
export interface IUpdateProductPackageParams {
  updateTargetId: string;
  productPackage: IUpdateProductPackage | ISaleProductPackage;
}

// 상품
export interface IProduct {
  _id: string;
  uid: string;
  brand: string;
  name: string;
  costPrice: IPrice;
  salePrice?: string;
  profit?: number;
  soldAt?: Timestamp | null;
}
export interface ICreateProductParams {
  uid: string;
  products: IProduct[];
}
// 수정
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
