import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type z from "zod";
import type { Dispatch, SetStateAction } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ProductsSchema } from "../schema";
import type { RowSelectionState } from "@tanstack/react-table";
interface IDeleteDialogProps {
  form: UseFormReturn<z.infer<typeof ProductsSchema>>;
  isOpen: boolean;
  targets: string[];
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  setRowSelection: Dispatch<SetStateAction<RowSelectionState>>;
  deletePackage: (targets: string[]) => Promise<void>;
}

export default function DeleteDialog({ form, isOpen, targets, setIsOpen, setRowSelection, deletePackage }: IDeleteDialogProps) {
  const onClickDelete = async () => {
    await deletePackage(targets);

    toast("🗑️ 선택한 항목이 삭제되었습니다.");
    setIsOpen(false);
    setRowSelection({});
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>패키지를 폐기하셨습니까?</DialogTitle>
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
  );
}
