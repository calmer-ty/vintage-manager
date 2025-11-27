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

// 해당 아이템의 타입
export interface IShipping {
  amount: number;
  exchange: IExchange;
}
export interface ICostType {
  price: number;
  shipping: number;
  fee: number;
  exchange: IExchange;
}
export interface ISalesType {
  price: number;
  fee: number;
  shipping: number;
  profit: number;
}
export interface IProduct {
  _id: string;
  uid: string;
  name: string;
  brand: string;
  cost: ICostType;
}
// 상품 Hook으로 들어가는 인자값 타입
// export interface ICreateProductDoc {
//   _id: string;
//   uid: string;
//   name: string;
//   brand: string;
//   cost: ICostType;
// }
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
  cost: ICostType;
  sales: ISalesType;
  createdAt: FieldValue;
  soldAt: FieldValue | null;
}

// 패키지 Hook으로 들어가는 인자값 타입
export interface ICreatePackageDoc {
  products: {
    _id: string;
    name: string;
    brand: string;
    cost: ICostType;
  }[];
  // products: IProduct[];
}

// Hooks Params 패키지
export interface IMergePackageParams {
  deleteTargets: string[];
  packageDoc: IProduct[];
}
export interface ISalesPackageParams {
  salesTarget: string;
  salesDoc: IShipping;
}
export interface ISalesProductParams {
  salesTarget: string;
  salesDoc: ISalesType;
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
