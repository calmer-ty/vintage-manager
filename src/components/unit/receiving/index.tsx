import TableUI from "./table";

import type { IUserID } from "@/types";

const columnConfig = [
  { key: "createdAt", label: "등록 일자" },
  // { key: "exchangeRate", label: "사용 화폐" },
  { key: "shipping", label: "배송비" },
  { key: "products", label: "상품" },
];

export default function ReceivingUI({ uid }: IUserID) {
  return (
    <article className="p-6">
      <TableUI uid={uid} columnConfig={columnConfig} />
    </article>
  );
}
