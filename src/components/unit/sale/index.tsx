import TableUI from "./table";

import type { IProduct, IUserID } from "@/types";
import SaleWrite from "./write";
import { useDateSelector } from "@/contexts/dateSelectorContext";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";

const columnConfig = [
  { key: "createdAt", label: "입고 일자" },
  { key: "soldAt", label: "판매 일자" },
  { key: "brand", label: "브랜드명" },
  { key: "name", label: "상품명" },
  { key: "costPrice", label: "매입가" },
  { key: "salePrice", label: "판매가" },
  { key: "profit", label: "예상 이익" },
];

export default function SaleUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { products, updateProduct, fetchProducts, loading } = useProducts({ uid, selectedYear, selectedMonth });

  // 수정 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<IProduct | undefined>(undefined);

  return (
    <article className="p-6">
      <div
        className="w-full overflow-auto mx-auto px-6 border bg-white rounded-lg shadow-sm 
        max-w-xs
        sm:max-w-sm
        md:max-w md
        lg:max-w-lg
        xl:max-w-3xl
        2xl:max-w-5xl
        "
      >
        {/* 판매가 수정 모달창 */}
        <SaleWrite
          uid={uid}
          isOpen={isWriteOpen}
          setIsOpen={setIsWriteOpen}
          updateTarget={updateTarget}
          setUpdateTarget={setUpdateTarget}
          updateProduct={updateProduct}
          fetchProducts={fetchProducts}
        />

        {/* 테이블 */}
        <TableUI columnConfig={columnConfig} data={products} setIsWriteOpen={setIsWriteOpen} setUpdateTarget={setUpdateTarget} fetchProducts={fetchProducts} loading={loading} />
      </div>
    </article>
  );
}
