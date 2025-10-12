// 훅
import { useProducts } from "@/hooks/useProducts";
import { useDateSelector } from "@/contexts/dateSelectorContext";

import { usePurchase } from "@/hooks/usePurchase";

// 내부 요소
import DashboardChart from "./DashboardChart";
import DashboardStatus from "./DashboardStatus";

import type { IUserID } from "@/types";

export default function DashBoardUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { products } = useProducts({ uid, selectedYear, selectedMonth });
  const { purchase } = usePurchase({ uid, selectedYear, selectedMonth });

  return (
    <article className="p-10">
      <DashboardStatus products={products} purchase={purchase} />
      <DashboardChart products={products} selectedYear={selectedYear} selectedMonth={selectedMonth} />
    </article>
  );
}
