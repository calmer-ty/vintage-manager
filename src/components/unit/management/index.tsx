import { useUserItems } from "@/hooks/useUserItems";

import DataTable from "@/components/commons/table/data";
import ManagementSelect from "./select";

import { IUserID } from "@/types";

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
  const { items, fetchItems } = useUserItems({ uid });

  return (
    <article className="flex flex-col justify-center items-center gap-4 w-full h-full px-20">
      <DataTable data={items} uid={uid} refetch={fetchItems} columnConfig={columnConfig} renderStatusCell={(itemData) => <ManagementSelect itemData={itemData} refetch={fetchItems} />} />
    </article>
  );
}
