import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useProducts } from "@/hooks/useProducts";
import { useDateSelector } from "@/contexts/dateSelectorContext";
import { usePurchasePackage } from "@/hooks/usePurchasePackage";

import TableUI from "./table";
import WriteDialog from "./dialog/WriteDialog";
import DeleteDialog from "./dialog/DeleteDialog";
import SaleDialog from "./dialog/SaleDialog";
import MergeDialog from "./dialog/MergeDialog";

import { PurchaseSchema } from "./schema";

import type { IPurchasePackage, IUserID } from "@/types";
import type { z } from "zod";
import type { RowSelectionState } from "@tanstack/react-table";

const columnConfig = [
  { key: "createdAt", label: "등록 일자" },
  { key: "products", label: "패키지 정보" },
  // { key: "shipping", label: "배송비" },
  // { key: "fee", label: "수수료" },
];

export default function PurchaseUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { purchasePackages, createPurchasePackage, mergePurchasePackage, salesPurchase, deletePurchasePackage, fetchPurchasePackages, fetchLoading } = usePurchasePackage({
    uid,
    selectedYear,
    selectedMonth,
  });

  const { createProduct } = useProducts({ uid, selectedYear, selectedMonth });

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof PurchaseSchema>>({
    resolver: zodResolver(PurchaseSchema),
    defaultValues: {
      products: [
        {
          name: "",
          brand: "",
          costPrice: { amount: 0, exchange: { code: "", label: "", rate: 0, krw: 0 } },
        },
      ],
    },
  });

  // 등록/수정/삭제 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState<string[]>([]);

  // 묶음 스테이트
  const [isMergeOpen, setIsMergeOpen] = useState(false);
  const [mergeTargets, setMergeTargets] = useState<IPurchasePackage[]>([]);

  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [saleTarget, setSaleTarget] = useState<IPurchasePackage | undefined>(undefined);

  // 테이블 스테이트
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const onClickMoveToCreate = () => {
    setIsWriteOpen(true);
  };
  const onClickMoveToDelete = (rowIds: string[]) => {
    setIsDeleteOpen(true);
    setDeleteTargets(rowIds);
  };
  const onClickMoveToMerge = (rowData: IPurchasePackage[]) => {
    setIsMergeOpen(true);
    setMergeTargets(rowData);
  };
  const onClickMoveToSale = (rowId: string) => {
    const selectedRow = purchasePackages.find((p) => p._id === rowId);
    setSaleTarget(selectedRow);
    setIsSaleOpen(true);
  };

  return (
    <article className="px-10 py-6">
      {/* 테이블 */}
      <TableUI
        data={purchasePackages}
        columnConfig={columnConfig}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onClickMoveToCreate={onClickMoveToCreate}
        onClickMoveToDelete={onClickMoveToDelete}
        onClickMoveToMerge={onClickMoveToMerge}
        onClickMoveToSale={onClickMoveToSale}
        createProduct={createProduct}
        fetchLoading={fetchLoading}
      />

      {/* 모달 */}
      <WriteDialog uid={uid} form={form} isWriteOpen={isWriteOpen} setIsWriteOpen={setIsWriteOpen} createPurchasePackage={createPurchasePackage} fetchPurchasePackages={fetchPurchasePackages} />
      <DeleteDialog
        form={form}
        setRowSelection={setRowSelection}
        isDeleteOpen={isDeleteOpen}
        setIsDeleteOpen={setIsDeleteOpen}
        deleteTargets={deleteTargets}
        deletePurchasePackage={deletePurchasePackage}
      />
      <MergeDialog
        uid={uid}
        form={form}
        setRowSelection={setRowSelection}
        isMergeOpen={isMergeOpen}
        setIsMergeOpen={setIsMergeOpen}
        mergeTargets={mergeTargets}
        mergePurchasePackage={mergePurchasePackage}
      />
      <SaleDialog
        uid={uid}
        isSaleOpen={isSaleOpen}
        setIsSaleOpen={setIsSaleOpen}
        saleTarget={saleTarget}
        setSaleTarget={setSaleTarget}
        salesPurchase={salesPurchase}
        fetchPurchasePackages={fetchPurchasePackages}
        createProduct={createProduct}
      />
    </article>
  );
}
