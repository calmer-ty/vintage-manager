// 훅
import { useProducts } from "@/hooks/useProducts";
import { useDateSelector } from "@/contexts/dateSelectorContext";

import { usePackage } from "@/hooks/usePackage";

// 내부 요소
import DashboardChart from "./DashboardChart";
import DashboardStatus from "./DashboardStatus";

import type { IUserID } from "@/types";

export default function DashBoardUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { packages } = usePackage({ uid, selectedYear, selectedMonth });
  const { products } = useProducts({ uid, selectedYear, selectedMonth });

  return (
    <article className="p-10">
      <DashboardStatus products={products} packages={packages} />
      <DashboardChart products={products} selectedYear={selectedYear} selectedMonth={selectedMonth} />
    </article>
  );
}
