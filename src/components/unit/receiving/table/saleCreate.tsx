import { toast } from "sonner";

// 외부 요소
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Dispatch, SetStateAction } from "react";
import type { ICreateProductParams, IProductPackage } from "@/types";
interface ITableSaleCreateProps {
  uid: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;

  saleCreateTarget: IProductPackage | undefined;
  createProduct: ({ uid, products }: ICreateProductParams) => Promise<void>;
}

export default function TableSaleCreate({ uid, isOpen, setIsOpen, saleCreateTarget, createProduct }: ITableSaleCreateProps) {
  if (!saleCreateTarget) return;
  console.log("saleCreateTarget: ", saleCreateTarget.products);

  const onClickSaleCreate = async () => {
    await createProduct({ uid, products: saleCreateTarget.products });

    toast(<p className="font-bold">선택한 패키지가 판매 등록되었습니다.</p>, {
      action: {
        label: "닫기",
        onClick: () => {},
      },
      descriptionClassName: "ml-5",
    });
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
