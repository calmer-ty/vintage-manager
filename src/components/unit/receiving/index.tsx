import { useState } from "react";

import { useProducts } from "@/hooks/useProducts";
import { useDateSelector } from "@/contexts/dateSelectorContext";
import { useProductPackages } from "@/hooks/useProductPackages";

import TableUI from "./table";
import ReceivingWrite from "./dialog/write";
import ReceivingDelete from "./dialog/delete";
import ReceivingSale from "./dialog/sale";

import type { IProductPackage, IUserID } from "@/types";

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

  const [isSaleOpen, setIsSaleOpen] = useState(false);
  const [saleTarget, setSaleTarget] = useState<IProductPackage | undefined>(undefined);

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
        isWriteOpen={isWriteOpen}
        setIsWriteOpen={setIsWriteOpen}
        updateTarget={updateTarget}
        setUpdateTarget={setUpdateTarget}
        uid={uid}
        createProductPackage={createProductPackage}
        updateProductPackage={updateProductPackage}
        fetchProductPackages={fetchProductPackages}
      />
      <ReceivingDelete isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} deleteTargets={deleteTargets} deleteProductPackage={deleteProductPackage} />
      <ReceivingSale
        uid={uid}
        isSaleOpen={isSaleOpen}
        setIsSaleOpen={setIsSaleOpen}
        saleTarget={saleTarget}
        setSaleTarget={setSaleTarget}
        onClickMoveToSale={onClickMoveToSale}
        updateProductPackage={updateProductPackage}
        createProduct={createProduct}
      />
    </article>
  );
}
