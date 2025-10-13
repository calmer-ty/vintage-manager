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
// export interface IPrice {
//   amount: number;
//   exchange: IExchange;
// }

// 매입 타입
export interface IPurchaseProduct {
  _id: string; // 문서 id 값
  uid: string;
  name: string;
  brand: string;
  costPrice: number;
}
export interface IPackage {
  _id: string; // 문서 id 값
  uid: string;
  products: IPurchaseProduct[];
  createdAt: Timestamp;
}

// 상품
export interface IProduct {
  uid: string;
  _id: string;
  brand: string;
  name: string;
  costPrice: number;
  salePrice: number;
  profit: number;
  soldAt: Timestamp | null;
  createdAt: Timestamp;
}

// 업데이트 타입
export interface IUpdateProduct {
  salePrice: number;
  profit: number;
}
export interface ISalesDoc {
  exchange: IExchange;
  shipping: number;
  addSaleAt: Timestamp;
}

// Hooks Params

// 패키지
export interface ICreatePackageParams {
  packageDoc: IPackage;
}
export interface IMergePackageParams {
  deleteTargets: string[];
  packageDoc: IPackage;
}
export interface ISalesPackageParams {
  salesTarget: string;
  salesDoc: ISalesDoc;
}

// 상품
export interface ICreateProductParams {
  products: IPurchaseProduct[];
}
export interface IUpdateProductParams {
  targetId: string;
  product: IUpdateProduct;
}
