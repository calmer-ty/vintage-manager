import TableUI from "./table";

import { useDateSelector } from "@/contexts/dateSelectorContext";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";

import SaleWrite from "./write";

import type { IProduct, IUserID } from "@/types";

const columnConfig = [
  { key: "createdAt", label: "등록 일자" },
  { key: "soldAt", label: "판매 일자" },
  { key: "brand", label: "브랜드명" },
  { key: "name", label: "상품명" },
  { key: "costPrice", label: "매입가" },
  { key: "salePrice", label: "판매가" },
  { key: "profit", label: "예상 이익" },
];

export default function SalesUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { products, updateProduct, fetchProducts, loading } = useProducts({ uid, selectedYear, selectedMonth });

  // 수정 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<IProduct | undefined>(undefined);

  return (
    <article className="flex-1 px-10 py-6">
      {/* 판매가 수정 모달창 */}
      <SaleWrite uid={uid} isOpen={isWriteOpen} setIsOpen={setIsWriteOpen} updateTarget={updateTarget} setUpdateTarget={setUpdateTarget} updateProduct={updateProduct} fetchProducts={fetchProducts} />
      {/* 테이블 */}
      <TableUI columnConfig={columnConfig} data={products} setIsWriteOpen={setIsWriteOpen} setUpdateTarget={setUpdateTarget} fetchProducts={fetchProducts} loading={loading} />
    </article>
  );
}
