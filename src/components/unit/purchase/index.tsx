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
import BundleDialog from "./dialog/BundleDialog";

import { PurchaseSchema } from "./schema";

import type { IPurchaseSingle, IUserID } from "@/types";
import type { z } from "zod";
import type { RowSelectionState } from "@tanstack/react-table";

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
  const { purchase, createPurchaseSingle, updateSingleToBundled, salesPurchase, deletePurchaseSingle, fetchPurchaseSingle, createPurchaseBundle, fetchLoading } = usePurchase({
    uid,
    selectedYear,
    selectedMonth,
  });
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

  const [isBundleOpen, setIsBundleOpen] = useState(false);
  const [bundleTargets, setBundleTargets] = useState<IPurchaseSingle[]>([]);

  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [saleTarget, setSaleTarget] = useState<IPurchaseSingle | undefined>(undefined);

  // 테이블 스테이트
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const onClickMoveToCreate = () => {
    setIsWriteOpen(true);
  };
  const onClickMoveToDelete = (rowIds: string[]) => {
    setIsDeleteOpen(true);
    setDeleteTargets(rowIds);
  };
  const onClickMoveToBundle = (rowData: IPurchaseSingle[]) => {
    setIsBundleOpen(true);
    setBundleTargets(rowData);
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
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onClickMoveToCreate={onClickMoveToCreate}
        onClickMoveToDelete={onClickMoveToDelete}
        onClickMoveToBundle={onClickMoveToBundle}
        onClickMoveToSale={onClickMoveToSale}
        createProduct={createProduct}
        fetchLoading={fetchLoading}
      />

      {/* 모달 */}
      <WriteDialog uid={uid} form={form} isWriteOpen={isWriteOpen} setIsWriteOpen={setIsWriteOpen} createPurchaseSingle={createPurchaseSingle} fetchPurchaseSingle={fetchPurchaseSingle} />
      <DeleteDialog
        form={form}
        setRowSelection={setRowSelection}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        deleteTargets={deleteTargets}
        deletePurchaseSingle={deletePurchaseSingle}
      />
      <BundleDialog
        uid={uid}
        form={form}
        setRowSelection={setRowSelection}
        isBundleOpen={isBundleOpen}
        setIsBundleOpen={setIsBundleOpen}
        bundleTargets={bundleTargets}
        updateSingleToBundled={updateSingleToBundled}
        createPurchaseBundle={createPurchaseBundle}
      />
      <SaleDialog
        uid={uid}
        isSaleOpen={isSaleOpen}
        setIsSaleOpen={setIsSaleOpen}
        saleTarget={saleTarget}
        setSaleTarget={setSaleTarget}
        salesPurchase={salesPurchase}
        fetchPurchaseSingle={fetchPurchaseSingle}
        createProduct={createProduct}
      />
    </article>
  );
}
