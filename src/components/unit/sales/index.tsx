import { useState } from "react";

import { useDateSelect } from "@/contexts/dateSelectContext";
import { useProducts } from "@/hooks/useProducts";

import TableUI from "./table";
import WriteDialog from "./dialog/WriteDialog";
import YearMonthSelect from "@/components/commons/YearMonthSelect";

import type { ISalesProduct, IUserID } from "@/types";

export default function SalesUI({ uid }: IUserID) {
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } = useDateSelect();
  const { products, salesProduct, fetchProducts, soldProduct, loading } = useProducts({ uid, selectedYear, selectedMonth });

  // 수정 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<ISalesProduct | undefined>(undefined);

  return (
    <article className="flex-1 px-10 py-6">
      <header className="flex justify-end mb-6">
        <YearMonthSelect
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </header>
      {/* 판매가 수정 모달창 */}
      <WriteDialog
        uid={uid}
        isOpen={isWriteOpen}
        setIsOpen={setIsWriteOpen}
        updateTarget={updateTarget}
        setUpdateTarget={setUpdateTarget}
        salesProduct={salesProduct}
        fetchProducts={fetchProducts}
      />
      {/* 테이블 */}
      <TableUI
        data={products}
        setIsWriteOpen={setIsWriteOpen}
        setUpdateTarget={setUpdateTarget}
        soldProduct={soldProduct}
        fetchProducts={fetchProducts}
        loading={loading}
      />
    </article>
  );
}
