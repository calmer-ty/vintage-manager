import { toast } from "sonner";

// 외부 요소
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Dispatch, SetStateAction } from "react";
import type { ICreateProductParams, IProductPackage } from "@/types";
interface IDialogSaleCreateProps {
  uid: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;

  saleCreateTarget: IProductPackage | undefined;
  createProduct: ({ uid, products }: ICreateProductParams) => Promise<void>;
}

export default function DialogSaleCreate({ uid, isOpen, setIsOpen, saleCreateTarget, createProduct }: IDialogSaleCreateProps) {
  const onClickSaleCreate = async () => {
    if (!saleCreateTarget) {
      toast("⛔ 판매 등록할 패키지를 찾을 수 없습니다.");
      return;
    }

    await createProduct({ uid, products: saleCreateTarget.products });

    toast("✅ 선택한 패키지가 판매 등록되었습니다.");

    setIsOpen(false);
  };

  return (
    <>
      {/* 삭제 모달 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>입고된 패키지를 판매 등록하시겠습니까?</DialogTitle>
            <DialogDescription>선택한 패키지를 판매 등록하면 수정할 수 없습니다.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button variant="default" onClick={onClickSaleCreate}>
              등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
