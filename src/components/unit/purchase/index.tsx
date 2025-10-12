import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useProducts } from "@/hooks/useProducts";
import { useDateSelector } from "@/contexts/dateSelectorContext";
import { usePurchase } from "@/hooks/usePurchase";

import TableUI from "./table";
import WriteDialog from "./dialog/WriteDialog";
import DeleteDialog from "./dialog/DeleteDialog";
import SaleDialog from "./dialog/SaleDialog";

import { PurchaseSchema } from "./schema";

import type { IPurchase, IUserID } from "@/types";
import type { z } from "zod";

const columnConfig = [
  { key: "createdAt", label: "패키지 등록 일자" },
  { key: "name", label: "상품명" },
  { key: "brand", label: "브랜드명" },
  { key: "costPrice", label: "매입가" },
  // { key: "addSaleAt", label: "판매 등록 일자" },
  // { key: "shipping", label: "배송비" },
  // { key: "fee", label: "수수료" },
];

export default function PurchaseUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { purchase, createSingle, salesPurchase, deleteSingle, fetchSingle, fetchLoading } = usePurchase({ uid, selectedYear, selectedMonth });
  const { createProduct } = useProducts({ uid, selectedYear, selectedMonth });

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof PurchaseSchema>>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: {
      name: "",
      brand: "",
      costPrice: { amount: 0, exchange: { code: "", label: "", rate: 0, krw: 0 } },
    },
  });

  // 등록/수정/삭제 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState<string[]>([]);

  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [saleTarget, setSaleTarget] = useState<IPurchase | undefined>(undefined);

  const onClickMoveToDelete = (rowIds: string[]) => {
    setDeleteTargets(rowIds);
    setIsDeleteOpen(true);
  };

  const onClickMoveToSale = (rowId: string) => {
    const selectedRow = purchase.find((p) => p._id === rowId);
    setSaleTarget(selectedRow);
    setIsSaleOpen(true);
  };

  return (
    <article className="px-10 py-6">
      {/* 테이블 */}
      <TableUI
        data={purchase}
        columnConfig={columnConfig}
        setIsWriteOpen={setIsWriteOpen}
        onClickMoveToDelete={onClickMoveToDelete}
        onClickMoveToSale={onClickMoveToSale}
        createProduct={createProduct}
        fetchLoading={fetchLoading}
      />

      {/* 모달 */}
      <WriteDialog uid={uid} form={form} isWriteOpen={isWriteOpen} setIsWriteOpen={setIsWriteOpen} createSingle={createSingle} fetchSingle={fetchSingle} />
      <DeleteDialog form={form} isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} deleteTargets={deleteTargets} deleteSingle={deleteSingle} />
      <SaleDialog
        uid={uid}
        isSaleOpen={isSaleOpen}
        setIsSaleOpen={setIsSaleOpen}
        saleTarget={saleTarget}
        setSaleTarget={setSaleTarget}
        salesPurchase={salesPurchase}
        fetchSingle={fetchSingle}
        createProduct={createProduct}
      />
    </article>
  );
}
