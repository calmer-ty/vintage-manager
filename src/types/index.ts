import type { FieldValue } from "firebase/firestore";

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

// 중복되는게 많은 객체 키 타입
export interface IExchange {
  code: string;
  label: string;
  rate: number;
  krw: number;
}
export interface IShipping {
  amount: number;
  exchange: IExchange;
}
export interface ICost {
  price: number;
  shipping: number;
  fee: number;
  exchange: IExchange;
}
export interface ISales {
  price: number;
  fee: number;
  shipping: number;
  profit: number;
}

//
export interface IProduct {
  _id: string;
  uid: string;
  name: string;
  brand: string;
  cost: ICost;
}
export interface IPackage {
  _id: string;
  uid: string;
  products: IProduct[];
  createdAt: FieldValue;
  addSaleAt: FieldValue | null;
  shipping?: IShipping;
}

export interface ISalesProduct {
  uid: string;
  _id: string;
  name: string;
  brand: string;
  cost: ICost;
  sales: ISales;
  createdAt: FieldValue;
  soldAt: FieldValue | null;
}

// Hooks Params 패키지
export interface IMergePackageParams {
  targets: string[];
  packageDoc: IProduct[];
}
export interface ISalesPackageParams {
  target: string;
  salesDoc: IShipping;
}
export interface ISalesProductParams {
  target: string;
  salesDoc: ISales;
}
export interface ISoldProductParams {
  id: string;
  value: boolean;
}

// 유저 데이터
export interface IUserData {
  _id: string;
  uid: string;
  name: string;
  email: string;
  grade: "free" | "pro";
  createdAt: FieldValue;
}
