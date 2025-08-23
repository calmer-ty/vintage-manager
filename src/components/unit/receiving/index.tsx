import TableUI from "./table";

import type { IUserID } from "@/types";

const columnConfig = [
  { key: "createdAt", label: "등록 일자" },
  { key: "soldAt", label: "판매 일자" },
  { key: "category", label: "상품 종류" },
  { key: "brand", label: "브랜드명" },
  { key: "name", label: "상품명" },
  { key: "costPrice", label: "매입가" },
  { key: "costPriceKRW", label: "매입가(원화)" },
  { key: "salePrice", label: "판매가" },
  { key: "profit", label: "예상 이익" },
];

export default function ReceivingUI({ uid }: IUserID) {
  return (
    <article className="p-6">
      <TableUI uid={uid} columnConfig={columnConfig} />
    </article>
  );
}
