import { useUserItems } from "@/hooks/useUserItems";
import { useDateSelector } from "@/contexts/dateSelectorContext";

import ManagementSelect from "./select";
import TableUI from "./table";

import type { IUserID } from "@/types";

const columnConfig = [
  { key: "createdAt", label: "등록 일자" },
  { key: "soldAt", label: "판매 일자" },
  { key: "category", label: "상품 종류" },
  { key: "brandName", label: "브랜드명" },
  { key: "name", label: "상품명" },
  { key: "costPrice", label: "매입가" },
  { key: "costPriceKRW", label: "매입가(원화)" },
  { key: "salePrice", label: "판매가" },
  { key: "profit", label: "예상 이익" },
];

export default function ManagementUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { items, fetchItems } = useUserItems({ uid, selectedYear, selectedMonth });

  return (
    <article className="flex flex-col justify-center items-center gap-4">
      <TableUI data={items} uid={uid} refetch={fetchItems} columnConfig={columnConfig} renderStatusCell={(itemData) => <ManagementSelect itemData={itemData} refetch={fetchItems} />} />
    </article>
  );
}
