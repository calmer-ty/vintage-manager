// 훅
import { useProducts } from "@/hooks/useProducts";
import { useDateSelector } from "@/contexts/dateSelectorContext";

import { usePackages } from "@/hooks/usePackages";

// 내부 요소
import DashboardChart from "./DashboardChart";
import DashboardStatus from "./DashboardStatus";

import type { IUserID } from "@/types";

export default function DashBoardUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { packages } = usePackages({ uid, selectedYear, selectedMonth });
  const { products } = useProducts({ uid, selectedYear, selectedMonth });

  return (
    <article className="p-10">
      <DashboardStatus products={products} packages={packages} />
      <DashboardChart products={products} selectedYear={selectedYear} selectedMonth={selectedMonth} />
    </article>
  );
}
