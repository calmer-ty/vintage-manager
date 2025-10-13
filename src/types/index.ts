import type { Timestamp } from "firebase/firestore";

// API 타입
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

// 기본 타입
export interface IUserID {
  uid: string;
}
export interface IExchange {
  code: string;
  label: string;
  rate: number;
  krw: number;
}
export interface IPrice {
  amount: number;
  exchange: IExchange;
}

// 매입 타입
export interface IPurchaseItem {
  _id: string; // 문서 id 값
  uid: string;
  name: string;
  brand: string;
  costPrice: IPrice;
}
export interface IPurchasePackage {
  _id: string; // 문서 id 값
  uid: string;
  products: IPurchaseItem[];
  createdAt: Timestamp;
}

export interface ISalesPackage {
  shipping: IPrice;
  addSaleAt: Timestamp;
}

// 상품
// export interface IPackageProduct {
//   name: string;
//   brand: string;
//   costPrice: IPrice;
// }
export interface IProduct {
  uid: string;
  _id: string;
  brand: string;
  name: string;
  costPrice: IPrice;
  salePrice: number;
  profit: number;
  soldAt: Timestamp | null;
  createdAt: Timestamp;
}
export interface IUpdateProduct {
  salePrice: number;
  profit: number;
}

// Hooks Params

// 패키지
export interface ICreatePurchasePackageParams {
  packageDoc: IPurchasePackage;
}
export interface IMergePurchasePackageParams {
  deleteTargets: string[];
  packageDoc: IPurchasePackage;
}
export interface ISalesPackageParams {
  salesTarget: string;
  salesDoc: ISalesPackage;
}

// 상품
export interface ICreateProductParams {
  products: IPurchaseItem[];
}
export interface IUpdateProductParams {
  targetId: string;
  product: IUpdateProduct;
}
