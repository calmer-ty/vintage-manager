import { useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { useProducts } from "@/hooks/useProducts";
import { useDateSelector } from "@/contexts/dateSelectorContext";
import { useProductPackages } from "@/hooks/useProductPackages";

import TableUI from "./table";
import ReceivingWrite from "./dialog/WriteDialog";
import ReceivingDelete from "./dialog/DeleteDialog";
import ReceivingSale from "./dialog/SaleDialog";

import { PackageSchema } from "./schema";

import type { IPackage, IUserID } from "@/types";
import type { z } from "zod";

const columnConfig = [
  { key: "createdAt", label: "패키지 등록 일자" },
  { key: "addSaleAt", label: "판매 등록 일자" },
  { key: "shipping", label: "배송비" },
  { key: "fee", label: "수수료" },
  { key: "products", label: "개별 상품명 / 매입가" },
];

export default function ReceivingUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const {
    productPackages,
    createProductPackage,
    updateProductPackage,
    salesProductPackage,
    deleteProductPackage,
    fetchProductPackages,
    loading: packagesLoading,
  } = useProductPackages({ uid, selectedYear, selectedMonth });
  const { createProduct } = useProducts({ uid, selectedYear, selectedMonth });

  // ✍️ 폼 설정
  const form = useForm<z.infer<typeof PackageSchema>>({
    resolver: zodResolver(PackageSchema),
    defaultValues: {
      products: [{ name: "", brand: "", costPrice: { amount: 0, exchange: { code: "", label: "", rate: 0, krw: 0 } } }],
    },
  });

  // 등록/수정/삭제 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<IPackage | undefined>(undefined);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState<string[]>([]);

  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [saleTarget, setSaleTarget] = useState<IPackage | undefined>(undefined);

  const onClickMoveToUpdate = (rowId: string) => {
    const selectedRow = productPackages.find((p) => p._id === rowId);
    setUpdateTarget(selectedRow);
    setIsWriteOpen(true);
  };

  const onClickMoveToDelete = (rowIds: string[]) => {
    setDeleteTargets(rowIds);
    setIsDeleteOpen(true);
  };

  const onClickMoveToSale = (rowId: string) => {
    const selectedRow = productPackages.find((p) => p._id === rowId);
    setSaleTarget(selectedRow);
    setIsSaleOpen(true);
  };

  return (
    <article className="px-10 py-6">
      {/* 테이블 */}
      <TableUI
        data={productPackages}
        columnConfig={columnConfig}
        setIsWriteOpen={setIsWriteOpen}
        setUpdateTarget={setUpdateTarget}
        onClickMoveToUpdate={onClickMoveToUpdate}
        onClickMoveToDelete={onClickMoveToDelete}
        onClickMoveToSale={onClickMoveToSale}
        deleteProductPackage={deleteProductPackage}
        createProduct={createProduct}
        packagesLoading={packagesLoading}
      />

      {/* 모달 */}
      <ReceivingWrite
        uid={uid}
        form={form}
        isWriteOpen={isWriteOpen}
        setIsWriteOpen={setIsWriteOpen}
        updateTarget={updateTarget}
        setUpdateTarget={setUpdateTarget}
        createProductPackage={createProductPackage}
        updateProductPackage={updateProductPackage}
        fetchProductPackages={fetchProductPackages}
      />
      <ReceivingDelete form={form} isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} deleteTargets={deleteTargets} deleteProductPackage={deleteProductPackage} />
      <ReceivingSale
        uid={uid}
        isSaleOpen={isSaleOpen}
        setIsSaleOpen={setIsSaleOpen}
        saleTarget={saleTarget}
        setSaleTarget={setSaleTarget}
        salesProductPackage={salesProductPackage}
        fetchProductPackages={fetchProductPackages}
        createProduct={createProduct}
      />
    </article>
  );
}
