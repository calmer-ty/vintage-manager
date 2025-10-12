import { toast } from "sonner";

// 외부 요소
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type z from "zod";
import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { PurchaseSchema } from "../schema";
import type { RowSelectionState } from "@tanstack/react-table";
interface IDeleteDialogProps {
  form: UseFormReturn<z.infer<typeof PurchaseSchema>>;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  isDeleteOpen: boolean;
  setIsDeleteOpen: Dispatch<SetStateAction<boolean>>;
  deleteTargets: string[];
  deletePurchaseSingle: (packageIds: string[]) => Promise<void>;
}

export default function DeleteDialog({ form, setRowSelection, isDeleteOpen, setIsDeleteOpen, deleteTargets, deletePurchaseSingle }: IDeleteDialogProps) {
  // 삭제 함수
  const onClickDelete = async () => {
    await deletePurchaseSingle(deleteTargets);

    toast("🗑️ 선택한 항목이 삭제되었습니다.");
    setIsDeleteOpen(false);
    setRowSelection({});
    form.reset();
  };

  return (
    <>
      {/* 삭제 모달 */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-100">
          <DialogHeader>
            <DialogTitle>매입한 상품을 폐기하셨습니까?</DialogTitle>
            <DialogDescription>선택한 상품을 삭제하면 복구할 수 없습니다.</DialogDescription>
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
