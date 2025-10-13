import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useProducts } from "@/hooks/useProducts";
import { useDateSelector } from "@/contexts/dateSelectorContext";
import { usePackage } from "@/hooks/usePackage";

import TableUI from "./table";
import WriteDialog from "./dialog/WriteDialog";
import DeleteDialog from "./dialog/DeleteDialog";
import SaleDialog from "./dialog/SaleDialog";
import MergeDialog from "./dialog/MergeDialog";

import { PurchaseSchema } from "./schema";

import type { IPackage, IUserID } from "@/types";
import type { z } from "zod";
import type { RowSelectionState } from "@tanstack/react-table";

export default function PurchaseUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { packages, createPackage, mergePackage, salesPackage, deletePackage, fetchPackages, fetchLoading } = usePackage({
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
          costPrice: 0,
          shipping: 0,
          fee: 0,
          exchange: { code: "", label: "", rate: 0, krw: 0 },
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
  const [mergeTargets, setMergeTargets] = useState<IPackage[]>([]);

  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [salesTarget, setSalesTarget] = useState<IPackage>();

  // 테이블 스테이트
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const onClickMoveToCreate = () => {
    setIsWriteOpen(true);
  };
  const onClickMoveToMerge = (rowData: IPackage[]) => {
    setIsMergeOpen(true);
    setMergeTargets(rowData);
  };
  const onClickMoveToSale = (rowData: IPackage) => {
    setIsSaleOpen(true);
    setSalesTarget(rowData);
  };
  const onClickMoveToDelete = (rowIds: string[]) => {
    setIsDeleteOpen(true);
    setDeleteTargets(rowIds);
  };

  return (
    <article className="px-10 py-6">
      {/* 테이블 */}
      <TableUI
        data={packages}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        onClickMoveToCreate={onClickMoveToCreate}
        onClickMoveToMerge={onClickMoveToMerge}
        onClickMoveToSale={onClickMoveToSale}
        onClickMoveToDelete={onClickMoveToDelete}
        createProduct={createProduct}
        fetchLoading={fetchLoading}
      />

      {/* 모달 */}
      <WriteDialog uid={uid} form={form} isWriteOpen={isWriteOpen} setIsWriteOpen={setIsWriteOpen} createPackage={createPackage} fetchPackages={fetchPackages} />
      <DeleteDialog form={form} setRowSelection={setRowSelection} isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} deleteTargets={deleteTargets} deletePackage={deletePackage} />
      <MergeDialog uid={uid} form={form} setRowSelection={setRowSelection} isMergeOpen={isMergeOpen} setIsMergeOpen={setIsMergeOpen} mergeTargets={mergeTargets} mergePackage={mergePackage} />
      <SaleDialog isSaleOpen={isSaleOpen} setIsSaleOpen={setIsSaleOpen} salesTarget={salesTarget} salesPackage={salesPackage} fetchPackages={fetchPackages} createProduct={createProduct} />
    </article>
  );
}
