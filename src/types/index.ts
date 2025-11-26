import type { FieldValue, Timestamp } from "firebase/firestore";

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
export interface IPurchaseProduct {
  _id: string;
  uid: string;
  name: string;
  brand: string;
  cost: {
    price: number;
    shipping: number;
    fee: number;
    exchange: IExchange;
  };
}
export interface IPackage {
  _id: string;
  uid: string;
  products: IPurchaseProduct[];
  createdAt: Timestamp;
  addSaleAt: Timestamp | null;
  shipping?: IShipping;
}

export interface ISalesProduct {
  uid: string;
  _id: string;
  name: string;
  brand: string;
  cost: {
    price: number;
    shipping: number;
    fee: number;
    exchange: IExchange;
  };
  sales: {
    price: number;
    fee: number;
    shipping: number;
    profit: number;
  };
  soldAt: Timestamp | null;
  createdAt: Timestamp;
}

// 패키지 Hook으로 들어가는 인자값 타입
export interface ICreatePackageDoc {
  products: {
    _id: string;
    name: string;
    brand: string;
    cost: {
      price: number;
      shipping: number;
      fee: number;
      exchange: IExchange;
    };
  }[];
}
export interface IMargePackageDoc {
  products: IPurchaseProduct[];
}
export interface ISalesPackageDoc {
  shipping?: IShipping;
}

// 상품 Hook으로 들어가는 인자값 타입
export interface ICreateProductDoc {
  uid: string;
  _id: string;
  name: string;
  brand: string;
  cost: {
    price: number;
    shipping: number;
    fee: number;
    exchange: IExchange;
  };
}
export interface IUpdateProductDoc {
  sales: {
    price: number;
    fee: number;
    shipping: number;
    profit: number;
  };
}

// Hooks Params 패키지
export interface ICreatePackageParams {
  packageDoc: ICreatePackageDoc;
}
export interface IMergePackageParams {
  deleteTargets: string[];
  packageDoc: IMargePackageDoc;
}
export interface ISalesPackageParams {
  salesTarget: string;
  salesDoc: ISalesPackageDoc;
}
export interface IDeletePackageParams {
  deleteTargets: string[];
}

// Hooks Params 상품
export interface ICreateProductParams {
  productDocs: ICreateProductDoc[];
}
export interface ISalesProductParams {
  salesTarget: string;
  productDoc: IUpdateProductDoc;
}
export interface ISoldProductParams {
  id: string;
  value: boolean;
}

// 유저 데이터
export interface IUserData {
  name: string;
  email: string;
  grade: "free" | "pro";
  createdAt: FieldValue;
}
