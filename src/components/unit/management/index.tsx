import { useUserItems } from "@/hooks/useUserItems";
import { useDateSelector } from "@/hooks/useDateSelector";

import DataTable from "@/components/commons/table/data";
import YearMonthSelect from "@/components/commons/select/yearMonth";
import ManagementSelect from "./select";

import type { IUserID } from "@/types";

const columnConfig = [
  { key: "category", label: "상품 종류" },
  { key: "brandName", label: "브랜드명" },
  { key: "name", label: "상품명" },
  { key: "costPrice", label: "매입가" },
  { key: "costPriceKRW", label: "매입가(원화)" },
  { key: "salePrice", label: "판매가" },
  { key: "profit", label: "예상 이익" },
];

export default function ManagementUI({ uid }: IUserID) {
  const { selectedYear, setSelectedYear, selectedMonth, setSelectedMonth } = useDateSelector();
  const { items, fetchItems } = useUserItems({ uid, selectedYear, selectedMonth });

  return (
    <article className="flex flex-col justify-center items-center gap-4 w-full h-full px-20">
      <YearMonthSelect selectedYear={selectedYear} setSelectedYear={setSelectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
      <DataTable data={items} uid={uid} refetch={fetchItems} columnConfig={columnConfig} renderStatusCell={(itemData) => <ManagementSelect itemData={itemData} refetch={fetchItems} />} />
    </article>
  );
}
