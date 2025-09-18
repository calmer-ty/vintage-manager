import { useState } from "react";

import { useDateSelector } from "@/contexts/dateSelectorContext";
import { useProductPackages } from "@/hooks/useProductPackages";

import TableUI from "./table";
import ReceivingWrite from "./dialog/write";
import ReceivingDelete from "./dialog/delete";

import type { IProductPackage, IUserID } from "@/types";
import { useProducts } from "@/hooks/useProducts";

const columnConfig = [
  { key: "createdAt", label: "등록 일자" },
  { key: "shipping", label: "배송비" },
  { key: "products", label: "개별 상품명 / 매입가" },
];

export default function ReceivingUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const {
    productPackages,
    createProductPackage,
    updateProductPackage,
    deleteProductPackage,
    fetchProductPackages,
    loading: packagesLoading,
  } = useProductPackages({ uid, selectedYear, selectedMonth });
  const { createProduct } = useProducts({ uid, selectedYear, selectedMonth });

  // 등록/수정/삭제 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<IProductPackage | undefined>(undefined);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState<string[]>([]);

  const onClickMoveToUpdate = async (rowId: string) => {
    const selectedRow = productPackages.find((p) => p._id === rowId);
    setUpdateTarget(selectedRow);
    setIsWriteOpen(true);
  };

  const onClickMoveToDelete = async (rowIds: string[]) => {
    setIsDeleteOpen(true);
    setDeleteTargets(rowIds);
  };

  return (
    <article className="px-10 py-6">
      {/* 테이블 */}
      <TableUI
        setIsWriteOpen={setIsWriteOpen}
        setUpdateTarget={setUpdateTarget}
        data={productPackages}
        columnConfig={columnConfig}
        onClickMoveToUpdate={onClickMoveToUpdate}
        onClickMoveToDelete={onClickMoveToDelete}
        deleteProductPackage={deleteProductPackage}
        createProduct={createProduct}
        packagesLoading={packagesLoading}
      />

      {/* 등록/수정 모달 */}
      <ReceivingWrite
        setIsWriteOpen={setIsWriteOpen}
        setUpdateTarget={setUpdateTarget}
        uid={uid}
        isWriteOpen={isWriteOpen}
        updateTarget={updateTarget}
        createProductPackage={createProductPackage}
        updateProductPackage={updateProductPackage}
        fetchProductPackages={fetchProductPackages}
      />

      <ReceivingDelete isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} deleteTargets={deleteTargets} deleteProductPackage={deleteProductPackage} />
    </article>
  );
}
