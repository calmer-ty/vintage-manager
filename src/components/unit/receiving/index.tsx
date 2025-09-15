import { useState } from "react";

import { useDateSelector } from "@/contexts/dateSelectorContext";
import { useProductPackages } from "@/hooks/useProductPackages";

import ReceivingWrite from "./write";
import TableUI from "./table";

import type { IUserID } from "@/types";

const columnConfig = [
  { key: "createdAt", label: "등록 일자" },
  { key: "shipping", label: "배송비" },
  { key: "products", label: "개별 상품명 / 매입가" },
];

export default function ReceivingUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { productPackages, createProductPackage, deleteProductPackage, fetchProductPackages, loading } = useProductPackages({ uid, selectedYear, selectedMonth });

  // 등록/수정 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);

  return (
    <article className="px-10 py-6">
      {/* 등록/수정 모달 */}
      <ReceivingWrite uid={uid} isOpen={isWriteOpen} setIsOpen={setIsWriteOpen} createProductPackage={createProductPackage} fetchProductPackages={fetchProductPackages} />
      {/* 테이블 */}
      <TableUI data={productPackages} columnConfig={columnConfig} setIsWriteOpen={setIsWriteOpen} deleteProductPackage={deleteProductPackage} loading={loading} />
    </article>
  );
}
