import { toast } from "sonner";

// 외부 요소
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import type { Dispatch, SetStateAction } from "react";
import type { ICreateProductParams, IProductPackage, IUpdateProductPackage, IUpdateProductPackageParams } from "@/types";
import type { PackageSchema } from "../../dialog";
import type { z } from "zod";
interface IDialogSaleCreateProps {
  uid: string;
  updateTarget: IProductPackage | undefined;
  setUpdateTarget: Dispatch<SetStateAction<IProductPackage | undefined>>;
  // isSaleCreateOpen: boolean;
  // setIsSaleCreateOpen: Dispatch<SetStateAction<boolean>>;
  // saleCreateTarget: IProductPackage | undefined;

  createProduct: ({ uid, products }: ICreateProductParams) => Promise<void>;
  updateProductPackage: ({ updateTargetId, productPackage }: IUpdateProductPackageParams) => Promise<void>;
}

export default function DialogSaleCreate({ uid, updateTarget, setUpdateTarget, createProduct, updateProductPackage }: IDialogSaleCreateProps) {
  const onClickSaleCreate = async (data: z.infer<typeof PackageSchema>) => {
    if (!updateTarget) {
      toast("⛔ 판매 등록할 패키지를 찾을 수 없습니다.");
      return;
    }

    try {
      const productPackage: IUpdateProductPackage = {
        ...data,
        shipping: {
          amount: data.shipping.amount,
          currency: data.shipping.currency,
        },
      };

      await updateProductPackage({ updateTargetId: updateTarget._id, productPackage });
      await createProduct({ uid, products: updateTarget.products });

      toast("✅ 선택한 패키지가 판매 등록되었습니다.");
    } catch (error) {
      console.error("문서 추가 실패:", error);
    }

    // setIsSaleCreateOpen(false);
  };

  return (
    <>
      <Dialog
        open={!!updateTarget}
        onOpenChange={(open) => {
          if (!open) {
            setUpdateTarget(undefined);
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>입고된 패키지를 판매 등록하시겠습니까?</DialogTitle>
            <DialogDescription>선택한 패키지를 판매 등록하면 수정할 수 없습니다.</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">취소</Button>
            </DialogClose>
            <Button variant="default" onClick={() => onClickSaleCreate}>
              등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
