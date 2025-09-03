// 외부 요소
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Dispatch, SetStateAction } from "react";
interface ITableDeleteProps {
  isDeleteOpen: boolean;
  setIsDeleteOpen: Dispatch<SetStateAction<boolean>>;
  deleteTargets: string[];
  deleteProductPackage: (packageIds: string[]) => Promise<void>;
  setRowSelection: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
}

export default function TableDelete({ isDeleteOpen, setIsDeleteOpen, deleteTargets, deleteProductPackage, setRowSelection }: ITableDeleteProps) {
  // 삭제 함수
  const onClickDelete = async (packageIds: string[]) => {
    await deleteProductPackage(packageIds);
    setRowSelection({});
  };

  return (
    <>
      {/* 삭제 모달 */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>입고된 패키지를 삭제하시겠습니까?</DialogTitle>
            <DialogDescription>선택한 패키지를 삭제하면 복구할 수 없습니다.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={async () => {
                await onClickDelete(deleteTargets);
                setIsDeleteOpen(false);
              }}
            >
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
