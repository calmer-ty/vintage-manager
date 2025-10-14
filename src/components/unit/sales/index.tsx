import TableUI from "./table";

import { useDateSelector } from "@/contexts/dateSelectorContext";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";

import DialogWrite from "./dialog/DialogWrite";

import type { ISalesProduct, IUserID } from "@/types";

export default function SalesUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { products, salesProduct, fetchProducts, loading } = useProducts({ uid, selectedYear, selectedMonth });

  // 수정 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<ISalesProduct | undefined>(undefined);

  return (
    <article className="flex-1 px-10 py-6">
      {/* 판매가 수정 모달창 */}
      <DialogWrite uid={uid} isOpen={isWriteOpen} setIsOpen={setIsWriteOpen} updateTarget={updateTarget} setUpdateTarget={setUpdateTarget} salesProduct={salesProduct} fetchProducts={fetchProducts} />
      {/* 테이블 */}
      <TableUI data={products} setIsWriteOpen={setIsWriteOpen} setUpdateTarget={setUpdateTarget} fetchProducts={fetchProducts} loading={loading} />
    </article>
  );
}
