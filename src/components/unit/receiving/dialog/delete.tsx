import { toast } from "sonner";

// 외부 요소
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Dispatch, SetStateAction } from "react";
interface IReceivingDeleteProps {
  isDeleteOpen: boolean;
  setIsDeleteOpen: Dispatch<SetStateAction<boolean>>;
  deleteTargets: string[];
  deleteProductPackage: (packageIds: string[]) => Promise<void>;
  // setRowSelection: Dispatch<SetStateAction<{ [key: string]: boolean }>>;
}

export default function ReceivingDelete({ isDeleteOpen, setIsDeleteOpen, deleteTargets, deleteProductPackage }: IReceivingDeleteProps) {
  // 삭제 함수
  const onClickDelete = async () => {
    await deleteProductPackage(deleteTargets);
    // setRowSelection({});

    toast(<p className="font-bold">🗑️ 선택한 항목이 삭제되었습니다.</p>, {
      action: {
        label: "닫기",
        onClick: () => {},
      },
      descriptionClassName: "ml-5",
    });

    setIsDeleteOpen(false);
  };

  return (
    <>
      {/* 삭제 모달 */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>입고된 패키지를 삭제하시겠습니까?</DialogTitle>
            <DialogDescription>선택한 패키지를 삭제하면 복구할 수 없습니다.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button variant="destructive" onClick={onClickDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
