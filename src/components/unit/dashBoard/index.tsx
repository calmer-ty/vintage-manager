// 훅
import { useProducts } from "@/hooks/useProducts";
import { useDateSelector } from "@/contexts/dateSelectorContext";

// 내부 요소
import DashBoardChart from "./chart";
import DashBoardStatus from "./status";

import type { IUserID } from "@/types";
import { useProductPackages } from "@/hooks/useProductPackages";

export default function DashBoardUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { products } = useProducts({ uid, selectedYear, selectedMonth });
  const { productPackages } = useProductPackages({ uid, selectedYear, selectedMonth });

  return (
    <article className="p-10">
      <DashBoardStatus products={products} productPackages={productPackages} />
      <DashBoardChart products={products} selectedYear={selectedYear} selectedMonth={selectedMonth} />
    </article>
  );
}
