import { useState } from "react";

import { useDateSelector } from "@/contexts/dateSelectorContext";
import { useProductPackages } from "@/hooks/useProductPackages";

import ReceivingWrite from "./write";
import TableUI from "./table";

import type { IProductPackage, IUserID } from "@/types";
import { useProducts } from "@/hooks/useProducts";
import DialogDelete from "./table/dialog/delete";

const columnConfig = [
  { key: "createdAt", label: "등록 일자" },
  { key: "shipping", label: "배송비" },
  { key: "products", label: "개별 상품명 / 매입가" },
];

export default function ReceivingUI({ uid }: IUserID) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { productPackages, createProductPackage, updateProductPackage, deleteProductPackage, fetchProductPackages, loading } = useProductPackages({ uid, selectedYear, selectedMonth });
  const { createProduct } = useProducts({ uid, selectedYear, selectedMonth });

  // 등록/수정 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<IProductPackage | undefined>(undefined);
  // const [saleTarget, setSaleTarget] = useState<IProductPackage | undefined>(undefined);

  // 패키지 데이터 삭제
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteTargets, setDeleteTargets] = useState<string[]>([]);

  const onClickMoveToDelete = async (rowIds: string[]) => {
    setIsDeleteOpen(true);
    setDeleteTargets(rowIds);
  };

  // props 묶음
  const receivingProps = { setIsWriteOpen, setUpdateTarget, updateProductPackage };

  return (
    <article className="px-10 py-6">
      {/* 테이블 */}
      <TableUI
        {...receivingProps}
        data={productPackages}
        columnConfig={columnConfig}
        onClickMoveToDelete={onClickMoveToDelete}
        deleteProductPackage={deleteProductPackage}
        createProduct={createProduct}
        loading={loading}
      />

      {/* 등록/수정 모달 */}
      <ReceivingWrite
        {...receivingProps}
        uid={uid}
        isWriteOpen={isWriteOpen}
        updateTarget={updateTarget}
        createProductPackage={createProductPackage}
        updateProductPackage={updateProductPackage}
        fetchProductPackages={fetchProductPackages}
      />

      <DialogDelete isDeleteOpen={isDeleteOpen} setIsDeleteOpen={setIsDeleteOpen} deleteTargets={deleteTargets} deleteProductPackage={deleteProductPackage} />
    </article>
  );
}
