import { useEffect, useState } from "react";

import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseApp";

import { useDateSelector } from "@/contexts/dateSelectorContext";
import { useUserItems } from "@/hooks/useUserItems";
import { useTable } from "./hooks/useTable";

import ManagementWrite from "@/components/unit/management/table/write";
import TableControl from "./control";
import TableContent from "./content";

import type { IItemData } from "@/types";
interface IDataTableProps {
  uid: string;
  columnConfig: {
    key: string;
    label: string;
  }[];
  // renderStatusCell?: (item: IItemData) => React.ReactNode;
}

export default function TableUI({ uid, columnConfig }: IDataTableProps) {
  const { selectedYear, selectedMonth } = useDateSelector();
  const { items, createItem, updateItem, fetchItems } = useUserItems({ uid, selectedYear, selectedMonth });

  // 등록/수정 스테이트
  const [isWriteOpen, setIsWriteOpen] = useState(false);
  const [updateTarget, setUpdateTarget] = useState<IItemData | undefined>(undefined);

  // 수정 함수
  const onClickMoveToUpdate = async (selectedItemId: string) => {
    const selectedItem = items.find((item) => item._id === selectedItemId);
    setUpdateTarget(selectedItem);
    setIsWriteOpen(true);
  };
  // 삭제 함수
  const onClickDelete = async (selectedItems: string[]) => {
    // map / forEach를 쓰지 않는 이유는 비동기적으로 한번에 처리되면 순차적으로 삭제가 되지 않을 수도 있기 때문에 for로 함
    for (const id of selectedItems) {
      try {
        await deleteDoc(doc(db, "items", id));
        console.log(`ID ${id} 삭제 성공`);
        fetchItems();
      } catch (error) {
        console.error(`ID ${id} 삭제 실패`, error);
      }
    }
  };

  const { table, columns } = useTable({ items, columnConfig, fetchItems, onClickMoveToUpdate, onClickDelete });

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div
      className="overflow-auto px-6 border rounded-lg shadow-sm 
        max-w-xs
        sm:max-w-lg
        lg:max-w-xl
        xl:max-w-3xl
        2xl:max-w-max"
    >
      {/* 다이얼로그 창 */}
      <ManagementWrite
        isOpen={isWriteOpen}
        setIsOpen={setIsWriteOpen}
        uid={uid}
        createItem={createItem}
        updateItem={updateItem}
        fetchItems={fetchItems}
        updateTarget={updateTarget}
        setUpdateTarget={setUpdateTarget}
      />

      <TableControl table={table} setIsOpen={setIsWriteOpen} onClickDelete={onClickDelete} columnConfig={columnConfig} />
      <TableContent table={table} columns={columns} />
    </div>
  );
}
