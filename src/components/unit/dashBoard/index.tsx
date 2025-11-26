import { useDateSelect } from "@/contexts/dateSelectContext";
import { useProducts } from "@/hooks/useProducts";
import { usePackages } from "@/hooks/usePackages";

import YearMonthSelect from "@/components/commons/YearMonthSelect";
import DashboardChart from "./DashboardChart";
import DashboardStatus from "./DashboardStatus";

import type { IUserID } from "@/types";

export default function DashBoardUI({ uid }: IUserID) {
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } = useDateSelect();
  const { packages } = usePackages({ uid, selectedYear, selectedMonth });
  const { products } = useProducts({ uid, selectedYear, selectedMonth });

  return (
    <article className="px-10 py-6">
      <header className="flex justify-end mb-6">
        <YearMonthSelect
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
        />
      </header>
      <DashboardStatus products={products} packages={packages} />
      <DashboardChart products={products} selectedYear={selectedYear} selectedMonth={selectedMonth} />
    </article>
  );
}
