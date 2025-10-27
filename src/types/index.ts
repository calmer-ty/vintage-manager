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

// 재사용 타입
export interface IShipping {
  amount: number;
  exchange: IExchange;
}

// 매입 타입
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
  shipping: IShipping | null;
  addSaleAt: Timestamp | null;
}

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
  shipping: IShipping;
}

// 상품
export interface ISalesProduct {
  uid: string;
  _id: string;
  brand: string;
  name: string;
  cost: {
    price: number;
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
export interface ICreateProductDoc {
  uid: string;
  _id: string;
  brand: string;
  name: string;
  cost: {
    price: number;
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

// Hooks Params

// 패키지
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

// 상품
export interface ICreateProductParams {
  productDocs: ICreateProductDoc[];
}
export interface ISalesProductParams {
  salesTarget: string;
  productDoc: IUpdateProductDoc;
}
