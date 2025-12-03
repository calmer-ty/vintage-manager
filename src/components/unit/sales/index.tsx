import { useState } from "react";

import { useDateSelectStore } from "@/store/useDateSelectStore";
import { useProducts } from "@/hooks/useProducts";

import TableUI from "./table";
import WriteDialog from "./WriteDialog";
import YearMonthSelect from "@/components/commons/YearMonthSelect";

import type { ISalesProduct } from "@/types";

export default function SalesUI() {
  const { selectedYear, selectedMonth, setSelectedYear, setSelectedMonth } = useDateSelectStore();
  const { products, salesProduct, fetchProducts, soldProduct, loading } = useProducts({ selectedYear, selectedMonth });

  // 수정 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<ISalesProduct | undefined>(undefined);

  return (
    <article className="flex-1 px-6 py-6 sm:px-10">
      <header className="flex justify-end mb-6">
        <YearMonthSelect
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
        />
      </header>
      {/* 판매가 수정 모달창 */}
      <WriteDialog
        isOpen={isWriteOpen}
        updateTarget={updateTarget}
        setIsOpen={setIsWriteOpen}
        setUpdateTarget={setUpdateTarget}
        salesProduct={salesProduct}
        fetchProducts={fetchProducts}
      />
      {/* 테이블 */}
      <TableUI
        data={products}
        loading={loading}
        setIsOpen={setIsWriteOpen}
        setUpdateTarget={setUpdateTarget}
        soldProduct={soldProduct}
        fetchProducts={fetchProducts}
      />
    </article>
  );
}
