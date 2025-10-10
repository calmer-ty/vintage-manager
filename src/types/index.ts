import type { Timestamp } from "firebase/firestore";
import { UseFormReturn } from "react-hook-form";

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
  krw: number;
}
export interface IPrice {
  amount: string;
  currency: string;
}

// 패키지
export interface IProductPackage {
  _id: string; // 문서 id 값
  uid: string;
  products: IPackageProduct[];
  shipping: IPrice;
  fee: IPrice;
  createdAt: Timestamp;
  addSaleAt: Timestamp | null;
}
export interface ISalesProductPackage {
  shipping: IPrice;
  fee: IPrice;
  addSaleAt: Timestamp;
}

// 상품
export interface IPackageProduct {
  name: string;
  brand: string;
  costPrice: IPrice;
}
export interface IProduct {
  uid: string;
  _id: string;
  brand: string;
  name: string;
  costPrice: IPrice;
  salePrice: string;
  profit: number;
  soldAt: Timestamp | null;
  createdAt: Timestamp;
}
export interface IUpdateProduct {
  salePrice: string;
  profit: number;
}
export interface IUpdateProducts {
  products: IPackageProduct[];
}

// Hooks Params
export interface ICreateProductPackageParams {
  productPackage: IProductPackage;
}
export interface IUpdateProductPackageParams {
  updateTargetId: string;
  products: IUpdateProducts; // 패키지에서 수정할건 상품 데이터 뿐이기 때문
}
export interface ISalesProductPackageParams {
  updateTargetId: string;
  salesData: ISalesProductPackage;
}
export interface ICreateProductParams {
  uid: string;
  products: IPackageProduct[];
}
export interface IUpdateProductParams {
  targetId: string;
  product: IUpdateProduct;
}
