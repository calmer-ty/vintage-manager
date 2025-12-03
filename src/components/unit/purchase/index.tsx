import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useDateSelectStore } from "@/store/useDateSelectStore";
import { useProducts } from "@/hooks/useProducts";
import { usePackages } from "@/hooks/usePackages";

import YearMonthSelect from "@/components/commons/YearMonthSelect";
import TableUI from "./table";
import WriteDialog from "./dialog/WriteDialog";
import DeleteDialog from "./dialog/DeleteDialog";
import SaleDialog from "./dialog/SaleDialog";
import MergeDialog from "./dialog/MergeDialog";

import { ProductsSchema } from "./schema";
import type { IPackage } from "@/types";
import type { z } from "zod";
import type { RowSelectionState } from "@tanstack/react-table";

export default function PurchaseUI() {
  const { selectedYear, selectedMonth, setSelectedYear, setSelectedMonth } = useDateSelectStore();
  const { packages, createPackage, mergePackage, salesPackage, deletePackage, fetchPackages, loading } = usePackages({
    selectedYear,
    selectedMonth,
  });

  const { createProduct } = useProducts({ selectedYear, selectedMonth });

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

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof ProductsSchema>>({
    resolver: zodResolver(ProductsSchema),
    defaultValues: {
      products: [
        {
          name: "",
          brand: "",
          cost: { price: 0, shipping: 0, fee: 0, exchange: { code: "", label: "", rate: 0, krw: 0 } },
        },
      ],
    },
  });

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
    setRowSelection({});
  };
  const onClickMoveToDelete = (rowIds: string[]) => {
    setIsDeleteOpen(true);
    setDeleteTargets(rowIds);
  };

  return (
    <article className="px-6 py-6 sm:px-10">
      <header className="flex justify-end mb-6">
        <YearMonthSelect
          selectedYear={selectedYear}
          selectedMonth={selectedMonth}
          setSelectedYear={setSelectedYear}
          setSelectedMonth={setSelectedMonth}
        />
      </header>
      {/* 테이블 */}
      <TableUI
        data={packages}
        loading={loading}
        rowSelection={rowSelection}
        onClickMoveToCreate={onClickMoveToCreate}
        onClickMoveToMerge={onClickMoveToMerge}
        onClickMoveToSale={onClickMoveToSale}
        onClickMoveToDelete={onClickMoveToDelete}
        setRowSelection={setRowSelection}
      />
      {/* 모달 */}
      <WriteDialog
        form={form}
        isOpen={isWriteOpen}
        setIsOpen={setIsWriteOpen}
        setRowSelection={setRowSelection}
        createPackage={createPackage}
        fetchPackages={fetchPackages}
      />
      <DeleteDialog
        form={form}
        isOpen={isDeleteOpen}
        targets={deleteTargets}
        setIsOpen={setIsDeleteOpen}
        setRowSelection={setRowSelection}
        deletePackage={deletePackage}
      />
      <MergeDialog
        form={form}
        isOpen={isMergeOpen}
        targets={mergeTargets}
        setIsOpen={setIsMergeOpen}
        setRowSelection={setRowSelection}
        mergePackage={mergePackage}
        fetchPackages={fetchPackages}
      />
      <SaleDialog
        isOpen={isSaleOpen}
        target={salesTarget}
        setIsOpen={setIsSaleOpen}
        setRowSelection={setRowSelection}
        createProduct={createProduct}
        salesPackage={salesPackage}
        fetchPackages={fetchPackages}
      />
    </article>
  );
}
